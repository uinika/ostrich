'use strict';
var Admin = angular.module('Admin', ['ui.router','ngCookies']);

/** DepartmentReq Controller */
Admin.controller('Admin.Controller.Main', ['$cookies', '$scope', '$stateParams',
  function($cookies, $scope, $stateParams) {
       var User = JSON.parse($cookies.get('User'));
       if(User.id === "e147f177-1e83-11e6-ac02-507b9d1b58bb"){
         $scope.titleName ="用户/部门管理";
       }else{
         $scope.titleName = "用户管理";
       }
  }
])
