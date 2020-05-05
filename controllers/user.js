const userRouter = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const middleware = require('../utils/middleware');

userRouter.get('/', async (_, res, next) => {
	try {
		const users = await User.find({}).populate('blogs');
		res.status(200).json(users.map(user => user.toJSON()));
	} catch (exception) {
		next(exception)
	}
})

userRouter.post('/new', middleware.checkUser, async (req, res, next) => {
	try {
		const { password, username, name } = req.body;
		const passwordSalt = 10;
		if (!username || !password) {
			//generate error must provide username and password
			throw new Error('A Username and Password must be provided');
		} 
		if (password && password.length < 3) {
			//generate error password too short
			throw new Error('The provided Password is too short');
		}
		if (username && username.length < 3) {
			throw new Error('The provided Username is too short');
		}
		const passwordHash = await bcrypt.hash(password, passwordSalt);
		const user = new User({ username, passwordHash, name })
		const savedUser = await user.save();
		res.json(savedUser);
	} catch (exception) {
		next(exception);
	}
});

module.exports = userRouter;