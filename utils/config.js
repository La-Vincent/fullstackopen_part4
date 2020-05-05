require('dotenv').config();

let PORT = process.env.PORT;
let MONGODB_URI = process.env.MONGODB_URI;
let SECRET_KEY = process.env.SECRET_KEY;

if (process.env.NODE_ENV === 'development') {
	MONGODB_URI = process.env.TEST_MONGODB_URI;
}

module.exports = {
	PORT,
	MONGODB_URI,
	SECRET_KEY
}