const server = require('server');
const { get } = server.router;

const user = require('./user').api;
const cashier = require('./cashier').api;

exports.api =  [get('/', ctx => 'Hello 世界')]
.concat(user)
.concat(cashier)
