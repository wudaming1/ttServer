const server = require('server');
// const { type } = require('server/reply');
const { post } = server.router;
const { send, json } = server.reply;
const moment = require('moment')

const {addItem} =require('../model/account')

async function add(ctx){
    let params = ctx.data;
    params.shop = ctx.shop;
    params.time = moment(new Date()).valueOf()
    let res = await addItem(params)
    return send(res);
}


exports.api = [
    post('/account/add', add),
]