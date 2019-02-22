const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    user_id: {
        type: String,
        unique: true,
		},
		token: String,
    provider: String,
    email: String,
    password: String,
		auth0_token: String,
		last_login: Date,
		language: String,
},{timestamps: true});

mongoose.pluralize(null);
const model = mongoose.model('User', userSchema);

module.exports = model ;