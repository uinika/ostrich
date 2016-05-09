'use strict';
/* Application Configration */
var Config = angular.module('Config', []);

Config.constant('API', {
  // path: 'http://192.168.13.224:8080/drrp/api' //测试组
  // path:'http://localhost:5001/api' //本机测试
  // path: 'http://172.16.1.81:8080/api' //周爽
  // path: 'http://172.16.1.77:8080/api' //吴陶冶
  path: 'http://172.16.1.78:8080/api' //米兵
});
