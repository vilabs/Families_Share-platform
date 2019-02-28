const common = require('../common')
const server = common.server;
const chai = common.chai;

const User = require('../../src/models/user');
const Group = require('../../src/models/group');
const Group_Settings = require('../../src/models/group-settings');

describe("/Post/groups", () => {
	it("it should create a group given correct parameters when user is authenticated", (done) => {
		User.findOne({ email: "test@email.com" }, (err, user) => {
			const group = {
				name: "Test Group",
				description: "An awesome group",
				visible: true,
				location: "Kuala lumpur",
				owner_id: user.user_id,
				invite_ids: [],
			};
			chai
				.request(server)
				.post("/groups")
				.set('Authorization', user.token)
				.send(group)
				.end((err, res) => {
					res.should.have.status(200);
					done();
				});
		});
	});
});
describe("/Post/groups", () => {
	it("it should not create a group when user isnt authenticated", (done) => {
		User.findOne({ email: "test@email.com" }, (err, user) => {
			const group = {
				name: "Test Group",
				description: "An awesome group",
				visible: true,
				location: "Kuala lumpur",
				owner_id: user.user_id,
				invite_ids: [],
			};
			chai
				.request(server)
				.post("/groups")
				.set('Authorization', 'invalidtoken')
				.send(group)
				.end((err, res) => {
					res.should.have.status(401);
					done();
				});
		});
	});
});
describe("/Post/groups", () => {
	it("it should not create a group given incorrect parameters", (done) => {
		User.findOne({ email: "test@email.com" }, (err, user) => {
			const group = {
				name: "Test Group",
				location: "Kuala lumpur",
			};
			chai
				.request(server)
				.post("/groups")
				.set('Authorization', user.token)
				.send(group)
				.end((err, res) => {
					res.should.have.status(400);
					done();
				});
		});
	});
});
describe("/Get/groups/suggestions", () => {
	it("it should fetch group suggestions", (done) => {
		chai
			.request(server)
			.get("/groups/suggestions")
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.a('array');
				res.body.length.should.be.eql(3);
				done();
			});
	});
});
describe("/Get/groups", () => {
	it("it should fetch all visible groups when user is authenticated", (done) => {
		User.findOne({}, (err, user) => {
			chai
				.request(server)
				.get("/groups")
				.set('Authorization', user.token)
				.query({ "searchBy": "visibility",visible: true })
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('array');
					res.body.length.should.be.eql(3);
					done();
				});
		});
	});
});
describe("/Get/groups", () => {
	it("it should fetch groups from a list of ids", (done) => {
		User.findOne({}, (err, user) => {
			Group.find({}, (err, groups) => {
				chai
					.request(server)
					.get("/groups")
					.set('Authorization', user.token)
					.query({ "searchBy": "ids", ids: [groups.map(group=>group.group_id)]})
					.end((err, res) => {
						res.should.have.status(200);
						res.body.should.be.a('array');
						res.body.length.should.be.eql(3);
						done();
					});
			});
		});
	});
});
describe("/Get/groups", () => {
	it("it should not fetch groups from a list of invalid ids", (done) => {
		User.findOne({}, (err, user) => {
			chai
				.request(server)
				.get("/groups")
				.set('Authorization', user.token)
				.query({ "searchBy": "ids", ids: ['invalidid'] })
				.end((err, res) => {
					res.should.have.status(404);
					done();
				});
		});
	});
});
describe("/Get/groups", () => {
	it("it should not fetch all visible groups when user isnt authenticated", (done) => {
		User.findOne({}, (err, user) => {
			chai
				.request(server)
				.get("/groups")
				.set('Authorization', 'invalidtoken')
				.query({ "searchBy": "visibility",visible: true })
				.end((err, res) => {
					res.should.have.status(401);
					done();
				});
		});
	});
});
describe("/Get/groups", () => {
	it("it should not fetch anything when there are no visible groups", (done) => {
		User.findOne({}, (err, user) => {
			Group_Settings.updateMany({}, { visible: false }, (err) => {
				chai
					.request(server)
					.get("/groups")
					.set('Authorization', user.token)
					.query({ "searchBy": "visibility", visible: true })
					.end((err, res) => {
						res.should.have.status(404);
						done();
					});
			});
		});
	});
});
describe("/Get/groups", () => {
	it("it should not fetch groups given an incorrect query", (done) => {
		User.findOne({}, (err, user) => {
			chai
				.request(server)
				.get("/groups")
				.set('Authorization', user.token)
				.query({ "searchBy": "foo" })
				.end((err, res) => {
					res.should.have.status(400);
					done();
				});
		});
	});
});
describe("/Get/groups/id", () => {
	it("it should fetch a group by the given id", (done) => {
		Group.findOne({}, (err, group) => {
			chai
				.request(server)
				.get(`/groups/${group.group_id}`)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('group_id').eql(group.group_id);
					res.body.should.have.property('name');
					res.body.should.have.property('image');
					res.body.image.should.be.a('object');
					res.body.image.should.have.property('path');
					res.body.should.have.property('description');
					res.body.should.have.property('location');
					res.body.should.have.property('background');
					res.body.should.have.property('owner_id');
					res.body.should.have.property('calendar_id');
					res.body.should.have.property('settings_id');
					done();
				});
		});
	});
});
describe("/Get/groups/id", () => {
	it("it should not fetch a group given an incorrect id", (done) => {
		chai
			.request(server)
			.get(`/groups/incorrectid`)
			.end((err, res) => {
				res.should.have.status(404);
				done();
			});
	});
});
describe("/Patch/groups/id", () => {
	it("it should edit a group when given correct parameters and user is admin and authenticated", (done) => {
		const patch = {
			name: "Test Group Edit",
			description: "An awesome group Edit",
			background: "#ffffff",
			location: "Kuala Lumpur Edit",
			visible: true,
		}
		User.findOne({ email: "test@email.com" }, (error, user) => {
			Group.findOne({name: "Test Group"}, (err, group) => {
				chai
					.request(server)
					.patch(`/groups/${group.group_id}`)
					.set('Authorization', user.token)
					.send(patch)
					.end((err, res) => {
						res.should.have.status(200);
						done();
					});
			});
		});
	});
});
describe("/Patch/groups/id", () => {
	it("it should not edit a group when user isnt authenticated", (done) => {
		const patch = {
			name: "Test Group Edit",
			description: "An awesome group Edit",
			background: "#ffffff",
			location: "Kuala Lumpur Edit",
			visible: true,
		}
		User.findOne({ email: "test@email.com" }, (error, user) => {
			Group.findOne({name: "Test Group Edit"}, (err, group) => {
				chai
					.request(server)
					.patch(`/groups/${group.group_id}`)
					.set('Authorization', 'invalidtoken')
					.send(patch)
					.end((err, res) => {
						res.should.have.status(401);
						done();
					});
			});
		});
	});
});
describe("/Patch/groups/id", () => {
	it("it should not edit a group when user isnt a group member", (done) => {
		const patch = {
			name: "Test Group Edit",
			description: "An awesome group Edit",
			background: "#ffffff",
			location: "Kuala Lumpur Edit",
			visible: true,
		}
		User.findOne({ email: "test4@email.com" }, (error, user) => {
			Group.findOne({name: "Test Group Edit"}, (err, group) => {
				chai
					.request(server)
					.patch(`/groups/${group.group_id}`)
					.set('Authorization', user.token)
					.send(patch)
					.end((err, res) => {
						res.should.have.status(401);
						done();
					});
			});
		});
	});
});
describe("/Patch/groups/id", () => {
	it("it should not edit a group when given correct parameters and user is not admin", (done) => {
		const patch = {
			name: "Test Group Edit",
			description: "An awesome group Edit",
			background: "#ffffff",
			location: "Kuala Lumpur Edit",
			visible: true,
		}
		User.findOne({ email: "test3@email.com" }, (error, user) => {
			Group.findOne({name: "Test Group Edit"}, (err, group) => {
				chai
					.request(server)
					.patch(`/groups/${group.group_id}`)
					.set('Authorization', user.token)
					.send(patch)
					.end((err, res) => {
						res.should.have.status(401);
						done();
					});
			});
		});
	});
});
describe("/Patch/groups/id", () => {
	it("it should not edit a group when given incorrect parameters", (done) => {
		const patch = {
			name: "Test Group Edit",
			visible: true,
		}
		User.findOne({ email: "test@email.com" }, (error, user) => {
			Group.findOne({name: "Test Group Edit"}, (err, group) => {
				chai
					.request(server)
					.patch(`/groups/${group.group_id}`)
					.set('Authorization', user.token)
					.send(patch)
					.end((err, res) => {
						res.should.have.status(400);
						done();
					});
			});
		});
	});
});
describe("/Get/groups/id/settings", () => {
	it("it should get a group's settings by a given id ", (done) => {
		User.findOne({ email: "test@email.com" }, (error, user) => {
			Group.findOne({}, (err, group) => {
				chai
					.request(server)
					.get(`/groups/${group.group_id}/settings`)
					.set('Authorization', user.token)
					.end((err, res) => {
						res.should.have.status(200);
						res.body.should.be.a('object');
						res.body.should.have.property('group_id').eql(group.group_id);
						res.body.should.have.property('open');
						res.body.should.have.property('visible');
						done();
					});
			});
		});
	});
});
describe("/Get/groups/id/settings", () => {
	it("it should not get a group's settings given an incorrect id", (done) => {
		User.findOne({ email: "test@email.com" }, (error, user) => {
			chai
				.request(server)
				.get(`/groups/incorrectid/settings`)
				.set('Authorization', user.token)
				.end((err, res) => {
					res.should.have.status(404);
					done();
				});
		});
	});
});
describe("/Patch/groups/id/settings", () => {
	it("it should update a group's settings by a given id when user is authenticated and admin", (done) => {
		User.findOne({ email: "test@email.com" }, (error, user) => {
			Group.findOne({name: "Test Group Edit"}, (err, group) => {
				const patch = {
					open: false,
				}
				chai
					.request(server)
					.patch(`/groups/${group.group_id}/settings`)
					.set('Authorization', user.token)
					.send(patch)
					.end((err, res) => {
						res.should.have.status(200);
						done();
					});
			});
		});
	});
});
describe("/Patch/groups/id/settings", () => {
	it("it should not update a group's settings by a given id when user isnt authenticated", (done) => {
		User.findOne({ email: "test@email.com" }, (error, user) => {
			Group.findOne({name: "Test Group Edit"}, (err, group) => {
				const patch = {
					open: false,
				}
				chai
					.request(server)
					.patch(`/groups/${group.group_id}/settings`)
					.set('Authorization', 'invalidtoken')
					.send(patch)
					.end((err, res) => {
						res.should.have.status(401);
						done();
					});
			});
		});
	});
});
describe("/Patch/groups/id/settings", () => {
	it("it should not update a group's settings by a given id when user is not a group member", (done) => {
		User.findOne({ email: "test4@email.com" }, (error, user) => {
			Group.findOne({name: "Test Group Edit"}, (err, group) => {
				const patch = {
					open: false,
				}
				chai
					.request(server)
					.patch(`/groups/${group.group_id}/settings`)
					.set('Authorization', user.token)
					.send(patch)
					.end((err, res) => {
						res.should.have.status(401);
						done();
					});
			});
		});
	});
});
describe("/Patch/groups/id/settings", () => {
	it("it should not update a group's settings by a given id when user is not admin", (done) => {
		User.findOne({ email: "test3@email.com" }, (error, user) => {
			Group.findOne({name: "Test Group Edit"}, (err, group) => {
				const patch = {
					open: false,
				}
				chai
					.request(server)
					.patch(`/groups/${group.group_id}/settings`)
					.set('Authorization', user.token)
					.send(patch)
					.end((err, res) => {
						res.should.have.status(401);
						done();
					});
			});
		});
	});
});
describe("/Delete/groups/id", () => {
	it("it should delete a group by a given id when user is admin", (done) => {
		User.findOne({ email: "test3@email.com" }, (error, user) => {
			Group.findOne({name: "Test Group 3"}, (err, group) => {
				chai
					.request(server)
					.delete(`/groups/${group.group_id}`)
					.set('Authorization', user.token)
					.end((err, res) => {
						res.should.have.status(200);
						done();
					});
			});
		});
	});
});
describe("/Delete/groups/id", () => {
	it("it should not delete a group by a given id when user isnt authenticated", (done) => {
		User.findOne({ email: "test3@email.com" }, (error, user) => {
			Group.findOne({name: "Test Group Edit"}, (err, group) => {
				chai
					.request(server)
					.delete(`/groups/${group.group_id}`)
					.set('Authorization', 'invalidtoken')
					.end((err, res) => {
						res.should.have.status(401);
						done();
					});
			});
		});
	});
});
describe("/Delete/groups/id", () => {
	it("it should not delete a group by a given id when user isnt a group member", (done) => {
		User.findOne({ email: "test4@email.com" }, (error, user) => {
			Group.findOne({name: "Test Group Edit"}, (err, group) => {
				chai
					.request(server)
					.delete(`/groups/${group.group_id}`)
					.set('Authorization', user.token)
					.end((err, res) => {
						res.should.have.status(401);
						done();
					});
			});
		});
	});
});
describe("/Delete/groups/id", () => {
	it("it should not delete a group by a given id when user is not admin", (done) => {
		User.findOne({ email: "test3@email.com" }, (error, user) => {
			Group.findOne({name: "Test Group Edit"}, (err, group) => {
				chai
					.request(server)
					.delete(`/groups/${group.group_id}`)
					.set('Authorization', user.token)
					.end((err, res) => {
						res.should.have.status(401);
						done();
					});
			});
		});
	});
});