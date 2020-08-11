const dotenv = require('dotenv');
const config = dotenv.config(); // 默认读取当期目录下的.env文件 并添加到process.env上
require('./src/model/db');
const {router} = require('./src/api/router');
const bodyParser = require('koa-bodyparser');

const Koa = require('koa');
const app = new Koa();

app.use(async (ctx, next) => {//错误处理
    try {
        await next();   // 执行后代的代码
    } catch (e) {
        // 如果后面的代码报错 返回500
        ctx.body = {
            code: "500",
            message: e.toString()
        }
    }
});

app.use(async (ctx, next) => {//正常处理
    ctx.body = {};
    await next();   // 执行后代的代码
    if (ctx.body.data === undefined){
        throw new Error(`错误的路径:${ctx.request.originalUrl}`)
    }
    ctx.body.code = 1000;
    if (!ctx.body.message){
        ctx.body.message = '请求成功！';
    }
});

app.use(bodyParser());
app.use(router.routes())
    .use(router.allowedMethods());


app.listen(3000, () => {
    console.log('app listening 3000...')
});

