var express=require('express');
var app=express();
var login=require('./controllers/loginController');
var admin=require('./controllers/adminController');

//跨域  后期删
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:8080"); //为了跨域保持session，所以指定地址，不能用*
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Credentials', true); 
    next();
});

//session
var session=require('express-session');
app.use(session({
    secret:'node-vue',               //设置 session 签名
    name:'node-vue',
    cookie:{maxAge:60*1000*60*24}, // 储存的时间 24小时
    resave:false,             // 每次请求都重新设置session
    saveUninitialized:true
}));

// session验证用户登录
app.use(function(req, res, next){
    //后台请求
    if(req.session.username){ //表示已经登录后台
        // console.log(req.session.username);
        next();
    }else if( req.url.indexOf("login") >=0 || req.url.indexOf("logout") >= 0){
        //登入，登出不需要登录
        next();
    }else{
        //next(); //TODO:这里是调试的时候打开的，以后需要删掉
        //没登陆响应重定向信息 前端监听响应头 有重定向信息时跳转到登陆页
        res.end('{"redirect":"true"}');
    
    };
    
});

login(app);
admin(app);

app.listen(3000);

console.log('you are listening port 3000');