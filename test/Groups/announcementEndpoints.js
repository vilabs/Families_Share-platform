const common = require('../common');

const { server } = common;
const { chai } = common;

const User = require('../../src/models/user');
const Group = require('../../src/models/group');
const Announcement = require('../../src/models/announcement');
const Reply = require('../../src/models/reply');

describe('/Post/groups/groupId/announcements', () => {
	it('it should post a new group announcement when user is authenticated and group member', (done) => {
		User.findOne({ email: "test@email.com"}, (err, user) => {
			Group.findOne({ name: "Test Group Edit"}, (err, group) => {
				const announcement = {
					message: "Test Announcement"
				};
				chai.request(server)
				.post(`/groups/${group.group_id}/announcements`)
				.set('Authorization',user.token)
				.send(announcement)
				.end( (err, res) => {
					res.should.have.status(200);
					done();
				});
			});
		});
	});
});
describe('/Post/groups/groupId/announcements', () => {
	it('it should nost post a new group announcement when user isnt authenticated', (done) => {
		Group.findOne({ name: "Test Group Edit" }, (err, group) => {
			const announcement = {
				message: "Test Announcement"
			};
			chai.request(server)
				.post(`/groups/${group.group_id}/announcements`)
				.set('Authorization', 'invalidtoken')
				.send(announcement)
				.end((err, res) => {
					res.should.have.status(401);
					done();
				});
		});
	});
});
describe('/Post/groups/groupId/announcements', () => {
	it('it should nost post a new group announcement when user isnt group member', (done) => {
		User.findOne({ email: "test4@email.com" }, (err, user) => {
			Group.findOne({ name: "Test Group Edit" }, (err, group) => {
				const announcement = {
					message: "Test Announcement"
				};
				chai.request(server)
					.post(`/groups/${group.group_id}/announcements`)
					.set('Authorization', user.token)
					.send(announcement)
					.end((err, res) => {
						res.should.have.status(401);
						done();
					});
			});
		});
	});
});
describe('/Post/groups/groupId/announcements', () => {
	it('it should nost post a new group announcement with incorrect parameters', (done) => {
		User.findOne({ email: "test4@email.com" }, (err, user) => {
			Group.findOne({ name: "Test Group Edit" }, (err, group) => {
				const announcement = {
					foo: "bar"
				};
				chai.request(server)
					.post(`/groups/${group.group_id}/announcements`)
					.set('Authorization', user.token)
					.send(announcement)
					.end((err, res) => {
						res.should.have.status(401);
						done();
					});
			});
		});
	});
});
describe('/Delete/groups/groupId/announcements/announcementId', () => {
	it('it should delete a groups announcement when user is authenticated and admin or creator', async () => {
		const user = await User.findOne({ email: "test3@email.com" })
		const group = await Group.findOne({ name: "Test Group 2" })
		const announcement = await Announcement.findOne({ group_id: group.group_id });
		const res = await chai.request(server)
			.delete(`/groups/${group.group_id}/announcements/${announcement.announcement_id}`)
			.set('Authorization', user.token)
		res.should.have.status(200);
	});
});
describe('/Delete/groups/groupId/announcements/announcementId', () => {
	it('it should not delete a groups announcement when user isnt authenticated', async () => {
		const group = await Group.findOne({ name: "Test Group Edit" })
		const announcement = await Announcement.findOne({ group_id: group.group_id });
		const res = await chai.request(server)
			.delete(`/groups/${group.group_id}/announcements/${announcement.announcement_id}`)
			.set('Authorization', 'invalidid')
		res.should.have.status(401);
	});
});
describe('/Delete/groups/groupId/announcements/announcementId', () => {
	it('it should not delete a groups announcement when user isnt group admin or creator', async () => {
		const user = await User.findOne({ email: "test3@email.com" })
		const group = await Group.findOne({ name: "Test Group Edit" })
		const announcement = await Announcement.findOne({ group_id: group.group_id });
		const res = await chai.request(server)
			.delete(`/groups/${group.group_id}/announcements/${announcement.announcement_id}`)
			.set('Authorization', user.token)
		res.should.have.status(401);
	});
});
describe('/Delete/groups/groupId/announcements/announcementId', () => {
	it('it should not delete a groups announcement when user isnt group member', async () => {
		const user = await User.findOne({ email: "test4@email.com" })
		const group = await Group.findOne({ name: "Test Group Edit" })
		const announcement = await Announcement.findOne({ group_id: group.group_id });
		const res = await chai.request(server)
			.delete(`/groups/${group.group_id}/announcements/${announcement.announcement_id}`)
			.set('Authorization', user.token)
		res.should.have.status(401);
	});
});
describe('/Get/groups/groupId/announcements', () => {
	it('it should fetch a groups announcements when user is authenticated and group member', (done) => {
		User.findOne({ email: "test@email.com" }, (err, user) => {
			Group.findOne({ name: "Test Group Edit" }, (err, group) => {
				chai.request(server)
					.get(`/groups/${group.group_id}/announcements`)
					.set('Authorization', user.token)
					.end((err, res) => {
						res.should.have.status(200);
						res.body.should.be.a('array').with.lengthOf(1);
						done();
					});
			});
		});
	});
});
describe('/Get/groups/groupId/announcements', () => {
	it('it should not fetch a groups announcements when user isnt authenticated ', (done) => {
		Group.findOne({ name: "Test Group Edit" }, (err, group) => {
			chai.request(server)
				.get(`/groups/${group.group_id}/announcements`)
				.set('Authorization', 'invalidtoken')
				.end((err, res) => {
					res.should.have.status(401);
					done();
				});
		});
	});
});
describe('/Get/groups/groupId/announcements', () => {
	it('it should not fetch a groups announcements when user isnt group member', (done) => {
		User.findOne({ email: "test4@email.com" }, (err, user) => {
			Group.findOne({ name: "Test Group Edit" }, (err, group) => {
				chai.request(server)
					.get(`/groups/${group.group_id}/announcements`)
					.set('Authorization', user.token)
					.end((err, res) => {
						res.should.have.status(401);
						done();
					});
			});
		});
	});
});
describe('/Get/groups/groupId/announcements', () => {
	it('it should not fetch a groups announcements when it has none', (done) => {
		User.findOne({ email: "test3@email.com" }, (err, user) => {
			Group.findOne({ name: "Test Group 2" }, (err, group) => {
				chai.request(server)
					.get(`/groups/${group.group_id}/announcements`)
					.set('Authorization', user.token)
					.end((err, res) => {
						res.should.have.status(404);
						done();
					});
			});
		});
	});
});
describe('/Post/groups/groupId/announcements/announcementId/replies', async () => {
	it('it should post a new reply when user is authenticated and group member', async () => {
		const user = await User.findOne({ email: "test@email.com" });
		const group = await Group.findOne({ name: "Test Group Edit" });
		const announcement = await Announcement.findOne({ group_id: group.group_id });
		const reply = {
			message: "Test Reply"
		};
		const res = await chai.request(server)
			.post(`/groups/${group.group_id}/announcements/${announcement.announcement_id}/replies`)
			.set('Authorization', user.token)
			.send(reply)
		res.should.have.status(200);
	});
});
describe('/Post/groups/groupId/announcements/announcementId/replies', async () => {
	it('it should not post a new reply announcement when user isnt authenticated ', async () => {
		const group = await Group.findOne({ name: "Test Group Edit" });
		const announcement = await Announcement.findOne({ group_id: group.group_id });
		const reply = {
			message: "Test Reply"
		};
		const res = await chai.request(server)
			.post(`/groups/${group.group_id}/announcements/${announcement.announcement_id}/replies`)
			.set('Authorization', 'invalidtoken')
			.send(reply)
		res.should.have.status(401);
	});
});
describe('/Post/groups/groupId/announcements/announcementId/replies', async () => {
	it('it should not post a new reply when user isnt group member', async () => {
		const user = await User.findOne({ email: "test4@email.com" });
		const group = await Group.findOne({ name: "Test Group Edit" });
		const announcement = await Announcement.findOne({ group_id: group.group_id });
		const reply = {
			message: "Test Reply"
		};
		const res = await chai.request(server)
			.post(`/groups/${group.group_id}/announcements/${announcement.announcement_id}/replies`)
			.set('Authorization', user.token)
			.send(reply)
		res.should.have.status(401);
	});
});
describe('/Post/groups/groupId/announcements/announcementId/replies', async () => {
	it('it should not post a new reply when user parameters are missing', async () => {
		const user = await User.findOne({ email: "test@email.com" });
		const group = await Group.findOne({ name: "Test Group Edit" });
		const announcement = await Announcement.findOne({ group_id: group.group_id });
		const reply = {
			foo: "Bar"
		};
		const res = await chai.request(server)
			.post(`/groups/${group.group_id}/announcements/${announcement.announcement_id}/replies`)
			.set('Authorization', user.token)
			.send(reply)
		res.should.have.status(400);
	});
});
describe('/Get/groups/groupId/announcements/announcementId/replies', () => {
	it('it should fetch an announcements replies when user is authenticated and group member', async () => {
		const user = await User.findOne({ email: "test@email.com" });
		const group = await Group.findOne({ name: "Test Group Edit" });
		const announcement = await Announcement.findOne({ group_id: group.group_id });
		const res = await chai.request(server)
			.get(`/groups/${group.group_id}/announcements/${announcement.announcement_id}/replies`)
			.set('Authorization', user.token)
		res.should.have.status(200);
		res.body.should.be.a('array').with.lengthOf(1);
	});
});
describe('/Get/groups/groupId/announcements/announcementId/replies', () => {
	it('it should not fetch an announcements replies when user isnt authenticated', async () => {
		const group = await Group.findOne({ name: "Test Group Edit" });
		const announcement = await Announcement.findOne({ group_id: group.group_id });
		const res = await chai.request(server)
			.get(`/groups/${group.group_id}/announcements/${announcement.announcement_id}/replies`)
			.set('Authorization', 'invalidtoken')
		res.should.have.status(401);
	});
});
describe('/Get/groups/groupId/announcements/announcementId/replies', () => {
	it('it should not fetch an announcements replies when user isnt group member', async () => {
		const user = await User.findOne({ email: "test4@email.com" });
		const group = await Group.findOne({ name: "Test Group Edit" });
		const announcement = await Announcement.findOne({ group_id: group.group_id });
		const res = await chai.request(server)
			.get(`/groups/${group.group_id}/announcements/${announcement.announcement_id}/replies`)
			.set('Authorization', user.token)
		res.should.have.status(401);
	});
});
describe('/Delete/groups/groupId/announcements/announcementId/replies/replyId', () => {
	it('it should delete an announcements reply when user is authenticated and admin or creator', async () => {
		const user = await User.findOne({ email: "test@email.com" })
		const group = await Group.findOne({ name: "Test Group Edit" })
		const announcement = await Announcement.findOne({ group_id: group.group_id });
		const reply = await Reply.findOne({ announcement_id: announcement.announcement_id});
		const res = await chai.request(server)
			.delete(`/groups/${group.group_id}/announcements/${announcement.announcement_id}/replies/${reply.reply_id}`)
			.set('Authorization', user.token)
		res.should.have.status(200);
	});
});
describe('/Get/groups/groupId/announcements/announcementId/replies', () => {
	it('it should not fetch an announcements replies when user it has none', async () => {
		const user = await User.findOne({ email: "test@email.com" });
		const group = await Group.findOne({ name: "Test Group Edit" });
		const announcement = await Announcement.findOne({ group_id: group.group_id });
		const res = await chai.request(server)
			.get(`/groups/${group.group_id}/announcements/${announcement.announcement_id}/replies`)
			.set('Authorization', user.token)
		res.should.have.status(404);
	});
});
describe('/Delete/groups/groupId/announcements/announcementId/replies/replyId', () => {
	it('it should not delete an announcements reply when user isnt authenticated', async () => {
		const user = await User.findOne({ email: "test@email.com"});
		const group = await Group.findOne({ name: "Test Group Edit" })
		const announcement = await Announcement.findOne({ group_id: group.group_id });
		await Reply.create({
			announcement_id: announcement.announcement_id,
			body: "Test Reply",
			user_id: user.user_id
		});
		const reply = await Reply.findOne({ announcement_id: announcement.announcement_id});
		const res = await chai.request(server)
			.delete(`/groups/${group.group_id}/announcements/${announcement.announcement_id}/replies/${reply.reply_id}`)
			.set('Authorization', 'invalidtoken')
		res.should.have.status(401);
	});
});
describe('/Delete/groups/groupId/announcements/announcementId/replies/replyId', () => {
	it('it should not delete an announcements reply when user isnt group member ', async () => {
		const user = await User.findOne({ email: "test4@email.com"});
		const group = await Group.findOne({ name: "Test Group Edit" });
		const announcement = await Announcement.findOne({ group_id: group.group_id });
		const reply = await Reply.findOne({ announcement_id: announcement.announcement_id});
		const res = await chai.request(server)
			.delete(`/groups/${group.group_id}/announcements/${announcement.announcement_id}/replies/${reply.reply_id}`)
			.set('Authorization', user.token)
		res.should.have.status(401);
	});
});
describe('/Delete/groups/groupId/announcements/announcementId/replies/replyId', () => {
	it('it should not delete an announcements reply when user isnt admin or creator ', async () => {
		const user = await User.findOne({ email: "test3@email.com"});
		const group = await Group.findOne({ name: "Test Group Edit" })
		const announcement = await Announcement.findOne({ group_id: group.group_id });
		const reply = await Reply.findOne({ announcement_id: announcement.announcement_id});
		const res = await chai.request(server)
			.delete(`/groups/${group.group_id}/announcements/${announcement.announcement_id}/replies/${reply.reply_id}`)
			.set('Authorization', 'invalidtoken')
		res.should.have.status(401);
	});
});