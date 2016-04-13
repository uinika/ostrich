'use strict';
var Login = angular.module('Login', ['ui.router']);

/** Main Controller */
Login.controller('Login.Controller.Main', ['$scope', '$state',
  function($scope, $state) {
    $scope.login = {};
    $scope.login.submit = function() {
      $state.go("main");
    }
  }
])
