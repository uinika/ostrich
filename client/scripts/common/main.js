'use strict';
var Main = angular.module('Main', ['ui.router', 'ngCookies']);

/** Main Controller */
Main.controller('Main.Controller.Main', ['$scope', '$cookies',
  function($scope, $cookies) {
    $scope.User = JSON.parse($cookies.get('User'));
  }
]);
