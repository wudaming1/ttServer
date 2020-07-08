const Vip = require('../model/vip').model

const server = require('server');
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
    console.log(res);
    return result;
}

let charge = async (ctx) => {
    let phone = ctx.data.phone;
    let money = ctx.data.money;
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
    result.data = `充值成功 ${money} 元！`;
    result.message = `充值成功 ${money} 元！`;
    console.log(res);
    return result;
}

let consume = async (ctx) => {
    let phone = ctx.data.phone;
    let money = - ctx.data.money;
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
    console.log(`money: ${money},old: ${oldRes.money}`);
    oldRes = oldRes[0];
    console.log(oldRes)
    let newMoney = oldRes.money + money;
    let updateTime = new Date().getTime();
    if(newMoney < 0){
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
    result.data = `消费 ${-money} 元！`;
    result.message = `消费 ${-money} 元！`;
    console.log(res);
    return result;
}


exports.api = [
    post('/vip/create', create),
    post('/vip/queryVip', queryVip),
    post('/vip/charge', charge),
    post('/vip/consume', consume),
]