const { model, Schema } = require('mongoose');


const schame = Schema({
    type: {
        type: String,
        required: true,
        enum: ['in', 'out']
    },
    desc: {
        type: String,
        requird: true
    },
    amount: {
        type: Number,
        required: true,
        min: [0, '金额不能小于0'],
    },
    shop: {
        type: String,
        required: true,
    },
    time: Number
})

schame.query.byType = function (type) {
    if (!!type) {
        this.where({ type: type })
    }
    return this;
};

schame.query.byTime = function (startTime, endTime) {
    if (!!startTime) {
        this.where('time').gt(params.startTime);
    }
    if (!!endTime) {
        this.where('time').lt(params.startTime);
    }
    return this;
};


const Model = model('Account', schame)

async function count(params) {
    let query = Model.find();
    query.byType(params.type);
    query.byTime(params.startTime, params.endTime);
    let count = await query.count();
    return count;
}

async function queryItems(params) {
    let query = Model.find();
    query.sort({ time: -1 })
    query.byType(params.type);
    query.byTime(params.startTime, params.endTime);
    query.skip((params.page - 1) * params.pageSize);
    let items = await query.exec();
    let total = await count(params)
    return {
        items: items,
        total: total
    };
}

async function addItem(params) {
    let item = new Model(params);
    return await item.save()
}

async function modifyItem(params) {
    return await Model.findByIdAndUpdate(params.id, params)
}


async function deleteItem(params) {
    return await Model.findByIdAndDelete(params.id)
}

module.exports={
    Account:Model,
    addItem:addItem
}
    