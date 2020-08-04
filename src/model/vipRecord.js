const {model, Schema} = require('mongoose');
const {isEmpty} = require('../utils/check');
const {getMonthTimeDuration} = require('../utils/timeUtils');

const Types = ['Charge', 'Consume']

const schema = Schema({
    money: {
        type: Number,
        required: true,
        min: [0, '金额不能小于0'],
    },
    type: {
        type: String,
        enum: Types
    },
    phone: {
        type: Number,
        required: true,
        match: /^\d{11}$/
    },
    createTime: Number
});

schema.query.byPhone = function (phoneNumber) {
    return this.where({phone: phoneNumber});
};
schema.query.byType = function (type) {
    return this.where({type: type});
};
let Model = model('VipRecord', schema)

exports.model = Model
exports.Types = Types

/**
 *
 * @param {Object} params 参数对象
 * @param {Number} type
 */
exports.saveRecord = async function (params, type) {
    const date = new Date();
    let createTime = date.getTime();
    let record = new Model({
        money: params.money,
        phone: params.phone,
        createTime: createTime,
        type: Types[type]
    })
    await record.save();
}


exports.queryRecord = async (params) => {
    let query = Model.find();
    let countQuery = Model.find();
    query.sort({time: -1});
    if (!isEmpty(params.phone)) {
        query.byPhone(params.phone);
        countQuery.byPhone(params.phone);
    }
    if (params.type !== undefined) {
        query.byType(Types[params.type]);
        countQuery.byType(Types[params.type]);
    }
    if (params.startTime) {
        query.where('createTime').gt(params.startTime);
        countQuery.where('createTime').gt(params.startTime);
    }

    if (params.endTime) {
        query.where('createTime').lt(params.endTime);
        countQuery.where('createTime').lt(params.endTime);
    }
    let limit = 20;
    let page = 1;
    if (params.pageSize !== null) {
        limit = params.pageSize;
    }
    if (params.page !== null) {
        page = params.page
    }
    query = query.limit(limit);
    let count = await countQuery.count();
    query.skip(limit * (page - 1));
    let items = await query.exec();

    return {
        total: count,
        items: items
    };
};

exports.yearReport = async (year) => {
    let query = Model.find();
    let beginTime = new Date(year, 0, 1).getTime();
    let endDay = new Date(year, 11, 0);
    endDay.setHours(23, 59, 59);
    let endTime = endDay.getTime();
    query.where('createTime').gt(beginTime);
    query.where('createTime').lt(endTime);
    let items = await query.exec();
    let result = [];
    for (let i = 1; i < 13; i++) {//月份循环
        let time = getMonthTimeDuration(year, i);
        let monthRecord = items.filter(item => item.createTime > time.startTime && item.createTime <= time.endTime);
        let monthReport = {
            totalCharge: 0,
            totalConsume: 0,
        };
        monthRecord.forEach(element => {
            if (element.type === Types[0]) {
                monthReport.totalCharge += element.money;
            } else {
                monthReport.totalConsume += element.money;
            }
        });
        result.push(monthReport);

    }
    return result;
};
