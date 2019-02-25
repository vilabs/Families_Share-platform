const common = require('../common')
const server = common.server;
const chai = common.chai;

const User = require('../../src/models/user');
const Group = require('../../src/models/group');
const Member = require('../../src/models/member');

describe('/Post/users/id/groups', () => {
	it('it shoud add a user as a group member', (done) => {
		User.findOne({ email: "test3@email.com" }, (err, user) => {
			Group.findOne({ name: "Test Group Edit" }, (error, group) => {
				const member = {
					group_accepted: true,
					user_accepted: true,
					admin: false,
					group_id: group.group_id,
					user_id: user.user_id,
				}
				chai.request(server)
					.post(`/users/${user.user_id}/groups`)
					.set('Authorization', user.token)
					.send(member)
					.end((err, res) => {
						res.should.have.status(200);
						done();
					});
			})
		});
	});
});
describe('/Get/users/id/groups', () => {
	it('it should get a users joined groups when token user_id matches request user_id', (done) => {
		User.findOne({ email: "test3@email.com" }, (err, user) => {
			chai.request(server)
				.get(`/users/${user.user_id}/groups`)
				.set('Authorization', user.token)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('array');
					res.body.length.should.be.eql(2)
					done();
				});
		})
	});
});
describe('/Get/users/id/groups', () => {
	it('it should not get a users joined groups when token user_id doesnt match request user_id', (done) => {
		User.find({}, (err, users) => {
			chai.request(server)
				.get(`/users/${users[0].user_id}/groups`)
				.set('Authorization', users[1].token)
				.end((err, res) => {
					res.should.have.status(401);
					done();
				});
		})
	});
});
describe('/Patch/users/id/groups', () => {
	it('it should patch a users membership when token user_id matches request user_id', (done) => {
		User.findOne({ email: "test3@email.com" }, (err, user) => {
			const patch = {
				admin: true
			};
			chai.request(server)
				.patch(`/users/${user.user_id}/groups`)
				.set('Authorization', user.token)
				.send(patch)
				.end((err, res) => {
					res.should.have.status(200);
					done();
				});
		})
	});
});
describe('/Patch/users/id/groups', () => {
	it('it should not patch a users membership when token user_id doesnt match request user_id', (done) => {
		User.find({}, (err, users) => {
			const patch = {
				admin: true,
			};
			chai.request(server)
				.patch(`/users/${users[0].user_id}/groups`)
				.set('Authorization', users[1].token)
				.send(patch)
				.end((err, res) => {
					res.should.have.status(401);
					done();
				});
		})
	});
});

