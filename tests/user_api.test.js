const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const User = require('../models/user');
const userApiHelper = require('./test_api_helper');
const bcrypt = require('bcrypt');

const api = supertest(app);
let token;
beforeEach(async () => {
	await User.deleteMany({});
	const { username, name, password } = userApiHelper.initialUser;
	const passwordSalt = 10;
	const passwordHash = await bcrypt.hash(password, passwordSalt);
	const newUser = {
		username,
		name,
		passwordHash
	}
	const user = new User(newUser);
	await user.save();
	const response = await api.post('/api/login')
		.send({ username, password })
	token = response.body.token;
});

describe('Creating a new user', () => {
	test('it should be able to create a new user', async () => {
		const newUser = {
			username: 'helloworld',
			password: 'mammamia',
			name: 'frank'
		};
		await api.post('/api/users/new')
			.set('Authorization', `Bearer ${token}`)
			.send(newUser)
			.expect(200)
			.expect('Content-Type', /application\/json/)
	});

	test('it should create a 400 error if username already exists', async () => {
		const newUser = {
			username: userApiHelper.initialUser.username,
			password: 'blahg',
			name: 'hemi'
		}
		const response = await api.post('/api/users/new')
			.set('Authorization', `Bearer ${token}`)
			.send(newUser)
			.expect(400)
			.expect('Content-Type', /application\/json/)

		expect(response.body.error).toContain('`username` to be unique')
		const users = await userApiHelper.usersInDb();
		expect(users).toHaveLength(1);
	})

	test('it should create a 400 error if the password is shorter then 5 characters', async () => {
		const shortPasswordUser = {
			username: 'boopboop',
			password: 'be',
			name: 'hooop'
		}
		const response = await api.post('/api/users/new')
			.set('Authorization', `Bearer ${token}`)
			.send(shortPasswordUser)
			.expect(400)
		expect(response.body.error).toContain('Password is too short')
		const users = await userApiHelper.usersInDb();
		expect(users).toHaveLength(1);
	})

	test('it should create a 400 error if the password is shorter then 5 characters', async () => {
		const shortUsernameUser = {
			username: 'as',
			password: 'longlong',
			name: 'power'
		}
		const response = await api.post('/api/users/new')
			.set('Authorization', `Bearer ${token}`)
			.send(shortUsernameUser)
			.expect(400)
		expect(response.body.error).toContain('Username is too short')
		const users = await userApiHelper.usersInDb();
		expect(users).toHaveLength(1);
	})

	test('it should get all users and their blog posts', async () => {
		const [user] = await userApiHelper.usersInDb();
		const userId = user.id;
		const json = {
			...userApiHelper.newBlog,
			userId
		}

		await api.post('/api/blogs')
			.set('Authorization', `Bearer ${token}`)
			.send(json)
			.expect(201)
			.expect('Content-Type', /application\/json/);
		
		const response = await api.get('/api/users')
			.set('Authorization', `Bearer ${token}`)
			.expect(200)
		
		const [result] = response.body;);
		expect(result.blogs).toBeDefined()
		expect(result.blogs).toHaveLength(1);

		const title = result.blogs.map(blog => blog.title)
		expect(title).toContain('Hello this is a new blog');
	});
	
})

afterAll(async () => {
	await mongoose.connection.close();
});
