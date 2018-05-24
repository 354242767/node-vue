var bodyParser = require('body-parser');

// 创建 application/x-www-form-urlencoded 解析
var urlencodedParser = bodyParser.urlencoded({ extended: false });

// 创建 application/json 解析
var jsonParser = bodyParser.json();

var dbHandler=require('../utils/dbHandler');


module.exports = function(app) {
    
  
    app.get('/layout/index', jsonParser,function(req, res) {
       
        console.log(req.body.username,req.body.password);

        console.log(req.session.username);
      
    });
    
    
  }