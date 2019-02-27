const common = require('../common')
const server = common.server;
const chai = common.chai;

const User = require('../../src/models/user');
const Password_Reset = require('../../src/models/password-reset')

describe('/Post/users', () =>{
	it('it should sign up a user with correct parameters', (done) => {
		const user = {
			given_name: "Test",
			family_name: "User",
			number: "0123546879",
			email: "test@email.com",
			password: "password",
			visible: true,
			language: "en",
		}
		chai.request(server)
			.post('/users')
			.send(user)
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.a('object');
				res.body.should.have.property('id')
				res.body.should.have.property('email')
				res.body.should.have.property('name')
				res.body.should.have.property('image')
				res.body.should.have.property('token')
				done();
			});
	});
});
describe('/Post/users', () =>{
	it('it should not sign up a user with incorrect parameters', (done) => {
		const user = {
		}
		chai.request(server)
			.post('/users')
			.send(user)
			.end((err, res) => {
				res.should.have.status(400);
				done();
			});
	});
});
describe('/Post/users', () =>{
	it('it should not sign up a user with an already existing email', (done) => {
		const user = {
			given_name: "Testo",
			family_name: "Usero",
			number: "0123546879",
			email: "test@email.com",
			password: "password",
			visible: false,
			language: "en",
		}
		chai.request(server)
			.post('/users')
			.send(user)
			.end((err, res) => {
				res.should.have.status(409);
				done();
			});
	});
});
describe('/Post/users/authenticate/email', () =>{
	it('it should log in a user with correct credentials', (done) => {
		const credentials = {
			email: 'test@email.com',
			password: 'password',
			language: "en"
		}
		chai.request(server)
			.post('/users/authenticate/email')
			.send(credentials)
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.a('object');
				res.body.should.have.property('id')
				res.body.should.have.property('email')
				res.body.should.have.property('name')
				res.body.should.have.property('image')
				res.body.should.have.property('token')
				done();
			});
	});
});
describe('/Post/users/authenticate/email', () =>{
	it('it should not log in a user with wrong credentials', (done) => {
		const credentials = {
			email: 'test@email.com',
			password: 'pawword'
		}
		chai.request(server)
			.post('/users/authenticate/email')
			.send(credentials)
			.end((err, res) => {
				res.should.have.status(401);
				done();
			});
	});
});
describe('/Post/users/authenticate/email', () =>{
	it('it should not log in a user with no credentials', (done) => {
		const credentials = {
		}
		chai.request(server)
			.post('/users/authenticate/email')
			.send(credentials)
			.end((err, res) => {
				res.should.have.status(401);
				done();
			});
	});
});
describe('/Post/users/authenticate/google', () =>{
	it('it should log in a user with his google account', (done) => {
		const data = {
			deviceToken: "deviceToken",
			language: "en",
			origin: "native",
			response: {
				user: {
					email: "test@email.com"
				},
				idToken: "googletoken"
			}
		}
		chai.request(server)
			.post('/users/authenticate/google')
			.send(data)
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.a('object');
				res.body.should.have.property('id');
				res.body.should.have.property('email');
				res.body.should.have.property('name');
				res.body.should.have.property('image');
				res.body.should.have.property('token');
				res.body.should.have.property('google_token');
				res.body.should.have.property('origin').eql('native');
				done();
			});
	});
});
describe('/Post/users/authenticate/google', () =>{
	it('it should sign up a user with his google account', (done) => {
		const data = {
			language: "en",
			origin: "native",
			response: {
				user: {
					email: "test4@email.com",
					givenName: "Test",
					familyName: "User4",
					photo: "/images/groups/group_default_photo.png",
				},
				idToken: "googletoken"
			}
		}
		chai.request(server)
			.post('/users/authenticate/google')
			.send(data)
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.a('object');
				res.body.should.have.property('id');
				res.body.should.have.property('email');
				res.body.should.have.property('name');
				res.body.should.have.property('image');
				res.body.should.have.property('token');
				res.body.should.have.property('google_token');
				res.body.should.have.property('origin').eql('native');
				done();
			});
	});
});
describe('/Post/users/forgotpassword', () =>{
	it('it should send a forgot password email for an existing user', (done) => {
		const data = { email: "test@email.com" }
		chai.request(server)
			.post('/users/forgotpassword')
			.send(data)
			.end((err, res) => {
				res.should.have.status(200);
				done();
			});
	});
});
describe('/Post/users/forgotpassword', () =>{
	it('it should not send a forgot password email for non existing user', (done) => {
		const data = { email: "fas@jela.com" };
		chai.request(server)
			.post('/users/forgotpassword')
			.send(data)
			.end((err, res) => {
				res.should.have.status(404);
				done();
			});
	});
});
describe('/Get/users/changepassword', () =>{
	it('it should fetch a users profile given a valid reset token', async () => {
		reset = await Password_Reset.findOne({})
		chai.request(server)
			.get('/users/changepassword')
			.set('Authorization', reset.token)
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.a('object');
				res.body.should.have.property('user_id').eql(reset.user_id)
				res.body.should.have.property('image')
				res.body.should.have.property('given_name')
				res.body.should.have.property('family_name')
			});
	});
});
describe('/Get/users/changepassword', () =>{
	it('it should not fetch a users profile given a invalid reset token', async () => {
		reset = await Password_Reset.findOne({})
		chai.request(server)
			.get('/users/changepassword')
			.set('Authorization', 'invalidtoken')
			.end((err, res) => {
				res.should.have.status(401);
			});
	});
});
describe('/Get/users/changepassword', () =>{
	it('it should not fetch a users profile given a valid authentication token', async () => {
		user = await User.findOne({})
		chai.request(server)
			.get('/users/changepassword')
			.set('Authorization', user.token)
			.end((err, res) => {
				res.should.have.status(404);
			});
	});
});
describe('/Post/users/changepassword', () =>{
	it('it should change the password of the user  when a valid reset token is provided', async () => {
		const data = { password: "password" }
		reset = await Password_Reset.findOne({})
		chai.request(server)
			.post('/users/changepassword')
			.set('Authorization', reset.token)
			.send(data)
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.a('object');
				res.body.should.have.property('id')
				res.body.should.have.property('email')
				res.body.should.have.property('name')
				res.body.should.have.property('image')
				res.body.should.have.property('token')
			});
	});
});
describe('/Post/users/changepassword', () =>{
	it('it should not change the password of the user when an invalid token is provided', (done) => {
		let data = { password: "password" }
		chai.request(server)
			.post('/users/changepassword')
			.set('Authorization', "invalidtoken")
			.send(data)
			.end((err, res) => {
				res.should.have.status(401);
				done();
			});
	});
});
describe('/Post/users/changepassword', () =>{
	it('it should not change the password of the user when a valid authentication token is provided', (done) => {
		let data = { password: "password" }
		User.findOne({}, (err, user) => {
			chai.request(server)
				.post('/users/changepassword')
				.set('Authorization', user.token)
				.send(data)
				.end((err, res) => {
					res.should.have.status(404);
					done();
				});
		});
	});
});
describe('/Get/users/id', () =>{
	it('it should fetch a user by the given id when user is authenticated', (done) => {
		User.findOne({}, (err, user) => {
			chai.request(server)
				.get(`/users/${user.user_id}`)
				.set('Authorization', user.token)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('email')
					res.body.should.have.property('password')
					res.body.should.have.property('token')
					res.body.should.have.property('language')
					res.body.should.have.property('user_id').eql(user.user_id)
					done();
				});
		})
	});
});
describe('/Get/users/id', () =>{
	it('it should not fetch a user by the given id when user is not authenticated', (done) => {
		User.findOne({}, (err, user) => {
			chai.request(server)
				.get(`/users/${user.user_id}`)
				.set('Authorization', 'invalidtoken')
				.end((err, res) => {
					res.should.have.status(401);
					done();
				});
		})
	});
});
describe('/Get/users/id', () =>{
	it('it should not fetch a user when token user_id doesnt match request user_id', (done) => {
		User.find({}, (err, users) => {
			chai.request(server)
				.get(`/users/${users[0].user_id}`)
				.set('Authorization', users[1].token)
				.end((err, res) => {
					res.should.have.status(401);
					done();
				});
		})
	});
});
describe('/Delete/users/id', () =>{
	it('it should delete a user by the given id when token user_id matched request user_id', (done) => {
		User.findOne({ email: 'test2@email.com' }, (err, user) => {
			chai.request(server)
				.delete(`/users/${user.user_id}`)
				.set('Authorization', user.token)
				.end((err, res) => {
					res.should.have.status(200);
					done();
				});
		})
	});
});
describe('/Delete/users/id', () =>{
	it('it should not delete a user when token user_id doesnt match request user_id', (done) => {
		User.find({}, (err, users) => {
			chai.request(server)
				.delete(`/users/${users[0].user_id}`)
				.set('Authorization', users[1].token)
				.end((err, res) => {
					res.should.have.status(401);
					done();
				});
		})
	});
});
describe("/Post/users/id/export", () =>{
	it('it should a export a users data by a given id when request user_id matches token user_id', (done) => {
		User.findOne({}, (err, user) => {
			chai.request(server)
				.post(`/users/${user.user_id}/export`)
				.set('Authorization', user.token)
				.end((err, res) => {
					res.should.have.status(200);
					done();
				})
		});
	});
});
describe("/Post/users/id/export", () =>{
	it('it should not a export a users data by a given id when request user_id doesnt match token user_id', (done) => {
		User.find({}, (err, users) => {
			chai.request(server)
				.post(`/users/${users[0].user_id}/export`)
				.set('Authorization', users[1].token)
				.end((err, res) => {
					res.should.have.status(401);
					done();
				})
		});
	});
});
describe("/Post/users/id/export", () =>{
	it('it should not a export a users data by a given id when an invalid token is provided', (done) => {
		User.find({}, (err, users) => {
			chai.request(server)
				.post(`/users/${users[0].user_id}/export`)
				.set('Authorization', 'invalid token')
				.end((err, res) => {
					res.should.have.status(401);
					done();
				})
		});
	});
});

