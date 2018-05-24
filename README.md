---
title: nodeJs+vue的一次项目实践
date: 2018-05-14 09:13:08
categories:
    前端
tags:
    node vue
description: 
- 之前对node和vue都有了不系统的学习，于是想通过一次小项目对两种技术加深一点印象,由于自身也处于学习摸索的阶段，因此当然就避免不了一些错误和不优美的地方。不过都无关紧要，最重要的是能不断学习和进步，不是吗。
---
# 项目技术栈
- 后端:`node+express+mysql`
- 前端：`vue+vue-router+vuex+axios`

**PS: 没有选择传统的mongedb 是因为电脑内有MySQL 就懒得装了**
# 准备工作
1. 1.安装node.js `node -v` `npm -v`
2. 2.安装vue-cli脚手架工具 `npm i –g vue-cli`

前期的准备环境搭建过程不做赘述，网上教程很多，只是有很多方便工具，就看个人喜欢去选择了。好了开始。。。

# 前后端分离（node写接口 vue搭建前台）
1. 1.新建一个目录 `node-vue`
2. 2.进入`node-vue`目录分别初始化前后端
- 后端:新建一个目录 `server`,cd到该目录
```
$ npm init
```
一路回车就行，Y生成package.json文件
- 前端：在`node-vue`目录下命令行
```
$ vue init webpack client
```
一路回车Y/N，

至此你的项目目录应该是这样的：
```
-node-vue
    //前端目录
    -client
        -build
        -config
        -node_modules
        -src
            -assets      // 静态资源
            -components  // 组件
            -router      // 前台路由
            App.vue      // 根组件
            main.js
        .babelrc
        index.html       //前端入口文件
        package.json
        //....其他文件
    //后台目录
    -server
        package.json

```
# 后台构建
`-server`目录下新建app.js 代码如下：
```
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
```
**其中：**
```
var login=require('./controllers/loginController');
var admin=require('./controllers/adminController');
```
**分别是登陆的相关业务逻辑和后台人员管理相关逻辑（当然这得设计数据库操作，具体后面会涉及到）**

而后台需要引入的模块则有：`npm i express -D`,`npm i express-session -D`,`npm i mysql -D`,`npm i body-parser -D`（具体看package.json文件）

至此你的后台目录结构应该是这样的：
```
|-server
|---
```

[线上地址：https://github.com/354242767/node-vue](https://github.com/354242767/node-vue)
**未完待续...**