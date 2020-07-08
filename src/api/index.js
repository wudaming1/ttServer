const server = require('server');
const { get } = server.router;

const user = require('./user').api;
const cashier = require('./cashier').api;
const vip = require('./vip').api

exports.api =  [get('/', ctx => 'Hello 世界')]
.concat(user)
.concat(cashier)
.concat(vip)
