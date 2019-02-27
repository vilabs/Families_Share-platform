const mongoose = require('mongoose');
//const bcrypt = require('bcrypt');

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

// userSchema.pre('save', function (next) {
// 	var user = this;
// 	if (!user.isModified('password')) return next();
// 	bcrypt.genSalt(10, function (err, salt) {
// 		if (err) return next(err);
// 		bcrypt.hash(user.password, salt, function (err, hash) {
// 			if (err) return next(err);
// 			user.password = hash;
// 			next();
// 		});
// 	});
// });

// userSchema.methods.comparePassword = function(candidatePassword) {
// 	return bcrypt.compare(candidatePassword, this.password)
// };

userSchema.index({ email: 1, password: 1}); 

mongoose.pluralize(null);
const model = mongoose.model('User', userSchema);

module.exports = model ;