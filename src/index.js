require('dotenv').config()
const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const morgan = require('morgan')
const chalk = require('chalk')
const jwt = require('jsonwebtoken')
const compression = require('compression')
const http = require('http')
const https = require('https')
const fs = require('fs')

const port = parseInt(process.env.PORT, 10)
const config = require('config')

const dbHost = config.get('dbConfig.host')
mongoose.set('useCreateIndex', true)
mongoose.set('useNewUrlParser', true)
mongoose.connect(process.env[dbHost]) // { autoIndex: false } set this to false in production to disable auto creating indexes
mongoose.Promise = global.Promise

const app = express()

if (process.env.CITYLAB !== 'ALL') {
	app.use(function (req, res, next) {
		if(!req.secure) {
			var secureUrl = "https://" + req.headers['host'] + req.url; 
			res.writeHead(301, { "Location":  secureUrl });
			res.end();
		}
		next();
	});
}

app.use(async (req) => {
  try {
    const token = req.headers.authorization
    const { user_id, email } = await jwt.verify(token, process.env.SERVER_SECRET)
    req.user_id = user_id
    req.email = email
    return req.next()
  } catch (e) {
    return req.next()
  }
})
app.use(compression())

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/images', express.static(path.join(__dirname, '../images')))

if (config.util.getEnv('NODE_ENV') === 'development') {
  app.use(morgan('dev'))
}

app.use('/api/groups', require('./routes/group-routes'))
app.use('/api/users', require('./routes/user-routes'))
app.use('/api/profiles', require('./routes/profile-routes'))
app.use('/api/children', require('./routes/child-routes'))
app.use('/api/github', require('./routes/github-routes'))

if (config.util.getEnv('NODE_ENV') === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')))
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'))
  })
}

app.all('*', (req, res) => res.status(404).send('Invalid endpoint'))

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something went wrong!')
})

let privateKey, certificate, ca, credentials, httpsServer, server, httpServer;

if (process.env.CITYLAB === 'ALL') {
	httpServer = http.createServer(app)
	server = httpServer.listen(port, () => {
		console.log(` Server ${chalk.green('started')} at http://localhost:${port}.`)
	})
} else {
	const folder = `/etc/letsencrypt/live/${process.env.CITYLAB.toLowerCase()}app.families-share.eu/`
	privateKey = fs.readFileSync(folder+'privkey.pem', 'utf8');
	certificate = fs.readFileSync(folder+'cert.pem', 'utf8');
		ca = fs.readFileSync(folder+'chain.pem', 'utf8');
		credentials = {
			key: privateKey,
			cert: certificate,
			ca: ca
		};
		httpsServer = https.createServer(credentials, app);
		server = httpsServer.listen(process.env.PORT, () => {
			console.log(` HTTPS Server ${chalk.green('started')} at https://localhost:${port}.`)
		});
}

module.exports = server

