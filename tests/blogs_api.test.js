const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog');
const User = require('../models/user');
const blogApiHelper = require('./test_api_helper');
const bcrypt = require('bcrypt');

const api = supertest(app);
let token;
beforeEach(async () => {
	await Promise.all([Blog.deleteMany({}), User.deleteMany({})]);
	const { username, name, password } = blogApiHelper.initialUser;
	const passwordSalt = 10;
	const passwordHash = await bcrypt.hash(password, passwordSalt);
	const newUser = {
		username,
		name,
		passwordHash
	}
	const user = new User(newUser);
	await user.save();
	const [savedUser] = await blogApiHelper.usersInDb();
	const { id } = savedUser;
	let dbCalls = blogApiHelper.initialBlogs.map(blog => new Blog({...blog, user: id }));
	dbCalls = dbCalls.map(obj => obj.save());
	await Promise.all(dbCalls);
});

describe('GET Requests', () => {
	test('should retrieve a list of blogs', async () => {
		const response = await api.get('/api/blogs')
			.expect(200)
			.expect('Content-Type', /application\/json/);
		const titles = response.body.map(r => r.title)
		expect(response.body).toHaveLength(blogApiHelper.initialBlogs.length);
		expect(titles).toContain('This is the first blog');
	});
	
	test('should retrieve a blog with id property', async () => {
		const response = await api.get('/api/blogs')
			.expect(200)
			.expect('Content-Type', /application\/json/);
		const blog = response.body[0]
		expect(blog.id).toBeDefined();
	})

	test('should retrieve a blog by id', async () => {
		const [targetBlog] = await blogApiHelper.blogsInDb();
		const { id } = targetBlog;
		const [savedUser] = await blogApiHelper.usersInDb();
		const response = await api.get(`/api/blogs/${id}`)
			.expect(200);
		delete savedUser.blogs;
		expect(response.body).toEqual({...targetBlog, user: { ...savedUser } })
	})
})

describe('POST requests', () => {
	beforeEach(async () => {
		const { username, password } = blogApiHelper.initialUser;
		const loginResponse = await api.post('/api/login')
			.send({ username, password });
		token = loginResponse.body.token;
	});

	test('should be able to create a new blog', async () => {
		const [user] = await blogApiHelper.usersInDb();
		const { id } = user;

		const response = await api.post('/api/blogs')
			.send({ ...blogApiHelper.newBlog, userId: id })
			.expect(401)
		
		expect(response.body.error).toContain('no authorization token');

		await api.post('/api/blogs')
			.set({ Authorization: `Bearer ${token}` })
			.send({ ...blogApiHelper.newBlog, userId: id })
			.expect(201)
			.expect('Content-Type', /application\/json/);
	
		const getResponse = await api.get('/api/blogs')
			.expect(200)
			.expect('Content-Type', /application\/json/);
		const blogs = getResponse.body;
		expect(blogs).toHaveLength(3);
	})
	
	test('should default likes to 0 if no likes is passed', async () => {
		const [user] = await blogApiHelper.usersInDb();
		const { id } = user;
		const response = await api.post('/api/blogs')
			.set('Authorization', `Bearer ${token}`)
			.send({ ...blogApiHelper.blogWithNoLikes, userId: id })
			.expect(201)
			.expect('Content-Type', /application\/json/);
		const blog = response.body;
		expect(blog.likes).toBe(0);
	})
	
	test('should cause a 400 error when blog has no title and author', async () => {
		const [user] = await blogApiHelper.usersInDb();
		const { id } = user;
		await api.post('/api/blogs')
			.set('Authorization', `Bearer ${token}`)
			.send({ ...blogApiHelper.blogWithNoTitleAndUrl, userId: id })
			.expect(400)
	})
})

describe('DELETE requests', () => {
	beforeEach(async () => {
		const { username, password } = blogApiHelper.initialUser;
		const loginResponse = await api.post('/api/login')
			.send({ username, password });
		token = loginResponse.body.token;
	});

	test('it should delete user by id', async () => {
		const [blogInDb] = await blogApiHelper.blogsInDb();
		const { id } = blogInDb;
		await api.delete(`/api/blogs/${id}`)
			.set('Authorization', `Bearer ${token}`)
			.expect(204);
		
		const blogsInDb = await blogApiHelper.blogsInDb();
		expect(blogsInDb).toHaveLength(blogApiHelper.initialBlogs.length - 1);
		const content = blogsInDb.map(blog => blog.title);
		expect(content).not.toContain(blogInDb.title);
	});
	test('it should only allow users with a token to a delete a blog', async () => {
		const [blogInDb] = await blogApiHelper.blogsInDb();
		const { id } = blogInDb;
		const response = await api.delete(`/api/blogs/${id}`)
			.expect(401);
		
		expect(response.body.error).toContain('no authorization token');
	});
	test('it should only allow the associated user to delete a blog', async () => {
		const passwordSalt = 10
		const password = 'hihhoppity';
		const username = 'bingbong';
		const passwordHash = await bcrypt.hash(password, passwordSalt);
		const newUser = {
			name: 'marshall',
			username,
			passwordHash
		};
		const user = new User(newUser);
		await user.save();
		const loginResponse = await api.post('/api/login')
			.send({ username, password })
		const newToken = loginResponse.body.token;

		const [blogInDb] = await blogApiHelper.blogsInDb();
		const { id } = blogInDb
		const errorResponse = await api.delete(`/api/blogs/${id}`)
			.set('Authorization', `Bearer ${newToken}`)
			.expect(401)
		
		expect(errorResponse.body.error).toContain('current user is unable to delete this blog')

	});
	test('it should cause a 404 error when deleting a blog that doesnt exist', async () => {
		const fakeId = '422111922';
		await api.delete(`/api/blogs/${fakeId}`)
			.set('Authorization', `Bearer ${token}`)
			.expect(404);
	});
})

describe('PUT requests', () => {
	beforeEach(async () => {
		const { username, password } = blogApiHelper.initialUser;
		const loginResponse = await api.post('/api/login')
			.send({ username, password });
		token = loginResponse.body.token;
	});

	test('it should allow updates to likes', async () => {
		const [targetBlog] = await blogApiHelper.blogsInDb();
		const { id } = targetBlog;
		const updatedLikes = { likes: 45 };
		await api.put(`/api/blogs/${id}`)
			.set('Authorization', `Bearer ${token}`)
			.send(updatedLikes)
			.expect(200);
		const response = await api.get(`/api/blogs/${id}`)
			.expect(200);
		const blog = response.body;
		expect(blog.likes).toBe(45);
	})
	test('it should cause a 404 error when updating likes of a blog that doesn\'t exist', async () => {
		const id = '5e912018bdbedb3fd2ff148e';
		const updatedLikes = { likes: 45 };
		await api.put(`/api/blogs/${id}`)
			.set('Authorization', `Bearer ${token}`)
			.send(updatedLikes)
			.expect(404);
	})
})

afterAll(async () => {
	await mongoose.connection.close();
});