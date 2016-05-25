'use strict';
/* Application Configration */
var Config = angular.module('Config', []);

Config.constant('API', {
  // path: 'http://localhost:8080/drrp/api' //发布
  // path: 'http://localhost:5001/api' //本机测试
  // path: 'http://172.16.1.81:8080/api' //周爽
  // path: 'http://172.16.1.77:8080/api' //吴陶冶
  path: 'http://172.16.1.78:8080/api' //米兵
  // path: 'http://localhost:8080/api' //VPN测试服务器
});
