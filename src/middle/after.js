
const server = require('server');
const { send, json } = server.reply;

const { error } = server.router;
const { status } = server.reply;

const folderMiddle = ctx => {

    let data = ctx.res.data;
    if (!!data){
        console.log(`return body: `+ JSON.stringify(data));
        return send({
            code : 1000,
            message:'',
            data
        });
    }
    let message = ctx.res.message;
    if (!!message){
        return send({
            code:2000,
            message
        })
    }
    return send("请求成功！")
}
const test = error(ctx => status(500).send(ctx.error.message))

exports.middles = [folderMiddle, test]