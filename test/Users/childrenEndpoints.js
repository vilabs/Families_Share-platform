const common = require('../common')
const server = common.server;
const chai = common.chai;

const User = require('../../src/models/user');
const Parent = require('../../src/models/parent');
const Child = require('../../src/models/child');

describe("/Post/users/userId/children", () => {
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
describe("/Post/users/userId/children", () => {
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
describe("/Post/users/userId/children", () => {
	it("it should not create a child for a given user when parameters are incorrect", (done) => {
		User.findOne({ email: "test@email.com" }, (err, user) => {
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
describe("/Get/users/userId/children", () => {
	it("it should fetch the children of a user when he is authenticated", (done) => {
		User.findOne({ email: "test@email.com" }, (err, user) => {
			chai
				.request(server)
				.get(`/users/${user.user_id}/children`)
				.set('Authorization', user.token)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('array')
					res.body.should.have.lengthOf.at.least(1);
					done();
				});
		});
	});
});
describe("/Get/users/userId/children", () => {
	it("it should not fetch the children of a user when he is not authenticated", (done) => {
		User.findOne({ email: "test@email.com" }, (err, user) => {
			chai
				.request(server)
				.get(`/users/${user.user_id}/children`)
				.set('Authorization', 'invalid token')
				.end((err, res) => {
					res.should.have.status(401);
					done();
				});
		});
	});
});
describe("/Get/users/userId/children", () => {
	it("it should not fetch the children of a user when he has none", (done) => {
		User.findOne({ email: "test4@email.com" }, (err, user) => {
			chai
				.request(server)
				.get(`/users/${user.user_id}/children`)
				.set('Authorization', user.token)
				.end((err, res) => {
					res.should.have.status(404);
					done();
				});
		});
	});
});
describe("/Get/users/userId/children/childId", () => {
	it("it should fetch a specific child of a user when he is authenticated", (done) => {
		User.findOne({ email: "test@email.com" }, (error, user) => {
			Parent.findOne({ parent_id: user.user_id }, (err, parent) => {
				Child.findOne({ child_id: parent.child_id }, (er, child) => {
					chai
						.request(server)
						.get(`/users/${user.user_id}/children/${child.child_id}`)
						.set('Authorization', user.token)
						.end((err, res) => {
							res.should.have.status(200);
							res.body.should.be.a('object');
							res.body.should.have.property('child_id').eql(child.child_id);
							res.body.should.have.property('special_needs');
							res.body.should.have.property('other_info');
							res.body.should.have.property('allergies');
							res.body.should.have.property('birthdate');
							res.body.should.have.property('given_name');
							res.body.should.have.property('family_name');
							res.body.should.have.property('background');
							res.body.should.have.property('gender');
							res.body.should.have.property('image');
							done();
						});
				});
			});
		});
	});
});
describe("/Get/users/userId/children/childId", () => {
	it("it should not fetch a specific child of a user when he is not authenticated", (done) => {
		User.findOne({ email: "test@email.com" }, (error, user) => {
			Parent.findOne({ parent_id: user.user_id }, (err, parent) => {
				Child.findOne({ child_id: parent.child_id }, (er, child) => {
					chai
						.request(server)
						.get(`/users/${user.user_id}/children/${child.child_id}`)
						.set('Authorization', 'invalidtoken')
						.end((err, res) => {
							res.should.have.status(401);
							done();
						});
				});
			});
		});
	});
});
describe("/Get/users/userId/children/childId", () => {
	it("it should not fetch a specific child of a user when it doesnt exist", (done) => {
		User.findOne({ email: "test@email.com" }, (error, user) => {
			chai
				.request(server)
				.get(`/users/${user.user_id}/children/invalidchildid`)
				.set('Authorization', user.token)
				.end((err, res) => {
					res.should.have.status(404);
					done();
				});
		});
	});
});
describe("/Patch/users/userId/children/childId", () => {
	it("it should patch a child profile when request user_id matches token user_id", (done) => {
		User.findOne({ email: "test@email.com" }, (error, user) => {
			Parent.findOne({ parent_id: user.user_id }, (err, parent) => {
				Child.findOne({ child_id: parent.child_id }, (er, child) => {
					const patch = {
						given_name: "Dead",
						family_name: "Pool",
						gender: "unspecified",
						birthdate: new Date(),
					};
					chai
						.request(server)
						.patch(`/users/${user.user_id}/children/${child.child_id}`)
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
});
describe("/Patch/users/userId/children/childId", () => {
	it("it should not patch a child profile when request user_id doesnt match token user_id", async () => {
		try {
			const user = await User.findOne({ email: "test@email.com" });
			const user2 = await User.findOne({ email: "test3@email.com" });
			const parent = await Parent.findOne({ parent_id: user.user_id });
			const child = await Child.findOne({ child_id: parent.child_id });
			const patch = {
				given_name: "Dead",
				family_name: "Pool",
				gender: "unspecified",
				birthdate: new Date(),
			};
			const res = await chai
				.request(server)
				.patch(`/users/${user.user_id}/children/${child.child_id}`)
				.set('Authorization', user2.token)
				.send(patch)
			res.should.have.status(401);
		} catch (err) {
			throw err
		}
	});
});
describe("/Patch/users/userId/children/childId", () => {
	it("it should not patch a child profile when parameters are incorrect", (done) => {
		User.findOne({ email: "test@email.com" }, (error, user) => {
			Parent.findOne({ parent_id: user.user_id }, (err, parent) => {
				Child.findOne({ child_id: parent.child_id }, (er, child) => {
					const patch = {
						foo: "bar"
					};
					chai
						.request(server)
						.patch(`/users/${user.user_id}/children/${child.child_id}`)
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
});
describe("/Delete/users/userId/children/childId", () => {
	it("it should delete a child profile when request user_id matches token user_id", (done) => {
		User.findOne({ email: "test3@email.com" }, (error, user) => {
			Parent.findOne({ parent_id: user.user_id }, (err, parent) => {
				Child.findOne({ child_id: parent.child_id }, (er, child) => {
					chai
						.request(server)
						.delete(`/users/${user.user_id}/children/${child.child_id}`)
						.set('Authorization', user.token)
						.end((err, res) => {
							res.should.have.status(200);
							done();
						});
				});
			});
		});
	});
});
describe("/Delete/users/userId/children/childId", () => {
	it("it should not delete a child profile when request user_id doesnt match token user_id", async () => {
		try {
			const user = await User.findOne({ email: "test@email.com" });
			const user2 = await User.findOne({ email: "test3@email.com" });
			const parent = Parent.findOne({ parent_id: user.user_id });
			const child = Child.findOne({ child_id: parent.child_id });
			const res = await chai
				.request(server)
				.delete(`/users/${user.user_id}/children/${child.child_id}`)
				.set('Authorization', user2.token)
			res.should.have.status(401);
		} catch (err) {
			throw err
		}
	});
});
describe("/Post/users/userId/children/childId/parents", () => {
	it("it should post a new parent for a child when request user_id matches token user_id", async () => {
		try {
			const user = await User.findOne({ email: "test@email.com" });
			const user2 = await User.findOne({ email: "test3@email.com" });
			const parent = await Parent.findOne({ parent_id: user.user_id });
			const child = await Child.findOne({ child_id: parent.child_id });
			const newParent = {
				parentId: user2.user_id,
			};
			const res = await chai
				.request(server)
				.post(`/users/${user.user_id}/children/${child.child_id}/parents`)
				.set('Authorization', user.token)
				.send(newParent)
			res.should.have.status(200);
		} catch (err) {
			throw err
		}
	});
});
describe("/Post/users/userId/children/childId/parents", () => {
	it("it should not post a new parent for a child when request user_id doesnt match token user_id", async () => {
		try {
			const user = await User.findOne({ email: "test@email.com" });
			const user2 = await User.findOne({ email: "test3@email.com" });
			const parent = await Parent.findOne({ parent_id: user.user_id });
			const child = await Child.findOne({ child_id: parent.child_id });
			const newParent = {
				parentId: user2.user_id,
			};
			const res = await chai
				.request(server)
				.post(`/users/${user.user_id}/children/${child.child_id}/parents`)
				.set('Authorization', user2.token)
				.send(newParent)
			res.should.have.status(401);
		} catch (err) {
			throw err
		}
	});
});
describe("/Post/users/userId/children/childId/parents", () => {
	it("it should not post a new parent for a child when child already has two parents", async () => {
		try {
			const user = await User.findOne({ email: "test@email.com" });
			const user2 = await User.findOne({ email: "test3@email.com" });
			const parent = await Parent.findOne({ parent_id: user.user_id });
			const child = await Child.findOne({ child_id: parent.child_id });
			const newParent = {
				parentId: user2.user_id,
			};
			const res = await chai
				.request(server)
				.post(`/users/${user.user_id}/children/${child.child_id}/parents`)
				.set('Authorization', user.token)
				.send(newParent)
			res.should.have.status(400);
		} catch (err) {
			throw err
		}
	});
});
describe("/Get/users/userId/children/childId/parents", () => {
	it("it should fetch the parents of a specific child when the user is authenticated", (done) => {
		User.findOne({ email: "test@email.com" }, (error, user) => {
			Parent.findOne({ parent_id: user.user_id }, (err, parent) => {
				Child.findOne({ child_id: parent.child_id }, (er, child) => {
					chai
						.request(server)
						.get(`/users/${user.user_id}/children/${child.child_id}/parents`)
						.set('Authorization', user.token)
						.end((err, res) => {
							res.should.have.status(200);
							res.body.should.be.a('array');
							res.body.should.have.lengthOf(2);
							done();
						});
				});
			});
		});
	});
});
describe("/Get/users/userId/children/childId/parents", () => {
	it("it should not fetch the parents of a specific child when the user is not authenticated", done => {
		User.findOne({ email: "test@email.com" }, (error, user) => {
			Parent.findOne({ parent_id: user.user_id }, (err, parent) => {
				Child.findOne({ child_id: parent.child_id }, (er, child) => {
					chai
						.request(server)
						.get(`/users/${user.user_id}/children/${child.child_id}/parents`)
						.set("Authorization", "invalidtoken")
						.end((err, res) => {
							res.should.have.status(401);
							done();
						});
				});
			});
		});
	});
});
describe("/Delete/users/userId/children/childId/parents/parentId", () => {
	it("it should delete the parent of a specific child when request user_id matches token user_id", async () => {
		try {
			const user = await User.findOne({ email: "test@email.com" });
			const user2 = await User.findOne({ email: "test3@email.com" });
			const parent = await Parent.findOne({ parent_id: user.user_id });
			const child = await Child.findOne({ child_id: parent.child_id });
			const res = await chai
				.request(server)
				.delete(`/users/${user.user_id}/children/${child.child_id}/parents/${user2.user_id}`)
				.set("Authorization", user.token)
			res.should.have.status(200);
		} catch (err) {
			throw err
		}
	});
});
describe("/Delete/users/userId/children/childId/parents/parentId", () => {
	it("it should not delete the parent of a specific child when token user_id doesnt match request user_id", async () => {
		try {
			const user = await User.findOne({ email: "test@email.com" });
			const user2 = await User.findOne({ email: "test3@email.com" });
			const parent = await Parent.findOne({ parent_id: user.user_id });
			const child = await Child.findOne({ child_id: parent.child_id });
			const res = await chai
				.request(server)
				.delete(`/users/${user.user_id}/children/${child.child_id}/parents/${user2.user_id}`)
				.set("Authorization", user2.token)
			res.should.have.status(401);
		} catch (err) {
			throw err
		}
	});
});