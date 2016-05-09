'use strict';
const Express = require('express'),
      App = Express(),
      Config = require('./config'),
      bodyParser = require('body-parser');

App.use(bodyParser.json());
/** CORS Filter */
// Setting static resource for express
// const path = require('path');
// var client = path.resolve(__dirname + '/../client');
// app.use(express.static(client));
App.all('*', function(req, res, next) {
  // 指定一个允许向该服务器提交请求的URI.
  res.header('Access-Control-Allow-Origin', Config.cors);
  // 指定服务器可以接收的HTTP请求方式，该响应头信息在客户端发出Option预检请求时会被返回
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  // 设置浏览器可以读取服务器响应回来的Credential信息
  res.header('Access-Control-Allow-Credentials', true);
  // 允许Option预请求缓存的秒数,在此期间,浏览器不需要再次发出预检请求
  res.header('Access-Control-Allow-Age', 1728000);
  // 设置允许浏览器可以访问到的服务器响应头信息
  // res.header('Access-Control-Expose-Header', '*');
  // 在响应Option预检请求时使用.指明在接下来的真实请求中,可以使用到哪些自定义HTTP请求头
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') res.sendStatus(200);
  else next();
});
App.listen(5001);
console.info('http-server[express] listening on 5001');

/** Login */
var login = require('./api/common/login');
App.use('/api', login);

var department = require('./api/common/department');
App.use('/api', department);


/** sys_dict */
var sys_dict = require('./api/common/sys_dict');
App.use('/api', sys_dict);


/** department */
var data_quota = require('./api/department/data_quota');
App.use('/api', data_quota);

var data_quota_detail = require('./api/department/data_quota_detail');
App.use('/api', data_quota_detail);

var sharedata_quotalist = require('./api/department/sharedata_quotalist');
App.use('/api', sharedata_quotalist);

var data_requiement = require('./api/department/data_requiement');
App.use('/api', data_requiement);

var data_requiement_response = require('./api/department/data_requiement_response');
App.use('/api', data_requiement_response);

/** Data Quota */
var data_quota_main = require('./api/data-quota/main');
App.use('/api', data_quota_main);

var opendata_quotalist = require('./api/department/opendata_quotalist');
App.use('/api', opendata_quotalist);

var opendata_quotamesg = require('./api/department/opendata_quotamesg');
App.use('/api', opendata_quotamesg);

var opendata_quotaok = require('./api/department/opendata_quotaok');
App.use('/api', opendata_quotaok);

var upload_examples = require('./api/department/upload');
App.use('/api', upload_examples);

var examples_detail = require('./api/department/examples_detail');
App.use('/api', examples_detail);


/** darshboard */
var dashboard = require('./api/common/dashboard');
App.use('/api', dashboard);

/**admin*/
var user = require('./api/admin/user');
App.use('/api', user);
