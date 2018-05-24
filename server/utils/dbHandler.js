var mysql  = require('mysql');  
 
var connection = mysql.createConnection({     
  host     : 'localhost',       
  user     : 'root',              
  password : '123456',       
  port: '3306',                   
  database: 'test', 
}); 

connection.connect();

//mysql操作数据库
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