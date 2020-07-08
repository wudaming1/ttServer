const { model, Schema } = require('mongoose');

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
    phone: {
        type: Number,
        required: true,
        match: /^\d{11}$/
    },
    createTime: Number,
    modifyTime: Number
});

vipSchema.query.byPhone = function(phoneNumber) {
    return this.where({ phone: phoneNumber });
  };

exports.model = model('Vip', vipSchema)