const handleError = require('./error');
const config = require('./config');
const jwt = require('jsonwebtoken');


const checkUser = (req, res, next) => {
	let token;
	const authorization = req.get('authorization');
	if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
		token = authorization.substring(7);
		const decodedToken = jwt.verify(token, config.SECRET_KEY);
		if (!token || !decodedToken.id) {
			res.status(401).json({ error: 'token missing or invalid' });
		}
		req.body.userId = decodedToken.id;
		next();
	} else {
		res.status(401).json({ error: 'no authorization token provided' })
	}
}

const exceptionHandler = (err, req, res, next) => {
	handleError(err, res);
	next(err);
}

module.exports = {
	exceptionHandler,
	checkUser
}