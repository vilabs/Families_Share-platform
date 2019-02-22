process.env.NODE_ENV = 'test';

const Profile = require('../src/models/profile');
const Address = require('../src/models/address');
const Image = require('../src/models/image');
const User = require('../src/models/user');
const Rating = require('../src/models/rating');
const Device = require('../src/models/device');
const Password_Reset = require('../src/models/password-reset')

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../src/index');
let should = chai.should();

chai.use(chaiHttp);

describe('Users', () => {
	before(async () => {
		await User.deleteMany({})
		await Profile.deleteMany({})
		await Image.deleteMany({})
		await Rating.deleteMany({})
		await Address.deleteMany({})
		await Device.deleteMany({})
		await Password_Reset.deleteMany({})
	});
	describe('/Post/users', () => {
		it('it should sign up a user with correct parameters', (done) => {
			let user = {
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
	describe('/Post/users', () => {
		it('it should not sign up a user with no parameters', (done) => {
			let user = {
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
	describe('/Post/users/authenticate/email', () => {
		it('it should log in a user with correct credentials', (done) => {
			let credentials = {
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
	describe('/Post/users/authenticate/email', () => {
		it('it should not log in a user with wrong credentials', (done) => {
			let credentials = {
				email: 'test@emil.com',
				password: 'passwword'
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
	describe('/Post/users/authenticate/email', () => {
		it('it should not log in a user with no credentials', (done) => {
			let credentials = {
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
	describe('/Post/users/forgotpassword', () => {
		it('it should send a forgot password email for an existing user', (done) => {
			let data = { email: "test@email.com"}
			chai.request(server)
				.post('/users/forgotpassword')
				.send(data)
				.end((err, res) => {
					res.should.have.status(200);
					done();
				});
		});
	});
	describe('/Post/users/forgotpassword', () => {
		it('it should not send a forgot password email for non existing user', (done) => {
			let data = { email: "fas@jela.com" };
			chai.request(server)
				.post('/users/forgotpassword')
				.send(data)
				.end((err, res) => {
					res.should.have.status(404);
					done();
				});
		});
	});
	describe('/Post/users/changepassword', () => {
		it('it should change the password of the user  when a valid token is provided', async () => {
			let data = { password: "password"}
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
	describe('/Post/users/changepassword', () => {
		it('it should not change the password of the user when an invalid token is provided', (done) => {
			let data = { password: "password"}
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
	describe('/Get/users/id', () => {
		it('it should fetch a user by the given id', (done) => {
			User.findOne({}, (err,user)=>{
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
	describe('/Get/users/id', () => {
		it('it should not fetch a user when token user_id doesnt match request user_id', (done) => {
			User.findOne({}, (err, user) => {
				chai.request(server)
					.get(`/users/${"wrong_request_id"}`)
					.set('Authorization', user.token)
					.end((err, res) => {
						res.should.have.status(401);
						done();
					});
			})
		});
	});
	describe('/Delete/users/id', () => {
		it('it should delete a user by the given id', (done) => {
			User.findOne({email: 'test@email.com'}, (err, user) => {
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
});
