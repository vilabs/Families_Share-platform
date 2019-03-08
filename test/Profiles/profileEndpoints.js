const common = require('../common')
const server = common.server;
const chai = common.chai;

const User = require('../../src/models/user');
const Profile = require('../../src/models/profile');

describe('/Get/Profiles', () => {
	it('it should fetch profile names and images for an events participating parents when user is authenticated', (done) => {
		User.findOne({ email: "test@email.com" }, (err, user) => {
			chai.request(server)
				.get('/profiles')
				.set('Authorization', user.token)
				.query({searchBy: 'ids', ids:[user.user_id]})
				.end((err, res) => {
					res.should.have.status(200)
					res.body.should.be.a('array').with.lengthOf(1);
					done();
				})
		});
	});
});
describe('/Get/Profiles', () => {
	it('it should not fetch profile names and images for an events participating parents when user isnt authenticated', (done) => {
		chai.request(server)
			.get('/profiles')
			.set('Authorization','invalidtoken')
			.query({ searchBy: 'ids', ids: ['id'] })
			.end((err, res) => {
				res.should.have.status(401)
				done();
			})
	});
});
describe('/Get/Profiles', () => {
	it('it should not fetch profile names and images for an events participating parents when user ids are not provided', (done) => {
		User.findOne({ email: "test@email.com" }, (err, user) => {
			chai.request(server)
				.get('/profiles')
				.set('Authorization', user.token)
				.query({searchBy: 'ids'})
				.end((err, res) => {
					res.should.have.status(400)
					done();
				})
		});
	});
});
describe('/Get/Profiles', () => {
	it('it should not fetch profile names and images for an events participating parents when user invalid ids are provided', (done) => {
		User.findOne({ email: "test@email.com" }, (err, user) => {
			chai.request(server)
				.get('/profiles')
				.set('Authorization', user.token)
				.query({searchBy: 'ids', ids:['invalidid','invalidid']})
				.end((err, res) => {
					res.should.have.status(404)
					done();
				})
		});
	});
});
describe('/Get/Profiles', () => {
	it('it should fetch visible profile names and images when user is authenticated', (done) => {
		User.findOne({ email: "test@email.com" }, (err, user) => {
			chai.request(server)
				.get('/profiles')
				.set('Authorization', user.token)
				.query({searchBy: 'visibility', visible:true})
				.end((err, res) => {
					res.should.have.status(200)
					res.body.should.be.a('array').with.lengthOf(3);
					done();
				})
		});
	});
});
describe('/Get/Profiles', () => {
	it('it should not fetch visible profile names and images when visibility is not provided', (done) => {
		User.findOne({ email: "test@email.com" }, (err, user) => {
			chai.request(server)
				.get('/profiles')
				.set('Authorization', user.token)
				.query({searchBy: 'visibility'})
				.end((err, res) => {
					res.should.have.status(400)
					done();
				})
		});
	});
});
describe('/Get/Profiles', () => {
	it('it should not fetch visible profile names and images when there are none', (done) => {
		User.findOne({ email: "test@email.com" }, (err, user) => {
			Profile.updateMany({}, { visible: false }, (err) => {
				chai.request(server)
					.get('/profiles')
					.set('Authorization', user.token)
					.query({ searchBy: 'visibility', visible: true })
					.end((err, res) => {
						res.should.have.status(404)
						done();
					})
			});
		});
	});
});
describe('/Get/Profiles', () => {
	it('it should not fetch profile names and images when query is incorrect', (done) => {
		User.findOne({ email: "test@email.com" }, (err, user) => {
			Profile.updateMany({}, { visible: false }, (err) => {
				chai.request(server)
					.get('/profiles')
					.set('Authorization', user.token)
					.query({foo: 'bar'})
					.end((err, res) => {
						res.should.have.status(400)
						done();
					})
			});
		});
	});
});