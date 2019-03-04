const common = require('../common')
const server = common.server;
const chai = common.chai;

const User = require('../../src/models/user');
const Group = require('../../src/models/group');
const Member = require('../../src/models/member')

describe("/Post/groups/id/members", () => {
	it("it should invite new members to the group when user is authenticated and admin", async () => {
		const user = await User.findOne({ email: "test@email.com" })
		const user2 = await User.findOne({ email: "test4@email.com" })
		const group = await Group.findOne({ name: "Test Group Edit" })
		const invitations = {
			inviteIds: [user2.user_id]
		};
		chai
			.request(server)
			.post(`/groups/${group.group_id}/members`)
			.set('Authorization', user.token)
			.send(invitations)
			.end((err, res) => {
				res.should.have.status(200);
			});
	});
});
describe("/Post/groups/id/members", () => {
	it("it should not invite new members to the group when user is authenticated but not admin", async () => {
		const user = await User.findOne({ email: "test3@email.com" })
		const user2 = await User.findOne({ email: "test4@email.com" })
		const group = await Group.findOne({ name: "Test Group Edit" })
		const invitations = {
			inviteIds: [user2.user_id]
		};
		chai
			.request(server)
			.post(`/groups/${group.group_id}/members`)
			.set('Authorization', user.token)
			.send(invitations)
			.end((err, res) => {
				res.should.have.status(401);
			});
	});
});
describe("/Post/groups/id/members", () => {
	it("it should not invite new members to the group when user is authenticated but not admin", async () => {
		const user = await User.findOne({ email: "test4@email.com" })
		const user2 = await User.findOne({ email: "test4@email.com" })
		const group = await Group.findOne({ name: "Test Group Edit" })
		const invitations = {
			inviteIds: [user2.user_id]
		};
		chai
			.request(server)
			.post(`/groups/${group.group_id}/members`)
			.set('Authorization', user.token)
			.send(invitations)
			.end((err, res) => {
				res.should.have.status(401);
			});
	});
});
describe("/Post/groups/id/members", () => {
	it("it should not invite new members to the group when user isnt authenticated", async () => {
		const user = await User.findOne({ email: "test@email.com" })
		const group = await Group.findOne({ name: "Test Group Edit" })
		const invitations = {
			inviteIds: [user.user_id]
		};
		chai
			.request(server)
			.post(`/groups/${group.group_id}/members`)
			.set('Authorization', 'invalidtoken')
			.send(invitations)
			.end((err, res) => {
				res.should.have.status(401);
			});
	});
});
describe("/Get/groups/id/members", () => {
	it("it should fetch the members of an existing group", (done) => {
		Group.findOne({ name: "Test Group Edit" }, (err, group) => {
			chai
				.request(server)
				.get(`/groups/${group.group_id}/members`)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('array');
					done();
				});
		});
	});
});
describe("/Get/groups/id/members", () => {
	it("it should not fetch the members of an  non existing group", (done) => {
		chai
			.request(server)
			.get(`/groups/invalidid/members`)
			.end((err, res) => {
				res.should.have.status(404);
				done();
			});
	});
});
describe("/Patch/groups/id/members", () => {
	it("it should accept a new member of a group when user is authenticated and admin", async () => {
		const user = await User.findOne({ email: "test@email.com" })
		const user2 = await User.findOne({ email: "test3@email.com" })
		const group = await Group.findOne({ name: "Test Group 2"})
		await Member.create({
			user_id: user.user_id,
			group_id: group.group_id,
			admin: false,
			group_accepted: false,
			user_accepted: true,
		})
		const data = {
			user_id: user.user_id,
		  patch : {
			group_accepted: true,
		},

	}
		chai
			.request(server)
			.patch(`/groups/${group.group_id}/members`)
			.set('Authorization', user2.token)
			.send(data)
			.end((err, res) => {
				res.should.have.status(200);
			});
	});
});
describe("/Patch/groups/id/members", () => {
	it("it should add a new admin to a group when user is authenticated and admin", async () => {
		const user = await User.findOne({ email: "test@email.com" })
		const user2 = await User.findOne({ email: "test3@email.com" })
		const group = await Group.findOne({ name: "Test Group 2"})
		const data = {
			user_id: user.user_id,
		  patch : {
			admin: true,
		},
	}
		chai
			.request(server)
			.patch(`/groups/${group.group_id}/members`)
			.set('Authorization', user2.token)
			.send(data)
			.end((err, res) => {
				res.should.have.status(200);
			});
	});
});
describe("/Patch/groups/id/members", () => {
	it("it should not patch a group member when parameters are incorrect", async () => {
		const user = await User.findOne({ email: "test@email.com" })
		const user2 = await User.findOne({ email: "test3@email.com" })
		const group = await Group.findOne({ name: "Test Group 2"})
		const data = {
			user_id: user.user_id,
		  patch : {
			foo: true,
		},
	}
		chai
			.request(server)
			.patch(`/groups/${group.group_id}/members`)
			.set('Authorization', user2.token)
			.send(data)
			.end((err, res) => {
				res.should.have.status(400);
			});
	});
});
describe("/Patch/groups/id/members", () => {
	it("it should not add pach a group member when user is not authenticated", async () => {
		const user = await User.findOne({ email: "test@email.com" })
		const user2 = await User.findOne({ email: "test3@email.com" })
		const group = await Group.findOne({ name: "Test Group 2"})
		const data = {
			user_id: user.user_id,
		  patch : {
			admin: true,
		},
	}
		chai
			.request(server)
			.patch(`/groups/${group.group_id}/members`)
			.set('Authorization', 'invalidtoken')
			.send(data)
			.end((err, res) => {
				res.should.have.status(401);
			});
	});
});
describe("/Patch/groups/id/members", () => {
  it("it should not add pach a group member when user is not group admin", async () => {
    const user = await User.findOne({ email: "test@email.com" });
    const group = await Group.findOne({ name: "Test Group 2" });
    await Member.updateOne(
      { group_id: group.group_id, user_id: user.user_id },
      { admin: false }
    );
    const data = {
      user_id: user.user_id,
      patch: {
        admin: true
      }
    };
    chai
      .request(server)
      .patch(`/groups/${group.group_id}/members`)
      .set("Authorization", user.token)
      .send(data)
      .end((err, res) => {
        res.should.have.status(401);
      });
  });
});
describe("/Patch/groups/id/members", () => {
  it("it should not add pach a group member when user is not group member", async () => {
    const user = await User.findOne({ email: "test4@email.com" });
    const group = await Group.findOne({ name: "Test Group 2" });
    await Member.updateOne(
      { group_id: group.group_id, user_id: user.user_id },
      { admin: false }
    );
    const data = {
      user_id: user.user_id,
      patch: {
				admin: true,
				group_accepted: true,
				user_accepted: true,
      }
    };
    chai
      .request(server)
      .patch(`/groups/${group.group_id}/members`)
      .set("Authorization", "invalidtoken")
      .send(data)
      .end((err, res) => {
        res.should.have.status(401);
      });
  });
});