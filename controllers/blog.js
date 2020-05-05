const blogRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');
const middleware = require('../utils/middleware');

blogRouter.get('/', async (_, response, next) => {
	try {
		const blogs = await Blog.find({}).populate('user');
		response.json(blogs.map(blog => blog.toJSON()));
	} catch (exception) {
		next(exception);
	}
})
  
blogRouter.get('/:id', async (req, res, next) => {
	try {
		const { id } = req.params;
		const blog = await Blog.findById(id).populate('user', { username: 1, name: 1 });
		res.status(200).json(blog.toJSON());
	} catch (exception) {
		next(exception);
	}
})
  
blogRouter.post('/', middleware.checkUser, async (request, response, next) => {
	const { title, author, url, likes, userId } = request.body;
	try {
		const user = await User.findById(userId);
		const blog = new Blog({title, author, url, likes, user: user._id });
		const result = await blog.save();
		user.blogs = user.blogs.concat(result._id)
		await user.save();
		response.status(201).json(result.toJSON());
	} catch (exception) {
		next(exception)
	}
})

blogRouter.delete('/:id', middleware.checkUser, async (req, res, next) => {
	const { id } = req.params;
	const { userId } = req.body;
	try {
		const found = await Blog.findById(id);
		if (found && found.user.toString() === userId) {
			await Blog.deleteOne({ _id: id });
			res.sendStatus(204);
		} else {
			res.status(401).json({ error: 'current user is unable to delete this blog'});
		}
	} catch (exception) {
		next(exception);
	}
})

blogRouter.put('/:id', middleware.checkUser, async (req, res, next) => {
	const { id } = req.params;
	const update = req.body;
	try {
		const updatedBlog = await Blog.findByIdAndUpdate(id, update, { new: true });
		if (updatedBlog) {
			res.status(200).json(updatedBlog);
		}
		res.sendStatus(404);
	} catch (exception) {
		next(exception);
	}

})

module.exports = blogRouter;