const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI).then(mongoose =>{
    console.log('数据库连接建立成功！');
  }).catch(err =>{
    console.log('数据库连接建立失败！');
  });