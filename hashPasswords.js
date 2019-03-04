const bcrypt = require('bcrypt')
const User = require('./src/models/User');

User.find({}, (err, users) => {
	users.forEach(user => {
		bcrypt.genSalt(10, function (err, salt) {
			bcrypt.hash(user.password, salt, function (err, hash) {
				user.password = hash;
				user.save()
			});
		});
	});
});