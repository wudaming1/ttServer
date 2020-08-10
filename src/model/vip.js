const {model, Schema} = require('mongoose');

const vipSchema = Schema({
    money: {
        type: Number,
        required: true,
        min: [0, '金额不能小于0'],
    },
    totalCharge: {
        type: Number,
        default: 0
    },
    name: String,
    phone: {
        type: Number,
        required: true,
        match: /^\d{11}$/
    },
    password: {
        type: String,
        default: '88888888'
    },
    createTime: Number,
    modifyTime: Number
});


vipSchema.query.byPhone = function (phoneNumber) {
    return this.where({phone: phoneNumber});
};
const Model = model('Vip', vipSchema)

async function queryList(params) {
    let query = Model.find();
    if (params.phone !== undefined) {
        query.byPhone(params.phone)
    }

    return query.exec();
}

exports.model = Model;
exports.queryList = queryList;
