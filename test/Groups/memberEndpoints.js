const common = require('../common');

const { server } = common;
const { chai } = common;

const User = require('../../src/models/user');
const Group = require('../../src/models/group');
const Member = require('../../src/models/member');

describe('/Post/api/groups/id/members', () => {
  it('it should invite new members to the group when user is authenticated and admin', async () => {
		try {
			const user = await User.findOne({ email: 'test@email.com' });
			const user2 = await User.findOne({ email: 'test4@email.com' });
			const group = await Group.findOne({ name: 'Test Group Edit' });
			const invitations = {
				inviteIds: [user2.user_id],
			};
			const res = await chai
				.request(server)
				.post(`/api/groups/${group.group_id}/members`)
				.set('Authorization', user.token)
				.send(invitations)
			res.should.have.status(200);
		} catch (err) {
			throw err
		}
	});
});
describe('/Post/api/groups/id/members', () => {
	it('it should not invite new members to the group when parameters are missing', async () => {
		try {
			const user = await User.findOne({ email: 'test@email.com' });
			const group = await Group.findOne({ name: 'Test Group Edit' });
			const invitations = {
			};
			const res = await chai
				.request(server)
				.post(`/api/groups/${group.group_id}/members`)
				.set('Authorization', user.token)
				.send(invitations)
			res.should.have.status(400);
		} catch (err) {
			throw err
		}

	});
});
describe('/Post/api/groups/id/members', () => {
	it('it should not invite new members to the group when user is authenticated but not admin', async () => {
		try {
			const user = await User.findOne({ email: 'test3@email.com' });
			const user2 = await User.findOne({ email: 'test4@email.com' });
			const group = await Group.findOne({ name: 'Test Group Edit' });
			const invitations = {
				inviteIds: [user2.user_id],
			};
			const res = await chai
				.request(server)
				.post(`/api/groups/${group.group_id}/members`)
				.set('Authorization', user.token)
				.send(invitations)

			res.should.have.status(401);
		} catch (err) {
			throw err
		}
	});
});
describe('/Post/api/groups/id/members', () => {
	it('it should not invite new members to the group when user is authenticated but not admin', async () => {
		try {
			const user = await User.findOne({ email: 'test4@email.com' })
			const user2 = await User.findOne({ email: 'test4@email.com' })
			const group = await Group.findOne({ name: 'Test Group Edit' })
			const invitations = {
				inviteIds: [user2.user_id],
			};
			const res = await chai
				.request(server)
				.post(`/api/groups/${group.group_id}/members`)
				.set('Authorization', user.token)
				.send(invitations)
			res.should.have.status(401);
		} catch (err) {
			throw err
		}
	});
});
describe('/Post/api/groups/id/members', () => {
	it('it should not invite new members to the group when user isnt authenticated', async () => {
		try {
			const user = await User.findOne({ email: 'test@email.com' });
			const group = await Group.findOne({ name: 'Test Group Edit' });
			const invitations = {
				inviteIds: [user.user_id],
			};
			const res = await chai
				.request(server)
				.post(`/api/groups/${group.group_id}/members`)
				.set('Authorization', 'invalidtoken')
				.send(invitations)
			res.should.have.status(401);
		} catch (err) {
			throw err
		}
	});
});
describe('/Get/api/groups/id/members', () => {
  it('it should fetch the members of an existing group', (done) => {
    Group.findOne({ name: 'Test Group Edit' }, (err, group) => {
      chai
        .request(server)
        .get(`/api/groups/${group.group_id}/members`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          done();
        });
    });
  });
});
describe('/Get/api/groups/id/members', () => {
  it('it should not fetch the members of an  non existing group', (done) => {
    chai
      .request(server)
      .get('/api/groups/invalidid/members')
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
  });
});
describe('/Patch/api/groups/id/members', () => {
	it('it should accept a new member of a group when user is authenticated and admin', async () => {
		try {
			const user = await User.findOne({ email: 'test@email.com' });
			const user2 = await User.findOne({ email: 'test3@email.com' });
			const group = await Group.findOne({ name: 'Test Group 2' });
			await Member.create({
				user_id: user.user_id,
				group_id: group.group_id,
				admin: false,
				group_accepted: false,
				user_accepted: true,
			});
			const data = {
				user_id: user.user_id,
				patch: {
					group_accepted: true,
				},

			};
			const res = await chai
				.request(server)
				.patch(`/api/groups/${group.group_id}/members`)
				.set('Authorization', user2.token)
				.send(data)
			res.should.have.status(200);
		} catch (err) {
			throw err
		}
	});
});
describe('/Patch/api/groups/id/members', () => {
	it('it should add a new admin to a group when user is authenticated and admin', async () => {
		try {
			const user = await User.findOne({ email: 'test@email.com' });
			const user2 = await User.findOne({ email: 'test3@email.com' });
			const group = await Group.findOne({ name: 'Test Group 2' });
			const data = {
				user_id: user.user_id,
				patch: {
					admin: true,
				},
			};
			const res = await chai
				.request(server)
				.patch(`/api/groups/${group.group_id}/members`)
				.set('Authorization', user2.token)
				.send(data)
			res.should.have.status(200);
		} catch (err) {
			throw err
		}
	});
});
describe('/Patch/api/groups/id/members', () => {
  it('it should not patch a group member when parameters are incorrect', async () => {
    try{
			const user = await User.findOne({ email: 'test@email.com' });
			const user2 = await User.findOne({ email: 'test3@email.com' });
			const group = await Group.findOne({ name: 'Test Group 2' });
			const data = {
				user_id: user.user_id,
				patch: {
					foo: true,
				},
			};
			const res = await chai
				.request(server)
				.patch(`/api/groups/${group.group_id}/members`)
				.set('Authorization', user2.token)
				.send(data)

			res.should.have.status(400);
		} catch (err) {
			throw err
		}
	});
});
describe('/Patch/api/groups/id/members', () => {
	it('it should not add pach a group member when user is not authenticated', async () => {
		try {
			const user = await User.findOne({ email: 'test@email.com' });
			const user2 = await User.findOne({ email: 'test3@email.com' });
			const group = await Group.findOne({ name: 'Test Group 2' });
			const data = {
				user_id: user.user_id,
				patch: {
					admin: true,
				},
			};
			const res = await chai
				.request(server)
				.patch(`/api/groups/${group.group_id}/members`)
				.set('Authorization', 'invalidtoken')
				.send(data)
			res.should.have.status(401);
		} catch (err) {
			throw err
		}
	});
});
describe("/Patch/api/groups/id/members", () => {
  it("it should not add pach a group member when user is not group admin", async () => {
    try {
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
      const res = await chai
        .request(server)
        .patch(`/api/groups/${group.group_id}/members`)
        .set("Authorization", user.token)
        .send(data);
      res.should.have.status(401);
    } catch (err) {
      throw err;
    }
  });
});
describe("/Patch/api/groups/id/members", () => {
  it("it should not add pach a group member when user is not group member", async () => {
    try {
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
          user_accepted: true
        }
      };
      const res = await chai
        .request(server)
        .patch(`/api/groups/${group.group_id}/members`)
        .set("Authorization", "invalidtoken")
        .send(data);
      res.should.have.status(401);
    } catch (err) {
      throw err;
    }
  });
});
describe("/Delete/api/groups/groupId/members/memberId", () => {
  it("it should not remove a group member when user is not admin", async () => {
    try {
      const user = await User.findOne({ email: "test@email.com" });
      const group = await Group.findOne({ name: "Test Group 2" });
      await Member.updateOne({ user_id: user.user_id }, { admin: false });
      const res = await chai
        .request(server)
        .delete(`/api/groups/${group.group_id}/members/${user.user_id}`)
        .set("Authorization", user.token);
      res.should.have.status(401);
    } catch (err) {
      throw err;
    }
  });
});
describe("/Delete/api/groups/groupId/members/memberId", () => {
  it("it should remove a group member when user is authenticated and admin", async () => {
    try {
      const user = await User.findOne({ email: "test@email.com" });
      const user2 = await User.findOne({ email: "test3@email.com" });
      const group = await Group.findOne({ name: "Test Group 2" });
      const res = await chai
        .request(server)
        .delete(`/api/groups/${group.group_id}/members/${user.user_id}`)
        .set("Authorization", user2.token);
      res.should.have.status(200);
    } catch (err) {
      throw err;
    }
  });
});
describe('/Delete/api/groups/groupId/members/memberId', () => {
	it('it should not remove a group member when user isnt authenticated', async () => {
		try {
			const user = await User.findOne({ email: 'test@email.com' });
			const group = await Group.findOne({ name: 'Test Group 2' });
			const res = await chai.request(server)
				.delete(`/api/groups/${group.group_id}/members/${user.user_id}`)
				.set('Authorization', 'invalidtoken')
			res.should.have.status(401);
		} catch (err) {
			throw err
		}
	});
});
describe('/Delete/api/groups/groupId/members/memberId', () => {
	it('it should remove a group member when user is not group member', async () => {
		try {
			const user = await User.findOne({ email: 'test@email.com' });
			const group = await Group.findOne({ name: 'Test Group 2' });
			const res = await chai.request(server)
				.delete(`/api/groups/${group.group_id}/members/${user.user_id}`)
				.set('Authorization', user.token)
			res.should.have.status(401);
		} catch (err) {
			throw err
		}
	});
});
describe('/Get/api/groups/id/kids', () => {
	it('it should fetch the kids of a group', (done) => {
		Group.findOne({ name: 'Test Group Edit' }, (error, group) => {
			chai.request(server)
				.get(`/api/groups/${group.group_id}/kids`)
				.end((err, res) => {
					res.should.have.status(200);
					done();
				});
		});
	});
});
describe('/Get/api/groups/id/kids', () => {
	it('it should not fetch the kids of a group when the group has none', (done) => {
		Group.findOne({ name: 'Test Group 2' }, (error, group) => {
			chai.request(server)
				.get(`/api/groups/${group.group_id}/kids`)
				.end((err, res) => {
					res.should.have.status(404);
					done();
				});
		});
	});
});
