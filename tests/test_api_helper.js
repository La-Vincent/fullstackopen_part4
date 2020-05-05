const Blog = require('../models/blog');
const User = require('../models/user');

const initialBlogs = [
	{
		title: 'This is the first blog',
		author: 'Blog McBloggerSon',
		url: 'http://localhost',
		likes: 5
	},
	{
		title: 'A second blog',
		author: 'Son of Sun',
		url: 'http://localhost',
		likes: 2
	}
];

const initialUser = {
	username: 'johnnycash',
	password: 'hellorek',
	name: 'johnny'
}

const newBlog = {
	title: 'Hello this is a new blog',
	author: 'John Wilkes Booth',
	url: 'http://yahoo.com',
	likes: 12
};

const blogWithNoLikes = {
	title: 'This has no likes',
	author: 'Mr no like',
	url: 'http://bing.com'
}

const blogWithNoTitleAndUrl = {
	author: 'Hello Mr Banks',
	likes: 5
}

const blogsInDb = async () => {
	const blogs = await Blog.find({});
	return blogs.map(blog => blog.toJSON());
}

const usersInDb = async () => {
	const users = await User.find({})
	return users.map(user => user.toJSON());
}

module.exports = {
	initialUser,
	initialBlogs,
	newBlog,
	blogWithNoLikes,
	blogWithNoTitleAndUrl,
	blogsInDb,
	usersInDb
}