// Import the library
const server = require('server');
const { get, post, put, del } = server.router;
const api = require('./src/api/index.js').api

require('./src/db/index')

// Answers to any request
server({ port: 3000,
    security: false }, api);