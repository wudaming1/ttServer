const Vip = require('../model/vip').model;
const queryList = require('../model/vip').queryList;
const {saveRecord, queryRecord, yearReport} = require('../model/vipRecord');

const isEmpty = require('../utils/check').isEmpty;
const {router} = require('./index');


let create = async (ctx) => {
    let params = ctx.request.body;
    const date = new Date();
    params.createTime = date.getTime();
    params.modifyTime = date.getTime();
    params.totalCharge = params.money;
    let old = await Vip.find().byPhone(params.phone).exec();
    if (old.length === 1) {
        throw new Error('已存在该会员！');
    } else {
        let vip = new Vip(params);
        let res = await vip.save();
        await saveRecord(params, 0);
        ctx.body.data = res;
    }
};

let queryVip = async (ctx) => {
    let phone = ctx.request.body.phone;
    let res = await Vip.find().byPhone(phone).exec();
    if (isEmpty(res)) {
        throw new Error('没有这个用户');
    }
    ctx.body.data = res[0];
};

let charge = async (ctx) => {
    let {phone, money, password} = ctx.request.body;
    let oldRes = await Vip.find().byPhone(phone).exec();
    if (isEmpty(oldRes)) {
        throw new Error('不存在该会员！');
    }
    if (password !== oldRes[0].password) {
        throw new Error('密码错误！');
    }
    console.log(`money: ${money},old: ${oldRes.money}`);
    oldRes = oldRes[0];
    let newTotal = oldRes.totalCharge + money;
    let newMoney = oldRes.money + money;
    let updateTime = new Date().getTime();

    let id = oldRes._id;
    await Vip.findByIdAndUpdate(id,
        {
            money: newMoney,
            totalCharge: newTotal,
            modifyTime: updateTime
        });
    saveRecord({
        money: money,
        phone: phone
    }, 0);
    ctx.body.data = `充值成功 ${money} 元！`;
};

let consume = async (ctx) => {
    let {phone, money, password} = ctx.request.body;
    let oldRes = await Vip.find().byPhone(phone).exec();
    if (isEmpty(oldRes)) {
        throw new Error('不存在该会员！');
    }
    if (password !== oldRes[0].password) {
        throw new Error('密码错误！');
    }
    console.log(`money: ${money},old: ${oldRes.money}`);
    oldRes = oldRes[0];
    console.log(oldRes);
    let newMoney = oldRes.money + money;
    let updateTime = new Date().getTime();
    if (newMoney < 0) {
        throw new Error('消费金额大于余额!');
    }
    let id = oldRes._id;
    await Vip.findByIdAndUpdate(id,
        {
            money: newMoney,
            modifyTime: updateTime
        })
    saveRecord({
        money: -money,
        phone: phone
    }, 1);
    ctx.body.data = `消费 ${-money} 元！`;
};


//**支持分页 */
async function queryVipRecord(ctx) {
    ctx.body.data = await queryRecord(ctx.request.body);
}

async function queryVipList(ctx) {
    ctx.body.data = await queryList(ctx.request.body);
}

async function modifyPassword(ctx) {
    let params = ctx.request.body;
    let old = await Vip.find().byPhone(params.phone).exec();
    if (old[0].password !== params.oldPassword) {
        throw new Error('旧密码错误!')
    }
    ctx.body.data = await Vip.findByIdAndUpdate(old[0]._id, {password: params.newPassword}).exec()
}

async function getYearReport(ctx) {
    let params = ctx.request.body;
    if (!params.year) {
        throw new Error('缺少年份参数！')
    }
    ctx.body.data = await yearReport(params.year);
}

router.post('/vip/create', create);
router.post('/vip/queryVip', queryVip);
router.post('/vip/queryRecord', queryVipRecord);
router.post('/vip/charge', charge);
router.post('/vip/consume', consume);
router.post('/vip/list', queryVipList);
router.post('/vip/modifyPassword', modifyPassword);
router.post('/vip/getYearReport', getYearReport);



