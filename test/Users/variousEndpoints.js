const common = require('../common')
const server = common.server;
const chai = common.chai;

const User = require('../../src/models/user');

describe("/Get/users/id/rating", function(){
  it("it should get a users rating by the given id when user is authenticated", function(done) {
    User.findOne({}, (err, user) => {
      chai
        .request(server)
        .get(`/users/${user.user_id}/rating`)
        .set("Authorization", user.token)
        .end((err, res) => {
          res.should.have.status(200);
					res.body.should.be.a("object");
					res.body.should.have.property('user_id').eql(user.user_id);
					res.body.should.have.property('rating');
          done();
        });
    });
  });
});
describe("/Get/users/id/rating", function(){
  it("it should not get a users rating by the given id when user is not authenticated",function(done) {
    User.findOne({}, (err, user) => {
      chai
        .request(server)
        .get(`/users/${user.user_id}/rating`)
        .set("Authorization", 'invalidtoken')
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });
  });
});
describe("/Patch/users/id/rating", function(){
  it("it should update a users rating by the given id when user is authenticated", function(done) {
    User.findOne({}, (err, user) => {
			const data = {
				rating: 5,
			};
      chai
        .request(server)
				.patch(`/users/${user.user_id}/rating`)
				.send(data)
        .set("Authorization", user.token)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });
});
describe("/Patch/users/id/rating", function(){
  it("it should update a users rating by the given id when user is not authenticated", function(done) {
    User.findOne({}, (err, user) => {
			const data = {
				rating: 5,
			};
      chai
        .request(server)
				.patch(`/users/${user.user_id}/rating`)
				.send(data)
        .set("Authorization", 'invalid token')
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });
  });
});
describe("/Patch/users/id/rating", function(){
  it("it should not update a users rating by the given id when rating is not provided", function(done) {
    User.findOne({}, (err, user) => {
			const data = {
			};
      chai
        .request(server)
				.patch(`/users/${user.user_id}/rating`)
				.send(data)
        .set("Authorization", user.token)
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
  });
});
describe("/Post/users/id/walkthrough", function(){
  it("it should send a walkthrough of the platform to a user by a given id when he is authenticated", function(done) {
    User.findOne({}, (err, user) => {
      chai
        .request(server)
				.post(`/users/${user.user_id}/walkthrough`)
        .set("Authorization", user.token)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });
});
describe("/Post/users/id/walkthrough", function(){
  it("it should not send a walkthrough of the platform to a user by a given id when he is not authenticated", function(done) {
    User.findOne({}, (err, user) => {
      chai
        .request(server)
				.post(`/users/${user.user_id}/walkthrough`)
        .set("Authorization", 'invalid token')
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });
  });
});