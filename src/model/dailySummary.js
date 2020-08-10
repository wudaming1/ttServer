const { model, Schema } = require('mongoose');
const moment =require('moment')
const {isEmpty} = require('../utils/check');

const schema = Schema({
    createTime:{
        type:Number,
        required: true
    },
    updateTime:{
        type:Number,
        required: true
    },
    inMoney:{
        type:Number,
        default:0,
        required:true
    },
    outMoney:{
        type:Number,
        default:0,
        required:true
    },
    date:{//用于查询
        type:String,
        required:true
    }
});

schema.query.byDate = function (date) {
    if (!!date) {
        this.where({ date: date })
    }
    return this;
};

schema.query.byTime = function (startTime, endTime) {
    if (!!startTime) {
        this.where('createTime').gt(startTime);
    }
    if (!!endTime) {
        this.where('createTime').lt(endTime);
    }
    return this;
};


const Model = model('DailySummary', schema)

async function count(params) {
    let query = Model.find();
    query.byTime(params.startTime, params.endTime);
    return await query.count();
}

async function queryItems(params) {
    let query = Model.find();
    query.sort({ time: -1 })
    query.byTime(params.startTime, params.endTime);
    if (params.page && params.pageSize){
        query.skip((params.page - 1) * params.pageSize);
    }
    let items = await query.exec();
    let total = await count(params)
    return {
        items: items,
        total: total
    };
}

/**
 *
 * @param params {{time:Number,amount:Number,type:String}}
 * @returns {Object}
 */
async function addItem(params) {
    let data = Object.assign({},params)
    data.updateTime = params.time;
    data.createTime = params.time;
    data.date = moment(data.time).format('yyyy-mm-dd')
    let updateRes = await doUpdate(data)
    if (updateRes){
        return updateRes
    }
    if (params.type === 'in'){
        data.inMoney = params.amount
    }else {
        data.outMoney = params.amount
    }
    let item = new Model(data);
    return await item.save()
}

async function doUpdate(params){
    let items = await Model.find().byDate(params.date).exec()

    if (!isEmpty(items)){
        if (params.type === 'in'){
            params.inMoney = items[0].inMoney + params.amount
        }else {
            params.outMoney = items[0].outMoney + params.amount
        }
        params.updateTime = params.time;
        return await Model.findByIdAndUpdate(items[0]._id,params)
    }else{
        return false
    }
}

async function modifyItem(params) {
    // return await Model.findByIdAndUpdate(params.id, params)
    return Model.update({date: params.date}, {params}).exec();

}

async function deleteItem(params) {
    return await Model.findByIdAndDelete(params.id)
}

module.exports={
    DailySummary: Model,
    addItem,
    queryItems,
    modifyItem,
    deleteItem
}
