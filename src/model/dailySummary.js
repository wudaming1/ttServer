const { model, Schema } = require('mongoose');
const moment =require('moment')

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
})

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
 * @param params {{createTime:Number,inMoney:Number,outMoney:Number}}
 * @returns {Promise<any>}
 */
async function addItem(params) {
    let data = Object.assign({},params)
    data.updateTime = params.createTime;
    data.date = moment(data.createTime).format('yyyy-mm-dd')
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
    let item = await Model.find().byDate(params.date).exec()
    if (item){
        if (params.type === 'in'){
            item.inMoney += params.amount
        }else {
            item.outMoney += params.amount
        }
        item.updateTime = params.time;
        item.createTime = params.time;
        return await Model.findByIdAndUpdate(item._id,item)
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
    