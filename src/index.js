require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const morgan = require('morgan');
const chalk = require('chalk');
const jwt = require('jsonwebtoken');
const compression = require('compression')
const port = parseInt(process.env.PORT, 10);
const app_instance = process.argv.NODE_APP_INSTANCE;
process.argv.NODE_APP_INSTANCE = "";
const config = require('config');
process.argv.NODE_APP_INSTANCE = app_instance;
const dbHost= config.get('dbConfig.host')
mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true);
mongoose.connect(process.env[dbHost], { family: 4 })
mongoose.Promise = global.Promise;

const app = express();

app.use(async (req) => {
	try {
		const token = req.headers.authorization;
		const { user_id, email } = await jwt.verify(token, process.env.SERVER_SECRET)
		req.user_id = user_id;
		req.email = email;
		return req.next()
	} catch (e) {
		return req.next()
	}
})
app.use(compression())
if(config.util.getEnv('NODE_ENV') !== 'test') {
  app.use(morgan('dev'));
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../client/build')));
app.use('/images', express.static(path.join(__dirname, '../images')));


app.use('/groups', require('./routes/group-routes'));
app.use('/users', require('./routes/user-routes'));
app.use('/profiles', require('./routes/profile-routes'));
app.use('/children', require('./routes/child-routes'));

app.get( '/*', (req,res) => {
	res.sendFile('index.html', { root:path.join(__dirname, '../client/build') })
})

app.all('*', (req, res) => res.status(404).send('Invalid endpoint'));

const server = app.listen(port, () => {
	console.log(` Server ${chalk.green('started')} at http://localhost:${port}.`);
});

app.use(function (err, req, res, next) {
	console.error(err.stack)
	res.status(500).send('Something went wrong!')
})

module.exports = server;
