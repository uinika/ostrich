'use strict';
var Login = angular.module('Login', ['ui.router', 'ngCookies']);

/** Main Controller */
Login.controller('Login.Controller.Main', ['$rootScope', '$cookies', '$scope', '$state', 'Login.Service.Http',
  function($rootScope, $cookies, $scope, $state, Http) {
    $scope.Login = {};

    $scope.Login.submit = function(valid) {
      $scope.loginSubmitted = false;
      if (valid) {
        var username = $scope.Login.username;
        var password = $scope.Login.password;
        Http.login({
          username: username,
          password: password
        }).then(function(result) {
          var loginUser = result.data.body[0];
          $rootScope.User = loginUser;
          $cookies.put('User', JSON.stringify(loginUser));
          if (200 == result.data.head.status) {
            $state.go("main.dashboard");
          } else {
            //$state.go("login");
            $scope.loginError = true;
          }
        });
      } else {
        $scope.loginSubmitted = true;
      }

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
