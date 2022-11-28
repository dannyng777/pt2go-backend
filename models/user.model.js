const mongoose = require('mongoose')

const User = new mongoose.Schema(
    {
		firstname: { type: String, required: true },
        lastname: {type: String, required: true},
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		occupation: { type: String, required: true },
		quote: { type: String },
		exercises: []
	},
	{ collection: 'user-data' } //creating a table essentially 
)

const model = mongoose.model('UserData', User) //compiling a model from a schema User

module.exports = model