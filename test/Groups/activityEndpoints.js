const common = require('../common');

const { server } = common;
const { chai } = common;

const User = require('../../src/models/user');
const Group = require('../../src/models/group');
const Activity = require('../../src/models/activity');

describe('/Post/groups/id/activities', () => {
	it('it should post a new activity when user is authenticated and group member', (done) => {
		User.findOne({ email: "test@email.com" }, (error, user) => {
			Group.findOne({ name: "Test Group Edit" }, (err, group) => {
				const activity = {
					information: {
						name: "Test Activity",
						color: "#00838F",
						description: "test",
					},
					dates: {
						selectedDays: [
							'2019-03-06T22:00:00.000Z',
							'2019-03-13T22:00:00.000Z',
							'2019-03-20T22:00:00.000Z',
							'2019-03-27T22:00:00.000Z',
						],
						repetition: true,
						repetitionType: 'weekly'
					},
					timeslots: {
						activityTimeslots: [
							[
								{
									startTime: '20:00', 
									endTime: '22:00',
									description: 'Test ',
									name: 'Test Timeslot',
									requiredParents: 4,
									requiredChildren: 10,
									cost: 10,
									location: 'Kuala lumpur'
								}
							],
							[
								{
									startTime: '20:00', 
									endTime: '22:00',
									description: 'Test ',
									name: 'Test Timeslot',
									requiredParents: 4,
									requiredChildren: 10,
									cost: 10,
									location: 'Kuala lumpur'
								}
							],
							[
								{
									startTime: '20:00', 
									endTime: '22:00',
									description: 'Test ',
									name: 'Test Timeslot',
									requiredParents: 4,
									requiredChildren: 10,
									cost: 10,
									location: 'Kuala lumpur'
								}
							],
							[
								{
									startTime: '20:00', 
									endTime: '22:00',
									description: 'Test ',
									name: 'Test Timeslot',
									requiredParents: 4,
									requiredChildren: 10,
									cost: 10,
									location: 'Kuala lumpur'
								}
							]
						],
						differentTimeslots: false,
					}
				};
				chai.request(server)
					.post(`/groups/${group.group_id}/activities`)
					.set('Authorization', user.token)
					.send(activity)
					.end((err, res) => {
						res.should.have.status(200);
						done();
					})
			});
		});
	});
});
describe('/Post/groups/id/activities', () => {
	it('it should not post a new activity with incorrect parameters', (done) => {
		User.findOne({ email: "test@email.com" }, (error, user) => {
			Group.findOne({ name: "Test Group Edit" }, (err, group) => {
				const activity = {
					timeslots: {
					
					}
				};
				chai.request(server)
					.post(`/groups/${group.group_id}/activities`)
					.set('Authorization', user.token)
					.send(activity)
					.end((err, res) => {
						res.should.have.status(400);
						done();
					})
			});
		});
	});
});
describe('/Post/groups/id/activities', () => {
	it('it should not post a new activity when user isnt authenticated', (done) => {
		User.findOne({ email: "test@email.com" }, (error, user) => {
			Group.findOne({ name: "Test Group Edit" }, (err, group) => {
				const activity = {};
				chai.request(server)
					.post(`/groups/${group.group_id}/activities`)
					.set('Authorization','invalidtoken')
					.send(activity)
					.end((err, res) => {
						res.should.have.status(401);
						done();
					})
			});
		});
	});
});
describe('/Post/groups/id/activities', () => {
	it('it should not post a new activity when user isnt group member', (done) => {
		User.findOne({ email: "test4@email.com" }, (error, user) => {
			Group.findOne({ name: "Test Group Edit" }, (err, group) => {
				const activity = {};
				chai.request(server)
					.post(`/groups/${group.group_id}/activities`)
					.set('Authorization',user.token)
					.send(activity)
					.end((err, res) => {
						res.should.have.status(401);
						done();
					})
			});
		});
	});
});
describe('/Get/groups/id/activities', () => {
	it('it should fetch a groups activities when user is authenticated and group member', (done) => {
		User.findOne({ email: "test@email.com" }, (error, user) => {
			Group.findOne({ name: "Test Group Edit" }, (err, group) => {
				chai.request(server)
					.get(`/groups/${group.group_id}/activities`)
					.set('Authorization',user.token)
					.end((err, res) => {
						res.should.have.status(200);
						res.body.should.be.a('array').with.lengthOf(1);
						done();
					})
			});
		});
	});
});
describe('/Get/groups/id/activities', () => {
	it('it should not fetch a groups activities when user isnt authenticated', (done) => {
		User.findOne({ email: "test@email.com" }, (error, user) => {
			Group.findOne({ name: "Test Group Edit" }, (err, group) => {
				chai.request(server)
					.get(`/groups/${group.group_id}/activities`)
					.set('Authorization','invalidtoken')
					.end((err, res) => {
						res.should.have.status(401);
						done();
					})
			});
		});
	});
});
describe('/Get/groups/id/activities', () => {
	it('it should not fetch a groups activities when user isnt group member', (done) => {
		User.findOne({ email: "test4@email.com" }, (error, user) => {
			Group.findOne({ name: "Test Group Edit" }, (err, group) => {
				chai.request(server)
					.get(`/groups/${group.group_id}/activities`)
					.set('Authorization', user.token )
					.end((err, res) => {
						res.should.have.status(401);
						done();
					})
			});
		});
	});
});
describe('/Get/groups/id/activities', () => {
	it('it should not fetch a groups activities when it has none', (done) => {
		User.findOne({ email: "test3@email.com" }, (error, user) => {
			Group.findOne({ name: "Test Group 2" }, (err, group) => {
				chai.request(server)
					.get(`/groups/${group.group_id}/activities`)
					.set('Authorization', user.token)
					.end((err, res) => {
						res.should.have.status(404);
						done();
					})
			});
		});
	});
});
describe('/Get/groups/groupId/activities/activityId', () => {
	it('it should fetch a groups activity when user is authenticated and group member', async () => {
		const user = await User.findOne({ email: "test@email.com" });
		const group = await Group.findOne({ name: "Test Group Edit" });
		const activity = await Activity.findOne({ name: "Test Activity" });
		chai.request(server)
			.get(`/groups/${group.group_id}/activities/${activity.activity_id}`)
			.set('Authorization', user.token)
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.a('object');
				res.body.should.have.property('dates');
				res.body.should.have.property('name');
				res.body.should.have.property('description');
				res.body.should.have.property('color');
				res.body.should.have.property('activity_id');
				res.body.should.have.property('group_name');
				res.body.activity_id.should.be.eql(activity.activity_id)
			})
	});
});
describe('/Get/groups/groupId/activities/activityId', () => {
	it('it should not fetch a groups activity when user isnt authenticated ', async () => {
		const group = await Group.findOne({ name: "Test Group Edit" });
		const activity = await Activity.findOne({ name: "Test Activity" });
		chai.request(server)
			.get(`/groups/${group.group_id}/activities/${activity.activity_id}`)
			.set('Authorization', 'invalidtoken')
			.end((err, res) => {
				res.should.have.status(401);
			})
	});
});
describe('/Get/groups/groupId/activities/activityId', () => {
	it('it should not fetch a groups activity when user isnt group member', async () => {
		const user = await User.findOne({ email: "test4@email.com" });
		const group = await Group.findOne({ name: "Test Group Edit" });
		const activity = await Activity.findOne({ name: "Test Activity" });
		chai.request(server)
			.get(`/groups/${group.group_id}/activities/${activity.activity_id}`)
			.set('Authorization', user.token)
			.end((err, res) => {
				res.should.have.status(401);
			});
	});
});
describe('/Get/groups/groupId/activities/activityId', () => {
	it('it should not fetch a groups activity activity doesnt exist', async () => {
		const user = await User.findOne({ email: "test@email.com" });
		const group = await Group.findOne({ name: "Test Group Edit" });
		chai.request(server)
			.get(`/groups/${group.group_id}/activities/invalidid`)
			.set('Authorization', user.token)
			.end((err, res) => {
				res.should.have.status(404);
			})
	});
});
describe('/Patch/groups/groupId/activities/activityId', () => {
	it('it should patch a groups activity when user is authenticated and group admin', async () => {
		const user = await User.findOne({ email: "test@email.com" });
		const group = await Group.findOne({ name: "Test Group Edit" });
		const activity = await Activity.findOne({ name: "Test Activity" });
		const patch = { name: "Test Activity Edit"}
		chai.request(server)
			.patch(`/groups/${group.group_id}/activities/${activity.activity_id}`)
			.set('Authorization', user.token)
			.send(patch)
			.end((err, res) => {
				res.should.have.status(200);
			})
	});
});
describe('/Patch/groups/groupId/activities/activityId', () => {
	it('it should not patch a groups activity when user isnt authenticated', async () => {
		const group = await Group.findOne({ name: "Test Group Edit" });
		const activity = await Activity.findOne({ name: "Test Activity Edit" });
		const patch = { name: "Test Activity Edit"}
		chai.request(server)
			.patch(`/groups/${group.group_id}/activities/${activity.activity_id}`)
			.set('Authorization', 'invalidtoken')
			.send(patch)
			.end((err, res) => {
				res.should.have.status(401);
			})
	});
});
describe('/Patch/groups/groupId/activities/activityId', () => {
	it('it should not patch a groups activity when user isnt group member', async () => {
		const user = await User.findOne({ email: "test4@email.com" });
		const group = await Group.findOne({ name: "Test Group Edit" });
		const activity = await Activity.findOne({ name: "Test Activity Edit" });
		const patch = { name: "Test Activity Edit"}
		chai.request(server)
			.patch(`/groups/${group.group_id}/activities/${activity.activity_id}`)
			.set('Authorization', user.token)
			.send(patch)
			.end((err, res) => {
				res.should.have.status(401);
			})
	});
});
describe('/Patch/groups/groupId/activities/activityId', () => {
	it('it should not patch a groups activity when user isnt group admin or activity creator', async () => {
		const user = await User.findOne({ email: "test3@email.com" });
		const group = await Group.findOne({ name: "Test Group Edit" });
		const activity = await Activity.findOne({ name: "Test Activity Edit" });
		const patch = { name: "Test Activity"}
		chai.request(server)
			.patch(`/groups/${group.group_id}/activities/${activity.activity_id}`)
			.set('Authorization', user.token)
			.send(patch)
			.end((err, res) => {
				res.should.have.status(401);
			})
	});
});
describe('/Patch/groups/groupId/activities/activityId', () => {
	it('it should not patch a groups activity when parameters are incorrect', async () => {
		const user = await User.findOne({ email: "test4@email.com" });
		const group = await Group.findOne({ name: "Test Group Edit" });
		const activity = await Activity.findOne({ name: "Test Activity Edit" });
		const patch = { foo: "bar"}
		chai.request(server)
			.patch(`/groups/${group.group_id}/activities/${activity.activity_id}`)
			.set('Authorization', user.token)
			.send(patch)
			.end((err, res) => {
				res.should.have.status(400);
			})
	});
});