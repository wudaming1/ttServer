const { model, Schema } = require('mongoose');

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
    return this.where({ phone: phoneNumber });
};
schema.query.byType = function (type) {
    return this.where({ type: type });
};
let Model = model('VipRecord', schema)

exports.model = Model
exports.Types = Types

/**
 * 
 * @param {参数} params 
 * @param {0|1} type 
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


exports.queryRecord = async (params) =>{
    let query = Model.find();
    let countQuery = Model.find();
    query.sort({ time: -1 });
    query.byPhone(params.phone);
    countQuery.byPhone(params.phone);
    if(params.type !== undefined){
        query.byType(Types[params.type])
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
    console.log(params)
    let count = await countQuery.count();
    query.skip(2)
    query.skip(limit * (page - 1))
    let items = await query.exec();

    result = {
        total: count,
        items: items
    }
    console.log(result)
    return result;
}