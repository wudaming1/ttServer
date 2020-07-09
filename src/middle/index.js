const server = require('server');
const { header } = server.reply;  // OR server.reply;
const moment = require('moment');

const parserUserId = ctx => { 
    if(ctx.url === '/user/login'){
      console.log('login')
    }else{
      ctx.userId = ctx.headers.token
      ctx.shop = ctx.headers.shop
    }
    
 };

const cors = [
  ctx => header("Access-Control-Allow-Origin", "*"),
  ctx => header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept"),
  ctx => header("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE, HEAD"),
  ctx => ctx.method.toLowerCase() === 'options' ? 200 : false
];

const logger = ctx => {
  let params = {
    time: moment().format("YYYY-MM-DD HH:mm:ss"),
    data: ctx.data
  }
  console.log(params)
}

exports.middles = [logger, parserUserId,cors]

