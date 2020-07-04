
const { status, json, send } = require('server/reply');
const User =require('../model/user').User

const server = require('server');
const { get, post, put, del } = server.router;

let login = async (ctx) => {
    let userInfo = ctx.data;
    console.log(userInfo);
    let item = await User.findOne({name: userInfo.name}, 'name password').exec();
    let result = {
        code:1000,
        message: '',
        data:''
    }
    console.log(item);
    if(!item){
        result.message = '没有这个用户';
        result.code = 2000;
    }else if(userInfo.password === item.password){
        result.data = item.toJSON();
    }else{
        result.message = '密码错误！';
        result.code = 2000;
    }
    return result;
  };

let getInfo =async (ctx) => {
    let _id = ctx.headers['x-token'];
    console.log("id:"+_id);
    let result = {
        code:1000,
        message: '',
        data:''
    }
    result.data = await User.findById(_id).exec();
    return result;
};

let create = async (ctx) => {
    let user = new User(ctx.data);
    return status(201).json(await user.save());; 
}

let modifyPassword = async (ctx) => {
    let id = ctx.data.id;
    let newpassword = ctx.data.password;
    return await User.where({ _id: id }).update({ password: newpassword }).exec()
}


  exports.api = [
    post('/user/login', login),
    post('/user/create', create),
    post('/user/modifyPassword', modifyPassword),
    get('/user/info', getInfo)
]


