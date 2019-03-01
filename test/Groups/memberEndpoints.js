const common = require('../common')
const server = common.server;
const chai = common.chai;

const User = require('../../src/models/user');
const Group = require('../../src/models/group');

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