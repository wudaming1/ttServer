
const {addItem, queryItems, modifyItem, deleteItem} =require('../model/dailySummary');
const {router} = require('./index');


/**
 * 添加记录
 * @param ctx
 */
async function add(ctx){
    let params = ctx.request.body;
    params.shop = ctx.headers.shop;
    params.time = new Date().getTime();
    ctx.body.data = await addItem(params);
}
router.post('/account/add', add);


/**
 * 查询记录，支持分页
 * @param ctx
 */
async function queryList(ctx){
    let params = ctx.request.body;
    params.shop = ctx.headers.shop;
    ctx.body.data = await queryItems(params);
}
router.post('/account/query', queryList);


/**
 * 修改记录，仅修改金额
 * @param ctx
 * @returns {Promise<void>}
 */
async function modify(ctx) {
    let data = await modifyItem(ctx.request.body);
    if (!!data){
        ctx.body.data =data;
    }else{
        throw new Error("没有这条记录！");
    }
}
router.post('/account/modify', modify);



async function del(ctx){
    let data = await deleteItem(ctx.request.body);
    if(!!data){
        ctx.res.data = data
    }else{
        throw new Error("没有这条记录！")
    }
}
router.post('/account/delete', del);
