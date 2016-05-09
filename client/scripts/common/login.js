'use strict';
var Login = angular.module('Login', ['ui.router']);

/** Main Controller */
Login.controller('Login.Controller.Main', ['$rootScope', '$scope', '$state', 'Login.Service.Http',
  function($rootScope, $scope, $state, Http) {
    $scope.Login = {};

    $scope.Login.submit = function() {
      var username = $scope.Login.username;
      var password = $scope.Login.password;
      Http.login({
        username: username,
        password: password
      }).then(function(result) {
        if(200 == result.data.head.status){
          $rootScope.User = result.data.body[0];
          $state.go("main.dashboard");
        }
        else{
          $state.go("login");
        }
      });
    }
  }


])


/* HTTP Factory */
Login.factory('Login.Service.Http', ['$http', 'API',
  function($http, API) {
    var path = API.path;

    function login(params) {
      return $http.get(
        path + '/login', {
          params: params
        }
      )
    };
    return {
      login: login
    }
  }
]);
