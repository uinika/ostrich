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

/** Dashboard */
var auth = require('./api/common/dashboard');
App.use('/api', auth);

/** Login */
var login = require('./api/common/login');
App.use('/api', login);

/** Dictionary */
var dict = require('./api/common/dict');
App.use('/api', dict);

/** Inventory */
var inventoryList = require('./api/inventory/inventoryList');
App.use('/api', inventoryList);

/** department */
var dep = require('./api/department/dep');
App.use('/api', dep);

var inventory = require('./api/department/inventory');
App.use('/api', inventory);

var response = require('./api/department/response');
App.use('/api', response);

var inventory_total = require('./api/department/inventoryTotal');
App.use('/api', inventory_total);

var share_total = require('./api/department/shareTotal');
App.use('/api', share_total);

var requirement_total = require('./api/department/requirementTotal');
App.use('/api', requirement_total);

var unaudit_total = require('./api/department/unauditTotal');
App.use('/api', unaudit_total);

var audit = require('./api/department/audit');
App.use('/api', audit);

/** user */
var user = require('./api/department/user');
App.use('/api', user);
