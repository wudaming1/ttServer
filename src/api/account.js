const moment = require('moment');
const {router} = require('./index');

const {addItem, queryItems, modifyItem, deleteItem} =require('../model/account');
let addDaily = require('../model/dailySummary').addItem;

/**
 * 添加记录
 * @param ctx
 * @returns {Promise<void>}
 */
router.post('/account/add', async (ctx) => {
    let params = ctx.request.body;
    params.shop = ctx.headers['shop'];
    params.time = moment(new Date()).valueOf();
    let date = moment(new Date()).format('yyyy-mm-dd');
    await addDaily(Object.assign({date},params));
    ctx.body.data = await addItem(params);
});



/**
 * 查询记录，支持分页
 * @param ctx
 * @returns {Promise<void>}
 */
router.post('/account/query', async (ctx) => {
    let params = ctx.request.body;
    params.shop = ctx.headers['shop'];
    ctx.body.data = await queryItems(params);
});


/**
 * 修改记录，仅修改金额
 * @param ctx
 * @returns {Promise<void>}
 */
router.post('/account/modify', async (ctx) => {
    let data = await modifyItem(ctx.request.body);
    if (!!data){
        ctx.body.data =data;
    }else{
        throw new Error('没有这条记录!');
    }
});

/**
 * 删除记录
 * @param ctx
 * @returns {Promise<void>}
 */
router.post('/account/delete', async (ctx) => {
    let data = await deleteItem(ctx.request.body);
    if(!!data){
        ctx.body.data = data
    }else{
        throw new Error('没有这条记录!');
    }
});
