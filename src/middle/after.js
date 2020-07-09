
const server = require('server');

const { error } = server.router;
const { status } = server.reply;

const folderMiddle = ctx => {
    console.log(ctx.res())
}
const test = error(ctx => status(500).send(ctx.error.message))

exports.middles = [test]