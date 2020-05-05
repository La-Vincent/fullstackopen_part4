const loginRouter = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../utils/config');
const User = require('../models/user');


loginRouter.post('/', async (req, res, next) => {
	try {
		const { username, password } = req.body;
		const user = await User.findOne({ username });
		const passwordCorrect = user === null ?
			false : await bcrypt.compare(password, user.passwordHash)
		if (!(passwordCorrect && user)) {
			res.status(401).json({
				error: 'invalid username or password'
			})
		}
	
		const userToken = {
			username: user.username,
			id: user.id
		}
		const token = jwt.sign(userToken, config.SECRET_KEY);
		res.status(200).send({ token, username: user.username, name: user.name });
	} catch (exception) {
		next(exception);
	}
});

module.exports = loginRouter;