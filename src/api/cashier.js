const { status, json, send } = require('server/reply');
const Deal =require('../model/deal.js').model

const server = require('server');
const { get, post } = server.router;


let addCashier = async (ctx) => {
    let dealInfo = ctx.data;
    console.log('新增收银记录：'+JSON.stringify(dealInfo));

    let deal = new Deal(dealInfo);
    let date = new Date();
    deal.time = Date.parse(date);
    let result = {
        code:1000,
        message: '',
        data:'保存成功！'
    };
    result.data = await deal.save();
    
    return result;
}

/**
 * 
 * @param {} ctx 
 * 数据格式:
 * {
 *  userId: xxx,
 *  startTime: xxx,时间戳
 *  endTime: xxx,时间戳
 *  shop: xxx,
 *  pageSize: 4,
 *  page: 1,
 * }
 */
let query = async (ctx) => {
    let params = ctx.data;
    let query = Deal.find();
    let countQuery = Deal.find();
    query.sort({time: -1});
    if(params.userId){
        query = query.where('userId').equals(params.userId);
        countQuery = countQuery.where('userId').equals(params.userId);
    }
    if(params.startTime){
        query = query.where('time').gt(params.startTime);
        countQuery = countQuery.where('time').gt(params.startTime);
    }

    if(params.endTime){
        query = query.where('time').lt(params.endTime);
        countQuery = countQuery.where('time').lt(params.endTime);
    }

    if(params.shop){
        query = query.where('shop').equals(params.shop);
        countQuery = countQuery.where('shop').equals(params.shop);
    }
    let limit = 5;
    let page = 1;
    if(params.pageSize !== null){
        limit = params.pageSize;
    }
    if(params.page !== null){
        page = params.page
    }
    query = query.limit(limit);
    console.log(params)
    let result = {
        code:1000,
        message: '',
        data:'请求成功！'
    };
    let count = await countQuery.count();
    query.skip(2)
    query.skip(limit*(page -1))
    let deals = await query.exec();

    result.data = {
        total:count,
        items:deals
    }
    return result;

}

let queryToatl = async (ctx) => {
    let params = ctx.data;
    let query = Deal.find();
    if(params.startTime){
        query = query.where('time').gt(params.startTime);
    }

    if(params.endTime){
        query = query.where('time').lt(params.endTime);
    }

    if(params.shop){
        query = query.where('shop').equals(params.shop);
    }
    let result = {
        code:1000,
        message: '',
        data:'请求成功！'
    };

    let deals = await query.exec();
    
    let total = 0;
    let wx = 0;
    let xj = 0;
    let zfb = 0;
    for (let elem of deals.values()) {
        total += elem.count;
        if(elem.type === 'wx'){
            wx += elem.count;
        } else if(elem.type === 'zfb'){
            zfb += elem.count;
        } else if(elem.type === 'xj'){
            xj += elem.count;
        }
    }

    result.data = {
        total:total,
        wx: wx,
        zfb: zfb,
        xj: xj,
    }
    return result;
}

/**
 * 
 * @param {*} ctx 
 * params
 * {
 *  _id:'xxxx',
 * }
 */
let deleteItem = async (ctx) => {
    let id = ctx.data['_id'];
    
    let deleteRes = await Deal.findByIdAndRemove(id).exec();
    let result = {
        code:1000,
        message: '',
        data: deleteRes
    };
    if(deleteRes === null){
        result.code = 2000;
        result.message = '不存在这条记录！'
    }
    return result;
}

/**
 * 
 * @param {*} ctx 
 * params
 * {
 *  id:'xxxx',
 * money:55，
 * type：xxx
 * }
 */
let modifyItem = async (ctx) => {
    let id = ctx.data['id'];
    let money = ctx.data['money'];
    let type = ctx.data['type'];
    let updateRes = await Deal.findByIdAndUpdate(id,{count:money,type: type});
    console.log(updateRes);
    let result = {
        code:1000,
        message: '',
        data: updateRes
    };
    if(updateRes === null){
        result.code = 2000;
        result.message = '不存在这条记录！'
    }
    return result;
}

exports.api = [
    post('/cash/add', addCashier),
    post('/cash/query', query),
    post('/cash/queryTotal', queryToatl),
    post('/cash/delete', deleteItem),
    post('/cash/modify', modifyItem)
]