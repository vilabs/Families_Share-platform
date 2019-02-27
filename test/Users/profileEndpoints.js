const common = require('../common')
const server = common.server;
const chai = common.chai;

const User = require('../../src/models/user');
const Notification = require('../../src/models/notification');


describe('/Get/users/id/profile', () => {
	it('it should fetch an authenticated users profile', (done) => {
		User.findOne({}, (err, user) => {
			chai.request(server)
				.get(`/users/${user.user_id}/profile`)
				.set('Authorization', user.token)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('user_id').eql(user.user_id);
					res.body.should.have.property('email');
					res.body.should.have.property('phone');
					res.body.should.have.property('phone_type');
					res.body.should.have.property('family_name');
					res.body.should.have.property('given_name');
					res.body.should.have.property('visible');
					res.body.should.have.property('image');
					res.body.should.have.property('address');
					done();
				});
		});
	});
});
describe('/Get/users/id/profile', () => {
	it('it should not fetch an unauthenticated users profile', (done) => {
		User.findOne({}, (err, user) => {
			chai.request(server)
				.get(`/users/${user.user_id}/profile`)
				.end((err, res) => {
					res.should.have.status(401);
					done();
				});
		});
	});
});
describe('/Get/users/id/profile', () => {
	it('it should not fetch an non existing users profile', (done) => {
		User.findOne({}, (err, user) => {
			chai.request(server)
				.get(`/users/12/profile`)
				.set('Authorization', user.token)
				.end((err, res) => {
					res.should.have.status(404);
					done();
				});
		});
	});
});
describe('/Patch/users/id/profile', () => {
	it('it should patch a users profile when token user_id matches request user_id', (done) => {
		User.findOne({}, (err, user) => {
			const patch = {
				given_name: "Dead",
				family_name: "Pool",
			};
			chai.request(server)
				.patch(`/users/${user.user_id}/profile`)
				.set('Authorization', user.token)
				.send(patch)
				.end((err, res) => {
					res.should.have.status(200);
					done();
				});
		});
	});
});
describe('/Patch/users/id/profile', () => {
	it('it should not patch a users profile when token user_id doesnt match request user_id', (done) => {
		User.find({}, (err, users) => {
			const patch = {
				given_name: "Dead",
				family_name: "Pool",
			};
			chai.request(server)
				.patch(`/users/${users[0].user_id}/profile`)
				.set('Authorization', users[1].token)
				.send(patch)
				.end((err, res) => {
					res.should.have.status(401);
					done();
				});
		});
	});
});
describe('/Patch/users/id/profile', () => {
	it('it should not patch a users profile with incorrect parameters', (done) => {
		User.findOne({}, (err, user) => {
			const patch = {
			  foo: "bar",
			};
			chai.request(server)
				.patch(`/users/${user.user_id}/profile`)
				.set('Authorization', user.token)
				.send(patch)
				.end((err, res) => {
					res.should.have.status(400);
					done();
				});
		});
	});
});
describe('/Get/users/id/notifications', () => {
	it('it should fetch a users notification when token user_id matches request user_id', (done) => {
		User.findOne({email:"test@email.com"}, (err, user) => {
			chai.request(server)
				.get(`/users/${user.user_id}/notifications`)
				.set('Authorization', user.token)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('array');
					done();
				});
		});
	});
});
describe('/Get/users/id/notifications', () => {
	it('it should not fetch a users notification when token user_id doesnt match request user_id', (done) => {
		User.find({}, (err, users) => {
			chai.request(server)
				.get(`/users/${users[1].user_id}/notifications`)
				.set('Authorization', users[0].token)
				.end((err, res) => {
					res.should.have.status(401);
					done();
				});
		});
	});
});
describe('/Get/users/id/notifications', () => {
	it('it should not fetch users notifications when he hasnt got any', (done) => {
		User.findOne({email:"test4@email.com"}, (err, user) => {
			chai.request(server)
				.get(`/users/${user.user_id}/notifications`)
				.set('Authorization', user.token)
				.end((err, res) => {
					res.should.have.status(404);
					done();
				});
		});
	});
});
describe('/Patch/users/id/notifications', () => {
	it('it should patch a users notifications as read when token user_id matches request user_id', (done) => {
		User.findOne({email:"test@email.com"}, (err, user) => {
			chai.request(server)
				.patch(`/users/${user.user_id}/notifications`)
				.set('Authorization', user.token)
				.end((err, res) => {
					res.should.have.status(200);
					done();
				});
		});
	});
});
describe('/Patch/users/id/notifications', () => {
	it('it should patch a users notifications as read when token user_id matches request user_id', (done) => {
		User.find({}, (err, users) => {
			chai.request(server)
				.patch(`/users/${users[0].user_id}/notifications`)
				.set('Authorization', users[1].token)
				.end((err, res) => {
					res.should.have.status(401);
					done();
				});
		});
	});
});