const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true,
		minLength: 5
	},
	name: String,
	passwordHash: {
		type: String,
		required: true
	},
	blogs: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Blog'
		}
	]
})

userSchema.set('toJSON', {
  transform: function (_, returnedObj) {
    returnedObj.id = returnedObj._id.toString()
    delete returnedObj._id
	delete returnedObj.__v
	delete returnedObj.passwordHash;
  }
})

userSchema.plugin(uniqueValidator);

const User = mongoose.model('User', userSchema)


module.exports = User;