'use strict';
/* Application Configration */
var Config = angular.module('Config', []);

Config.constant('API', {
  // path: 'http://localhost:8080/drrp/api' //发布
  // path: 'http://172.16.1.78:8080/api' //测试
  path: 'http://172.16.1.63:8080/api' //测试
  // path: 'http://localhost:5001/api' //本机
});
