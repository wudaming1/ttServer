const { model, Schema } = require('mongoose');

exports.model = model('Deal', Schema({
    type: { type: String, required: true },
    count: {
        type: Number,
        required: true,
        min:[0, '金额不能小于0'],
    },
    shop: {
        type: String,
        required: true,
     },
     userId: { type: String, required: true },
     time: Number
}));
