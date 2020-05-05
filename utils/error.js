const handleError = (err, res) => {
	const { message, name, path } = err;
	if (name === 'CastError' && path === '_id') {
		return res.status(404).send({ error: 'malformatted id' })
	} else if (name === 'ValidationError') {
		return res.status(400).json({ error: message })
	} else if (name === 'JsonWebTokenError') {
		return res.status(401).json({
			error: 'invalid token'
		})
	} else {
		return res.status(400).json({ error: message })
	}
};

module.exports = handleError