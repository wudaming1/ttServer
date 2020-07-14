const server = require('server');
// const { type } = require('server/reply');
const { post } = server.router;
const { send, json } = server.reply;
const moment = require('moment')

const prefix = 'dailySummary'
const {addItem, queryItems, modifyItem, deleteItem} =require('../model/dailySummary')

/**
 * 添加记录
 * @param ctx
 * @returns {Promise<void>}
 */
async function add(ctx){
    let params = ctx.data;
    params.shop = ctx.shop;
    params.time = moment(new Date()).valueOf()
    ctx.res.data = await addItem(params);
}

/**
 * 查询记录，支持分页
 * @param ctx
 * @returns {Promise<void>}
 */
async function queryList(ctx){
    let params = ctx.data;
    params.shop = ctx.shop;
    let data = await queryItems(params)
    ctx.res.data = data;
}

/**
 * 修改记录，仅修改金额
 * @param ctx
 * @returns {Promise<void>}
 */
async function modify(ctx) {
    let data = await modifyItem(ctx.data)
    if (!!data){
        ctx.res.data =data
    }else{
        ctx.res.message = "没有这条记录！"
    }

}

async function del(ctx){
    let data = await deleteItem(ctx.data)
    if(!!data){
        ctx.res.data = data
    }else{
        ctx.res.message = "没有这条记录！"
    }
}

exports.api = [
    post('/account/add', add),
    post('/account/query', queryList),
    post('/account/modify', modify),
    post('/account/delete', del),
]