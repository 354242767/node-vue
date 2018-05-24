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