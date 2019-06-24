const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
  user_id: {
    type: String,
    unique: true,
    required: true
  },
  token: String,
  provider: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
  },
  password: {
    type: String,
    minLength: 8
  },
  role: {
    type: String,
    required: true
  },
  auth0_token: String,
  last_login: Date,
  language: {
    type: String,
    required: true
  }
}, { timestamps: true })

userSchema.pre('save', function (next) {
  const user = this
  if (!user.isModified('password')) return next()
  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err)
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) return next(err)
      user.password = hash
      next()
    })
  })
})

userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

userSchema.index({ email: 1, password: 1 })

mongoose.pluralize(null)
const model = mongoose.model('User', userSchema)

module.exports = model
