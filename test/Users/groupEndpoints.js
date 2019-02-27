const common = require('../common')
const server = common.server;
const chai = common.chai;

const User = require('../../src/models/user');
const Group = require('../../src/models/group');

describe('/Post/users/id/groups', () => {
	it('it shoud add an authenticated user as member of a group given the correct parameters', (done) => {
		User.findOne({ email: "test3@email.com" }, (err, user) => {
			Group.findOne({ name: "Test Group Edit" }, (error, group) => {
				const member = {
					group_accepted: true,
					user_accepted: true,
					admin: false,
					group_id: group.group_id,
					user_id: user.user_id,
				};
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
describe('/Post/users/id/groups', () => {
	it('it shoud not add a user as member of a group given incorrect parameters', (done) => {
		User.findOne({ email: "test3@email.com" }, (err, user) => {
			Group.findOne({ name: "Test Group Edit" }, (error, group) => {
				const member = {
					group_accepted: true,
					user_id: user.user_id,
				}
				chai.request(server)
					.post(`/users/${user.user_id}/groups`)
					.set('Authorization', user.token)
					.send(member)
					.end((err, res) => {
						res.should.have.status(400);
						done();
					});
			})
		});
	});
});
describe('/Post/users/id/groups', () => {
	it('it shoud not add a user as member of a group when user is not authenticated ', (done) => {
		User.findOne({ email: "test4@email.com" }, (err, user) => {
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
					.send(member)
					.end((err, res) => {
						res.should.have.status(401);
						done();
					});
			})
		});
	});
});
describe('/Get/users/id/groups', () => {
	it('it should fetch a users joined groups when token user_id matches request user_id', (done) => {
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
describe('/Get/users/id/groups', () =>  {
	it('it should not fetch a users joined groups when token user_id doesnt match request user_id', (done) => {
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
describe('/Get/users/id/groups', () =>  {
	it('it should not fetch a users joined groups when user is authorized but hasnt joined any groups', (done) => {
		User.findOne({ email: "test4@email.com"}, (err, user) => {
			chai.request(server)
				.get(`/users/${user.user_id}/groups`)
				.set('Authorization', user.token)
				.end((err, res) => {
					res.should.have.status(404);
					done();
				});
		})
	});
});
describe('/Patch/users/id/groups', () => {
	it('it should patch a users membership when token user_id matches request user_id', (done) => {
		User.findOne({ email: "test3@email.com" }, (err, user) => {
			Group.findOne({ name: "Test Group Edit" }, (err, group) => {
				const data = {
					patch : {
						user_accepted: true
					},
				};				
				chai.request(server)
					.patch(`/users/${user.user_id}/groups/${group.group_id}`)
					.set('Authorization', user.token)
					.send(data)
					.end((err, res) => {
						res.should.have.status(200);
						done();
					});
			});
		});
	});
});
describe('/Patch/users/id/groups', () => {
	it('it should not patch a users membership when token user_id doesnt match request user_id', (done) => {
		Group.findOne({ name: "Test Group Edit" }, (err, group) => {
			User.find({}, (err, users) => {
				const data = {
					patch : {
						user_accepted: true
					},
				};
				chai.request(server)
					.patch(`/users/${users[0].user_id}/groups/${group.group_id}`)
					.set('Authorization', users[1].token)
					.send(data)
					.end((err, res) => {
						res.should.have.status(401);
						done();
					});
			});
		});
	});
});
describe('/Patch/users/id/groups', () => {
	it('it should not patch a users membership when parameters are incorrect', (done) => {
		User.findOne({}, (err, user) => {
			Group.findOne({ name: "Test Group Edit" }, (err, group) => {
				const data = {
					patch : {
						admin: true
					},
				};
				chai.request(server)
					.patch(`/users/${user.user_id}/groups/${group.group_id}`)
					.set('Authorization', user.token)
					.send(data)
					.end((err, res) => {
						res.should.have.status(400);
						done();
					});
			})
		});
	});
});
describe('/Delete/users/id/groups/groupId', () => {
	it('it should remove a user from a group when token user_id matches request user_id', (done) => {
		User.findOne({ email: "test3@email.com" }, (err, user) => {
			Group.findOne({ name: "Test Group Edit" }, (err, group) => {
				chai.request(server)
					.delete(`/users/${user.user_id}/groups/${group.group_id}`)
					.set('Authorization', user.token)
					.end((err, res) => {
						res.should.have.status(200)
						done()
					});
			});
		});
	});
});
describe('/Delete/users/id/groups/groupId', () => {
	it('it should not remove a user from a group when token user_id doesnt match request user_id', (done) => {
		User.find({}, (err, users) => {
			Group.findOne({ name: "Test Group Edit" }, (err, group) => {
				chai.request(server)
					.delete(`/users/${users[0].user_id}/groups/${group.group_id}`)
					.set('Authorization', users[1].token)
					.end((err, res) => {
						res.should.have.status(401)
						done()
					});
			});
		});
	});
});

