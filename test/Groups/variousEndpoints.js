const common = require('../common');

const { server } = common;
const { chai } = common;

const User = require('../../src/models/user');
const Group = require('../../src/models/group');
const Notification = require('../../src/models/notification');

describe("/Get/groups/id/notifications", () => {
	it("it should fetch a groups notifications when user is authenticated and group member", async () => {
		try {
			const user = await User.findOne({ email: "test@email.com" });
			const group = await Group.findOne({ name: "Test Group Edit" });
			const notification = {
				owner_type: "group",
				owner_id: group.group_id,
				type: "group",
				code: 2,
				subject: "",
				object: "",
				read: false
			};
			await Notification.create(notification);
			const res = await chai
				.request(server)
				.get(`/groups/${group.group_id}/notifications`)
				.set("Authorization", user.token)
			res.should.have.status(200);
			res.body.should.be.a("array").with.lengthOf(3);
		} catch (err) {
			throw err
		}
	});
});
describe("/Get/groups/id/notifications", () => {
	it("it should not fetch a groups notifications when user isnt authenticated", (done) => {
		Group.findOne({ name: "Test Group Edit" }, (err, group) => {
			chai
				.request(server)
				.get(`/groups/${group.group_id}/notifications`)
				.set("Authorization", 'invalidtoken')
				.end((err, res) => {
					res.should.have.status(401);
					done()
				})
		});
	});
});
describe("/Get/groups/id/notifications", () => {
	it("it should not fetch a groups notifications when user isnt group member", (done) => {
		Group.findOne({ name: "Test Group Edit" }, (err, group) => {
			User.findOne({ email: "test4@email.com" }, (err, user) => {
				chai
					.request(server)
					.get(`/groups/${group.group_id}/notifications`)
					.set("Authorization", user.token)
					.end((err, res) => {
						res.should.have.status(401);
						done()
					})
			});
		});
	});
});
describe("/Get/groups/id/notifications", () => {
	it("it should not fetch a groups notifications when it has none", (done) => {
		Group.findOne({ name: "Test Group 2" }, (err, group) => {
			User.findOne({ email: "test3@email.com" }, (err, user) => {
				chai
					.request(server)
					.get(`/groups/${group.group_id}/notifications`)
					.set("Authorization", user.token)
					.end((err, res) => {
						res.should.have.status(404);
						done()
					})
			});
		});
	});
});