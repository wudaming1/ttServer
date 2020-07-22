const Vip = require('../model/vip').model
const queryList = require('../model/vip').queryList
// const saveRecord = require('../model/vipRecord').saveRecord
// const queryRecord = require('../model/vipRecord').queryRecord
const {saveRecord, queryRecord} = require('../model/vipRecord')

const server = require('server');
// const { type } = require('server/reply');
const { post } = server.router;
const isEmpty = require('../utils/check').isEmpty


let create = async (ctx) => {
    let params = ctx.data;
    console.log(params);
    let result = {
        code: 1000,
        message: '',
        data: ''
    }
    const date = new Date();
    params.createTime = date.getTime();
    params.modifyTime = date.getTime();
    params.totalCharge = params.money;
    let old = await Vip.find().byPhone(params.phone).exec();
    console.log(old)
    if (old.length === 1) {
        result.code = 2000;
        result.message = '已存在该会员！';
    } else {
        let vip = new Vip(params);
        let res = await vip.save();
        await saveRecord(params, 0);
        result.data = res;
        console.log(res);
    }
    return result;
}

let queryVip = async (ctx) => {
    let phone = ctx.data.phone;
    let res = await Vip.find().byPhone(phone).exec();
    let result = {
        code: 1000,
        message: '',
        data: res[0]
    }
    if(isEmpty(res)){
        result.code = 2000,
        result.message = '没有这个用户'
    }
    console.log(res);
    return result;
}

let charge = async (ctx) => {
    let phone = ctx.data.phone;
    let money = ctx.data.money;
    let password = ctx.data.password;
    let oldRes = await Vip.find().byPhone(phone).exec();
    let result = {
        code: 1000,
        message: '',
        data: ''
    }
    if (isEmpty(oldRes)) {
        result.code = 2000;
        result.message = '不存在该会员！';
    }
    if(password !== oldRes[0].password){
        result.code = 2000;
        result.message = '密码错误！';
        return result;
    }
    console.log(`money: ${money},old: ${oldRes.money}`);
    oldRes = oldRes[0];
    console.log(oldRes)
    let newTotal = oldRes.totalCharge + money;
    let newMoney = oldRes.money + money;
    let updateTime = new Date().getTime();

    let id = oldRes._id;
    let res = await Vip.findByIdAndUpdate(id,
        {
            money: newMoney,
            totalCharge: newTotal,
            modifyTime: updateTime
        })
    saveRecord({
        money: money,
        phone: phone
    }, 0);
    result.data = `充值成功 ${money} 元！`;
    result.message = `充值成功 ${money} 元！`;
    console.log(res);
    return result;
}

let consume = async (ctx) => {
    let phone = ctx.data.phone;
    let money = - ctx.data.money;
    let password = ctx.data.password;
    let oldRes = await Vip.find().byPhone(phone).exec();
    let result = {
        code: 1000,
        message: '',
        data: ''
    }
    if (isEmpty(oldRes)) {
        result.code = 2000;
        result.message = '不存在该会员！';
    }
    if(password !== oldRes[0].password){
        result.code = 2000;
        result.message = '密码错误！';
        return result;
    }
    console.log(`money: ${money},old: ${oldRes.money}`);
    oldRes = oldRes[0];
    console.log(oldRes)
    let newMoney = oldRes.money + money;
    let updateTime = new Date().getTime();
    if (newMoney < 0) {
        result.code = 2000;
        result.data = ``;
        result.message = "消费金额大于余额！";
        return result;
    }
    let id = oldRes._id;
    let res = await Vip.findByIdAndUpdate(id,
        {
            money: newMoney,
            modifyTime: updateTime
        })
    saveRecord({
        money: -money,
        phone: phone
    }, 1);
    result.data = `消费 ${-money} 元！`;
    result.message = `消费 ${-money} 元！`;
    console.log(res);
    return result;
}


//**支持分页 */
async function queryVipRecord(ctx){
    let items = await queryRecord(ctx.data)
    let result = {
        code: 1000,
        message: '查询消费记录！',
        data: items
    }
    console.log(result)
    return result;
}

async function queryVipList(ctx){
    let result = {
        code: 1000,
        message: '查询消费记录！',
        data: ''
    }
    result.data = await queryList(ctx.data)

    return result;
}

async function modifyPassword(ctx){
    let params = ctx.data;
    let old = await Vip.find().byPhone(params.phone).exec();
    let result = {
        code: 1000,
        message: '密码修改成功！',
        data: ''
    }
    if(old[0].password !== params.oldPassword){
        result.code = 2000;
        result.message = '旧密码错误！'
        return result;
    }
    let updateRes =  await Vip.findByIdAndUpdate(old[0]._id,{password:params.newPassword}).exec();
    result.data = updateRes
    return result;
}

exports.api = [
    post('/vip/create', create),
    post('/vip/queryVip', queryVip),
    post('/vip/queryRecord', queryVipRecord),
    post('/vip/charge', charge),
    post('/vip/consume', consume),
    post('/vip/list', queryVipList),
    post('/vip/modifyPassword', modifyPassword),
]