process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../src/index');
chai.should();
chai.use(chaiHttp);

exports.chai = chai ;
exports.server = server ;
