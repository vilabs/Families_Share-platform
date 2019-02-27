const common = require('../common')
const server = common.server;
const chai = common.chai;

const User = require('../../src/models/user');

describe("/Post/users/children", () => {
	it("it should create a child for a given user when request user_id matches token user_id", (done) => {
		User.findOne({ email: "test@email.com" }, (err, user) => {
			const child = {
				given_name: "Test",
				family_name: "Child",
				gender: "girl",
				birthdate: new Date(),
				allergies: "allergic to peanuts",
				special_needs: "no",
				other_info: "no"
			};
			chai
				.request(server)
				.post(`/users/${user.user_id}/children`)
				.set('Authorization', user.token)
				.send(child)
				.end((err, res) => {
					res.should.have.status(200);
					done();
				});
		});
	});
});
describe("/Post/users/children", () => {
	it("it should not create a child for a given user when request user_id doesnt match token user_id", (done) => {
		User.find({}, (err, users) => {
			const child = {
				given_name: "Test",
				family_name: "Child",
				gender: "girl",
				birthdate: new Date(),
				allergies: "allergic to peanuts",
				special_needs: "no",
				other_info: "no"
			};
			chai
				.request(server)
				.post(`/users/${users[0].user_id}/children`)
				.set('Authorization', users[1].token)
				.send(child)
				.end((err, res) => {
					res.should.have.status(401);
					done();
				});
		});
	});
});
describe("/Post/users/children", () => {
	it("it should not create a child for a given user when parameters are incorrect", (done) => {
		User.findOne({email:"test@email.com"}, (err, user) => {
			const child = {
				given_name: "Test",
			};
			chai
				.request(server)
				.post(`/users/${user.user_id}/children`)
				.set('Authorization', user.token)
				.send(child)
				.end((err, res) => {
					res.should.have.status(400);
					done();
				});
		});
	});
});