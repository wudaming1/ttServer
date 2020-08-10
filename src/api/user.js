
const User =require('../model/user').User;
const {router} =require('./index');

router.post('/user/login', async (ctx) => {
    let userInfo = ctx.request.body;
    let item = await User.findOne({name: userInfo.name}, 'name password').exec();
    if(!item){
        throw new Error('没有这个用户');
    }else if(userInfo.password === item.password){
        ctx.body.data = item.toJSON();
    }else{
        throw new Error('密码错误');
    }
});

router.post('/user/create', async (ctx) => {
    let user = new User(ctx.request.body);
    await user.save();
    ctx.body.data = '保存成功！';
});

router.post('/user/modifyPassword',async (ctx) => {
    let params = ctx.request.body;
    ctx.body.data = await User.where({ _id: params.id }).update({ password: params.password }).exec()
});

router.get('/user/info',async (ctx) => {
    let _id = ctx.headers['x-token'];
    ctx.body.data = await User.findById(_id).exec();
});


