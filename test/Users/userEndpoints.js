const common = require('../common')
const server = common.server
const chai = common.chai

const User = require('../../src/models/user')
const Password_Reset = require('../../src/models/password-reset')

describe('/Post/api/users', () => {
  it('it should sign up a user with correct parameters', (done) => {
    const user = {
      given_name: 'Test',
      family_name: 'User',
      number: '0123546879',
      email: 'test@email.com',
      password: 'password',
      visible: true,
      language: 'en'
    }
    chai.request(server)
      .post('/api/users')
      .send(user)
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.be.a('object')
        res.body.should.have.property('id')
        res.body.should.have.property('email')
        res.body.should.have.property('name')
        res.body.should.have.property('image')
        res.body.should.have.property('token')
        done()
      })
  })
})
describe('/Post/api/users', () => {
  it('it should not sign up a user with incorrect parameters', (done) => {
    const user = {
    }
    chai.request(server)
      .post('/api/users')
      .send(user)
      .end((err, res) => {
        res.should.have.status(400)
        done()
      })
  })
})
describe('/Post/api/users', () => {
  it('it should not sign up a user with an already existing email', (done) => {
    const user = {
      given_name: 'Testo',
      family_name: 'Usero',
      number: '0123546879',
      email: 'test@email.com',
      password: 'password',
      visible: false,
      language: 'en'
    }
    chai.request(server)
      .post('/api/users')
      .send(user)
      .end((err, res) => {
        res.should.have.status(409)
        done()
      })
  })
})
describe('/Post/api/users/authenticate/email', () => {
  it('it should log in a user with correct credentials', (done) => {
    const credentials = {
      email: 'test@email.com',
      password: 'password',
      language: 'en'
    }
    chai.request(server)
      .post('/api/users/authenticate/email')
      .send(credentials)
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.be.a('object')
        res.body.should.have.property('id')
        res.body.should.have.property('email')
        res.body.should.have.property('name')
        res.body.should.have.property('image')
        res.body.should.have.property('token')
        done()
      })
  })
})
describe('/Post/api/users/authenticate/email', () => {
  it('it should not log in a user with wrong credentials', (done) => {
    const credentials = {
      email: 'test@email.com',
      password: 'pawword',
      language: 'en'
    }
    chai.request(server)
      .post('/api/users/authenticate/email')
      .send(credentials)
      .end((err, res) => {
        res.should.have.status(401)
        done()
      })
  })
})
describe('/Post/api/users/authenticate/email', () => {
  it('it should not log in a user with no credentials', (done) => {
    const credentials = {
    }
    chai.request(server)
      .post('/api/users/authenticate/email')
      .send(credentials)
      .end((err, res) => {
        res.should.have.status(401)
        done()
      })
  })
})
describe('/Post/api/users/authenticate/google', () => {
  it('it should log in a user with his google account', (done) => {
    const data = {
      deviceToken: 'deviceToken',
      language: 'en',
      origin: 'native',
      response: {
        user: {
          email: 'test@email.com'
        },
        idToken: 'googletoken'
      },
      version: '20190625'
    }
    chai.request(server)
      .post('/api/users/authenticate/google')
      .send(data)
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.be.a('object')
        res.body.should.have.property('id')
        res.body.should.have.property('email')
        res.body.should.have.property('name')
        res.body.should.have.property('image')
        res.body.should.have.property('token')
        res.body.should.have.property('google_token')
        res.body.should.have.property('origin').eql('native')
        done()
      })
  })
})
describe('/Post/api/users/authenticate/google', () => {
  it('it should sign up a user with his google account', (done) => {
    const data = {
      language: 'en',
      origin: 'native',
      response: {
        user: {
          email: 'test4@email.com',
          givenName: 'Test',
          familyName: 'User4',
          photo: '/images/groups/group_default_photo.png'
        },
        idToken: 'googletoken'
      },
      version: '20190625'
    }
    chai.request(server)
      .post('/api/users/authenticate/google')
      .send(data)
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.be.a('object')
        res.body.should.have.property('id')
        res.body.should.have.property('email')
        res.body.should.have.property('name')
        res.body.should.have.property('image')
        res.body.should.have.property('token')
        res.body.should.have.property('google_token')
        res.body.should.have.property('origin').eql('native')
        done()
      })
  })
})
if (!process.env.CIRCLECI) {
  describe('/Post/api/users/forgotpassword', () => {
    it('it should send a forgot password email for an existing user', (done) => {
      const data = { email: 'test@email.com' }
      chai.request(server)
        .post('/api/users/forgotpassword')
        .send(data)
        .end((err, res) => {
          res.should.have.status(200)
          done()
        })
    })
  })
}
describe('/Post/api/users/forgotpassword', () => {
  it('it should not send a forgot password email for non existing user', (done) => {
    const data = { email: 'fas@jela.com' }
    chai.request(server)
      .post('/api/users/forgotpassword')
      .send(data)
      .end((err, res) => {
        res.should.have.status(404)
        done()
      })
  })
})
if (!process.env.CIRCLECI) {
  describe('/Get/api/users/changepassword', () => {
    it('it should fetch a users profile given a valid reset token', (done) => {
      Password_Reset.findOne({}, (err, reset) => {
        chai.request(server)
          .get('/api/users/changepassword')
          .set('Authorization', reset.token)
          .end((err, res) => {
            res.should.have.status(200)
            res.body.should.be.a('object')
            res.body.should.have.property('user_id').eql(reset.user_id)
            res.body.should.have.property('image')
            res.body.should.have.property('given_name')
            res.body.should.have.property('family_name')
            done()
          })
      })
    })
  })
}
describe('/Get/api/users/changepassword', () => {
  it('it should not fetch a users profile given a invalid reset token', (done) => {
    chai.request(server)
      .get('/api/users/changepassword')
      .set('Authorization', 'invalidtoken')
      .end((err, res) => {
        res.should.have.status(401)
        done()
      })
  })
})
describe('/Get/api/users/changepassword', () => {
  it('it should not fetch a users profile given a valid authentication token', (done) => {
    User.findOne({}, (err, user) => {
      chai.request(server)
        .get('/api/users/changepassword')
        .set('Authorization', user.token)
        .end((err, res) => {
          res.should.have.status(404)
          done()
        })
    })
  })
})
if (!process.env.CIRCLECI) {
  describe('/Post/api/users/changepassword', () => {
    it('it should change the password of the user  when a valid reset token is provided', (done) => {
      const data = { password: 'password' }
      Password_Reset.findOne({}, (err, reset) => {
        chai.request(server)
          .post('/api/users/changepassword')
          .set('Authorization', reset.token)
          .send(data)
          .end((err, res) => {
            res.should.have.status(200)
            res.body.should.be.a('object')
            res.body.should.have.property('id')
            res.body.should.have.property('email')
            res.body.should.have.property('name')
            res.body.should.have.property('image')
            res.body.should.have.property('token')
            done()
          })
      })
    })
  })
}
describe('/Post/api/users/changepassword', () => {
  it('it should not change the password of the user when an invalid token is provided', (done) => {
    let data = { password: 'password' }
    chai.request(server)
      .post('/api/users/changepassword')
      .set('Authorization', 'invalidtoken')
      .send(data)
      .end((err, res) => {
        res.should.have.status(401)
        done()
      })
  })
})
describe('/Post/api/users/changepassword', () => {
  it('it should not change the password of the user when a valid authentication token is provided', (done) => {
    let data = { password: 'password' }
    User.findOne({}, (err, user) => {
      chai.request(server)
        .post('/api/users/changepassword')
        .set('Authorization', user.token)
        .send(data)
        .end((err, res) => {
          res.should.have.status(404)
          done()
        })
    })
  })
})
describe('/Get/api/users/id', () => {
  it('it should fetch a user by the given id when user is authenticated', (done) => {
    User.findOne({}, (err, user) => {
      chai.request(server)
        .get(`/api/users/${user.user_id}`)
        .set('Authorization', user.token)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.a('object')
          res.body.should.have.property('email')
          res.body.should.have.property('password')
          res.body.should.have.property('token')
          res.body.should.have.property('language')
          res.body.should.have.property('user_id').eql(user.user_id)
          done()
        })
    })
  })
})
describe('/Get/api/users/id', () => {
  it('it should not fetch a user by the given id when user is not authenticated', (done) => {
    User.findOne({}, (err, user) => {
      chai.request(server)
        .get(`/api/users/${user.user_id}`)
        .set('Authorization', 'invalidtoken')
        .end((err, res) => {
          res.should.have.status(401)
          done()
        })
    })
  })
})
describe('/Get/api/users/id', () => {
  it('it should not fetch a user when token user_id doesnt match request user_id', (done) => {
    User.find({}, (err, users) => {
      chai.request(server)
        .get(`/api/users/${users[0].user_id}`)
        .set('Authorization', users[1].token)
        .end((err, res) => {
          res.should.have.status(401)
          done()
        })
    })
  })
})
describe('/Post/api/users/id/suspend', () => {
  it('it should suspend a users account by a given id when request user_id matches token user_id', (done) => {
    User.findOne({ email: 'test2@email.com' }, (err, user) => {
      chai.request(server)
        .post(`/api/users/${user.user_id}/suspend`)
        .set('Authorization', user.token)
        .end((err, res) => {
          res.should.have.status(200)
          done()
        })
    })
  })
})
describe('/Post/api/users/id/suspend', () => {
  it('it should not suspend a users account by a given id when request user_id doesnt match token user_id', (done) => {
    User.find({}, (err, users) => {
      chai.request(server)
        .post(`/api/users/${users[0].user_id}/suspend`)
        .set('Authorization', users[1].token)
        .end((err, res) => {
          res.should.have.status(401)
          done()
        })
    })
  })
})
describe('/Delete/api/users/id', () => {
  it('it should delete a user by the given id when token user_id matched request user_id', (done) => {
    User.findOne({ email: 'test2@email.com' }, (err, user) => {
      chai.request(server)
        .delete(`/api/users/${user.user_id}`)
        .set('Authorization', user.token)
        .end((err, res) => {
          res.should.have.status(200)
          done()
        })
    })
  })
})
describe('/Delete/api/users/id', () => {
  it('it should not delete a user when token user_id doesnt match request user_id', (done) => {
    User.find({}, (err, users) => {
      chai.request(server)
        .delete(`/api/users/${users[0].user_id}`)
        .set('Authorization', users[1].token)
        .end((err, res) => {
          res.should.have.status(401)
          done()
        })
    })
  })
})
describe('/Post/api/users/id/export', () => {
  it('it should a export a users data by a given id when request user_id matches token user_id', (done) => {
    User.findOne({}, (err, user) => {
      chai.request(server)
        .post(`/api/users/${user.user_id}/export`)
        .set('Authorization', user.token)
        .end((err, res) => {
          res.should.have.status(200)
          done()
        })
    })
  })
})
describe('/Post/api/users/id/export', () => {
  it('it should not a export a users data by a given id when request user_id doesnt match token user_id', (done) => {
    User.find({}, (err, users) => {
      chai.request(server)
        .post(`/api/users/${users[0].user_id}/export`)
        .set('Authorization', users[1].token)
        .end((err, res) => {
          res.should.have.status(401)
          done()
        })
    })
  })
})
describe('/Post/api/users/id/export', () => {
  it('it should not a export a users data by a given id when an invalid token is provided', (done) => {
    User.find({}, (err, users) => {
      chai.request(server)
        .post(`/api/users/${users[0].user_id}/export`)
        .set('Authorization', 'invalid token')
        .end((err, res) => {
          res.should.have.status(401)
          done()
        })
    })
  })
})
describe('/Get/api/users/userId/events', () => {
  it('it should not fetch a users events when he isnt authenticated', (done) => {
    User.findOne({ email: 'test@email.com' }, (err, user) => {
      chai.request(server)
        .get(`/api/users/${user.user_id}/events`)
        .set('Authorization', 'invalidtoken')
        .end((err, res) => {
          res.should.have.status(401)
          done()
        })
    })
  })
})
describe('/Get/api/users/userId/events', () => {
  it('it should not fetch a users events when he is attending none', (done) => {
    User.findOne({ email: 'test@email.com' }, (err, user) => {
      chai.request(server)
        .get(`/api/users/${user.user_id}/events`)
        .set('Authorization', user.token)
        .end((err, res) => {
          res.should.have.status(404)
          done()
        })
    })
  })
})
