'use strict';
var Admin = angular.module('Admin', ['ui.router','ngCookies']);

/** DepartmentReq Controller */
Admin.controller('Admin.Controller.Main', ['$cookies', '$scope', '$stateParams',
  function($cookies, $scope, $stateParams) {
       var LoginUser = JSON.parse($cookies.get('User'));
       $scope.depName = LoginUser.dep_name;
       if($scope.depName == null){
         $scope.titleName ="用户/部门管理";
       }else{
         $scope.titleName = "用户管理";
       }
  }
])
