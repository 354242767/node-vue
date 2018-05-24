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
|---server
|  |---controllers              //业务逻辑路由控制器
|  |  |---loginController.js    //登录相关
|  |  |---adminController.js    //后台人员管理相关
|  |---node_modules
|  |---utils                    //工具类
|  |  |---dbHandler.js          //数据库操作
|  |---app.js                   //入口文件
|  |---package.json             //配置文件 
```
好了，那我们现在来实现最简单的登录功能`loginController.js`的实现，代码如下：
```
var bodyParser = require('body-parser');

// 创建 application/x-www-form-urlencoded 解析
var urlencodedParser = bodyParser.urlencoded({ extended: false });

// 创建 application/json 解析
var jsonParser = bodyParser.json();

var dbHandler=require('../utils/dbHandler');


module.exports = function(app) {

    app.post('/users/login', jsonParser,function(req, res) {
       
        var  sql = 'SELECT * FROM users WHERE username=?';
        var sqlParams=[req.body.username];
        
        dbHandler(sql,sqlParams,function(data){
            if(data.length==0){
                res.json({err:"抱歉，系统中并无该用户，如有需要，请向管理员申请",success:false});
            }else if(data[0].password !== req.body.password){
                res.json({err:"密码不正确",success:false});
            }else{
                req.session.username = req.body.username; //存session
                req.session.password = req.body.password;
                res.json({username:data[0].username,success:true});
            }
           
        });   
      
      
    });
    
    
  }

```
其中mysql数据库的代码如下：
```
var mysql  = require('mysql');  
 
var connection = mysql.createConnection({     
  host     : 'localhost',       
  user     : 'root',              
  password : '123456',       
  port: '3306',                   
  database: 'test', 
}); 

connection.connect();

//mysql操作数据库 统一接口
var find=function(sql,sqlParams,fn){
    connection.query(sql,sqlParams,function (err, result) {
        if(err){
          console.log('[SELECT ERROR] - ',err.message);
        }
        //返回结果给回调函数处理
        fn(result);
        
    });
    // connection.end();
}

module.exports = function(sql,sqlParams,fn){
    find(sql,sqlParams,fn);
}
```
**ps:前提你得本地安装了mysql数据库 并且按如上配置数据库参数（数据库名、表的创建`users`、账号密码、端口号之类）**

至此你的后台登录接口以及数据库接口都已写好，接下来就是前端构建了

# 前端构建
首先回顾之前前端羡慕结构，vue-cli脚手架创建完成后的目录如下：
```


|---client
|   |---build
|   |---config
|   |---node_modules
|   |---src
|   |   |---assets      // 静态资源
|   |   |---components  // 组件
|   |   |---router      // 前台路由
|   |---App.vue         // 根组件
|   |---main.js
|   |---.babelrc
|   |---index.html      //前端入口文件
|   |---package.json    //配置文件
|   |---//....其他文件

```
修改main.js如下：
```
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

Vue.config.productionTip = false

import axios from 'axios';//引入axios组件
axios.defaults.withCredentials=true;  //跨域保存session有用
axios.defaults.baseURL = "http://localhost:3000"; //打包的时候直接删掉，默认基础路径在这里配置
//将 axios 赋值给 Vue，方便在子组件里面使用
Vue.prototype.$reqs = axios;

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  if(response.data.err){
      alert(response.data.err);
      return Promise.reject(response);
  }else if(response.data.redirect){
      alert("请先登录..");
      window.location.href = "/login"; //跳转到登录页
      return Promise.reject(response);
  }else{
      //返回response继续执行后面的操作
      return response;
  }
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error);
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})


```
其中`axios`模块是对http的封装，处理相关请求和响应，当然上面的拦截器功能也要借助它实现，`vuex`是状态管理，处理较为敏感的数据，这二者暂时用不到，我们先抛开不谈，之后涉及到再说，那其实目前`main.js`并无多大变化，我们现在主要是关注前端路由的映射关系以及页面实现。

切换到router路由设置（熟悉vue的都很快就能理解，就不做赘述了，当然如果你还不太了解vue可参考官方文档，也能很快上手。）

找到router下的index.js文件：代码如下：
```
import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login'
import Layout from '@/components/layout'
import IndexPage from '@/components/index'
import Admin from '@/components/admin'
import Students from '@/components/students'
import Course from '@/components/course'


Vue.use(Router)

export default new Router({
  mode:'history',
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/layout',
      name: 'layout',
      component: Layout,
      children:[
        {
          path: 'index',
          name: 'index',
          meta: {
            requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
          },
          component: IndexPage
        },
        {
          path: 'admin',
          name: 'admin',
          component: Admin
        },
        {
          path: 'students',
          name: 'students',
          component: Students
        },
        {
          path: 'course',
          name: 'course',
          component: Course
        },{
          path: '*',           //其他路径都跳转到首页
          redirect: 'index'
       }
      ]
    },
    {
      path: '*',           //其他路径都跳转到登录
      redirect: 'login'
   }
  ]
})

```
除了登录的路由其他的路由是为之后功能扩展预留的，可先不关注。

路由设置完毕，可使用命令 npm run dev 启动前台服务器 ，端口默认为8080 输入localhost：8080/login 即可访问登录页面，当然现在登录组件还没完成。那我们就按照`import Login from '@/components/login'`完善登录组件。components目录创建login.vue单文件组件如下：

``` html
<template>
  <div class="backlogin">
        <div class="login_box">
            <div class="title">后台登录</div>
            <div>
                <input class="myinput" type="text" placeholder="手机号/用户名" v-model="username" />
            </div>
            <div>
                <input @keyup.13="login" class="myinput" type="password" placeholder="口令" v-model="password" />
            </div>
            <div class="login_other">
                <a href="javascript:;">找回密码</a>
                <input type="checkbox" id="remenberme" /><label for="remenberme">记住我</label>
            </div>
            <button :disabled="disablebtn" class="login" @click="login">{{loginText}}</button>
        </div>
        
  </div>
</template>

<script>
    
    export default {
      name: 'backlogin',
      data () {
        return {
                username:"tiger",/*TODO:先预存测试值，以免手动输入*/
                password:"123456",
                disablebtn:false,
                loginText:"登录"
        }
      },
      methods:{
            login(){
                this.disablebtn = true;
                this.loginText = "登录中...";
                 //this.$reqs就访问到了main.js中绑定的axios
                this.$reqs.post("/users/login",{
                        username:this.username,
                        password:this.password
                }).then( (result) =>{ 
                    //成功
                    // console.log(result);
                   
                    this.disablebtn = false;
                    this.loginText = "登录";
                   
                    if(result.data.success){
                         // this.$store.state.username=result.data[0].username;
                        this.$store.dispatch('login',result.data.username);
                        // console.log( this.$store.state.username);
                        this.$router.push({path:'/layout/index'});
                    }else{
                        alert(result.data.err)
                    }
                    
                }).catch( (error) =>{
                    //失败
                    console.log(error);
                    this.disablebtn = false;
                    this.loginText = "登录"
                });
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .header{
        height: 60px;
        box-shadow: 0 1px 5px rgba(13,62,73,0.2) ;
    }
    .header img{
        width: 170px;
        margin-top: 12px;
        margin-left: 15px;
        float: left;
    }
    .header span{
        float: left;
        color: #566a80;
        margin: 21px 0 0 20px;
    }
    .login_box{
        width: 320px;
        margin: 50px auto;
    }
    .login_box .myinput{
        width: 100%;
        border: 1px solid #cad3de;
        height: 40px;
        line-height: 40px;
        margin: 5px 0 10px;
        border-radius: 3px;
        padding: 0 10px;
        outline: none;
        box-sizing: border-box;
    }
    .login_box .myinput:focus{
        border: 1px solid #4289dc;
    }
    .login_other{
        overflow: hidden;
    }
    
    .login_other a{
        float: right;
        color: #727f8f;
    }
    .login_other a:hover{
        color: #273444;
    }
    .login_other input, .login_other label{
        float: left;
        color: #727f8f;
    }
    .login_other input{
        margin: 4px 5px 0 0;
    }
    .login{
        box-sizing: border-box;
        border: none 0;
        height: 44px;
        line-height: 44px;
        width: 100%;
        background:#4187db;
        font-size: 16px;
        border-radius: 3px;
        margin-right: 40px;
        transition: all 0.5s ease;
        cursor: pointer;
        outline: none;
        color: #fff;
        margin-top: 15px;
    }
    .login:hover{
        background: #2668b5;
    }
    .login[disabled]{
        opacity: 0.8;
    }
    .login[disabled]:hover{
        background:#4187db;
    }
    .title{
        color: #273444;
        font-size: 1.5em;
        text-align: center;
        margin: 0 0 20px 0;
    }
    
    @media only screen and (max-width: 768px) {
        .login_box{
            width: 280px;
            margin: 50px auto;
        }
    }
</style>

```

此时在启动前台服务器后几等访问到登录页面了，接下来会涉及到跨域访问服务器（main.js和app.js已设置好了见上），就要打开后台服务器：命令行node app即可。至此前后端就能完成通信了。接下来就是具体业务逻辑实现了。

相信到这里，对vue和node有一定了解的都可以自己实现接下来其他的业务了，之后主要会构建登录（session判断是否登录，拦截请求，响应给前端，前端重定向到登录页，以及vuex的操作）以及登录后的index页面展示（包括登出操作等），和admin页面（后台的CURD操作及前台的分页及排序等等）这里就不做过多介绍，主要是将前后端串联起来，之后的逻辑反而没有那么困难。想要后续代码的可去在线github。

[代码地址：https://github.com/354242767/node-vue](https://github.com/354242767/node-vue)

**未完待续...**