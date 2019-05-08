const common = require('../common')
const server = common.server;
const chai = common.chai;

const Child = require('../../src/models/child');
const User = require('../../src/models/user');

describe('/Get/api/children', () => {
	it('it should fetch participating childrens names and images for an event when user is authenticated', (done) => {
		User.findOne({ email: "test@email.com" }, (err, user) => {
			Child.findOne({}, (err, child) => {
				chai.request(server)
				.get(`/api/children`)
				.set('Authorization', user.token)
				.query({ids: [child.child_id]})
				.end( (err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('array').with.lengthOf(1);
					done();
				});
			});
		});
	});
});
describe('/Get/api/children', () => {
	it('it should not fetch participating childrens names and images when no ids are provided', (done) => {
		User.findOne({ email: "test@email.com" }, (err, user) => {
			chai.request(server)
				.get(`/api/children`)
				.set('Authorization', user.token)
				.query({})
				.end((err, res) => {
					res.should.have.status(400);
					done();
				});
		});
	});
});
describe('/Get/api/children', () => {
	it('it should not fetch participating childrens names and images when user isnt authenticated', (done) => {
		Child.findOne({}, (err, child) => {
			chai.request(server)
				.get(`/api/children`)
				.set('Authorization', 'invalidtoken')
				.query({ids: [child.child_id]})
				.end((err, res) => {
					res.should.have.status(401);
					done();
				});
		});
	});
});
describe('/Get/api/children', () => {
	it('it should not fetch participating childrens names and images when invalid ids are provided', (done) => {
		User.findOne({ email: "test@email.com" }, (err, user) => {
			chai.request(server)
				.get(`/api/children`)
				.set('Authorization', user.token)
				.query({ ids: ['invalidid', 'invalidid'] })
				.end((err, res) => {
					res.should.have.status(404);
					done();
				});
		});
	});
});