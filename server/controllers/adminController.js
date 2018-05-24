var bodyParser = require('body-parser');

// 创建 application/x-www-form-urlencoded 解析
var urlencodedParser = bodyParser.urlencoded({ extended: false });

// 创建 application/json 解析
var jsonParser = bodyParser.json();

var dbHandler=require('../utils/dbHandler');


module.exports = function(app) {
    
    //获取用户信息
    app.post('/admin/getAdmin', jsonParser,function(req, res) {
        var  sql='';
        var number;
        var sqlParams=[];
        if(req.body.userId){
            number=1;
            sql = 'SELECT id,username,phone FROM users WHERE id=?';
            sqlParams=[req.body.userId]
        }else {
            var sqlNumber='select count(*) from users';
           
            dbHandler(sqlNumber,sqlParams,function(data){
               number=data[0]['count(*)'];
            });

            sql = 'SELECT id,username,phone FROM users limit ?,?';
            sqlParams=[(req.body.page-1)*req.body.amount,req.body.amount];
        }

        dbHandler(sql,sqlParams,function(data){
            if(!data){
                res.json([]);
            }else{
                if(data.length==0){
                    res.json([]);
                }else{
                    res.json([data,number]);   
                }
            }  
        });
        
         
    });


    app.post('/admin/addAdmin', jsonParser,function(req, res) {
        var sql='INSERT INTO users(Id,username,password,phone) VALUES(0,?,?,?)';
        var sqlParams=[req.body.username,req.body.password,req.body.phone]
        dbHandler(sql,sqlParams,function(data){
            if(!data){
                res.json({message:'添加失败！',action:'add',success:false});
            }else{
                if(data.length==0){
                    res.json({message:'添加失败！',action:'add',success:false});
                }else{
                    res.json({message:'添加成功！',action:'add',success:true});   
                }
            }  
        });
    });
  } 