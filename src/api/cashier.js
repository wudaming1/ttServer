const Deal = require('../model/deal.js').model;
const {router} = require('./index');


router.post('/cash/add', async (ctx) => {
    let deal = new Deal(ctx.request.body);
    deal.time = new Date().getTime();
    ctx.body.data = await deal.save();
});

/**
 *
 * @param  ctx
 * 数据格式:
 * {
 *  userId: xxx,
 *  startTime: xxx,时间戳
 *  endTime: xxx,时间戳
 *  shop: xxx,
 *  pageSize: 4,
 *  page: 1,
 * }
 */
router.post('/cash/query', async (ctx) => {
    let params = ctx.request.body;
    let query = Deal.find();
    let countQuery = Deal.find();
    query.sort({ time: -1 });
    if (params.userId) {
        query = query.where('userId').equals(params.userId);
        countQuery = countQuery.where('userId').equals(params.userId);
    }
    if (params.startTime) {
        query = query.where('time').gt(params.startTime);
        countQuery = countQuery.where('time').gt(params.startTime);
    }

    if (params.endTime) {
        query = query.where('time').lt(params.endTime);
        countQuery = countQuery.where('time').lt(params.endTime);
    }

    if (params.shop) {
        query = query.where('shop').equals(params.shop);
        countQuery = countQuery.where('shop').equals(params.shop);
    }
    let limit = 5;
    let page = 1;
    if (params.pageSize !== null) {
        limit = params.pageSize;
    }
    if (params.page !== null) {
        page = params.page
    }
    query = query.limit(limit);

    let count = await countQuery.count();
    query.skip(2);
    query.skip(limit * (page - 1));
    let deals = await query.exec();

    ctx.body.data = {
        total: count,
        items: deals
    }
});

router.post('/cash/queryTotal', async (ctx) => {
    let params = ctx.request.body;
    let query = Deal.find();
    if (params.startTime) {
        query = query.where('time').gt(params.startTime);
    }

    if (params.endTime) {
        query = query.where('time').lt(params.endTime);
    }

    if (params.shop) {
        query = query.where('shop').equals(params.shop);
    }

    let deals = await query.exec();

    let total = 0;
    let wx = 0;
    let xj = 0;
    let zfb = 0;
    for (let elem of deals.values()) {
        total += elem.count;
        if (elem.type === 'wx') {
            wx += elem.count;
        } else if (elem.type === 'zfb') {
            zfb += elem.count;
        } else if (elem.type === 'xj') {
            xj += elem.count;
        }
    }

    ctx.body.data = {
        total: total,
        wx: wx,
        zfb: zfb,
        xj: xj,
    }
});

router.post('/cash/delete', async (ctx) => {
    let id = ctx.request.body['_id'];

    let deleteRes = await Deal.findByIdAndRemove(id).exec();
    if (deleteRes === null) {
        throw new Error('不存在这条记录！');
    }
    ctx.body.data = deleteRes;
});

router.post('/cash/modify', async (ctx) => {
    const params = ctx.request.body;
    let id = params['id'];
    let money = params['money'];
    let type = params['type'];
    let updateRes = await Deal.findByIdAndUpdate(id, { count: money, type: type });
    if (updateRes === null) {
        throw new Error('不存在这条记录！')
    }
    ctx.body.data = updateRes;
});

router.post('/cash/report', async (ctx) => {
    let params = ctx.request.body;
    const shop = ctx.headers.shop;

    const date = new Date(params.startTime);
    ctx.body.data = queryCashInDay(date, shop);

});



/**
 *
 * @param {Date} time
 * @param shop 门店code
 */
async function queryCashInDay(time, shop) {
    let date = new Date(time);
    date.setHours(0, 0, 0, 0);
    let startTime = date.getTime();
    date.setHours(23, 59, 59, 0);
    let endTime = date.getTime();
    let query = Deal.find();
    query.where('time').gt(startTime);
    query.where('time').lt(endTime);
    query.where('shop').equals(shop);
    let deals = await query.exec();
    let result = {
        total: 0,
        wx: 0,
        xj: 0,
        zfb: 0,
    };

    let total = 0;
    for (let elem of deals.values()) {
        total += elem.count;
        if (elem.type === 'wx') {
            result.wx += elem.count;
        } else if (elem.type === 'zfb') {
            result.zfb += elem.count;
        } else if (elem.type === 'xj') {
            result.xj += elem.count;
        }
    }

    return result;
}
