const server = require('server');
const { get } = server.router;

const user = require('./user').api;

exports.api =  [
    get('/', ctx => 'Hello 世界')
].concat(user)
