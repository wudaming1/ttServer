// Import the library
const server = require('server');
const { get, post, put, del } = server.router;
const api = require('./src/api/index.js').api

require('./src/model/db.js')
const {middles} = require('./src/middle/index')



// Answers to any request
server({ port: 3000,
    security: false }, middles,api,require('./src/middle/after').middles);