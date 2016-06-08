'use strict';
var Login = angular.module('Login', ['ui.router', 'ngCookies']);

/** Main Controller */
Login.controller('Login.Controller.Main', ['$rootScope', '$cookies', '$scope', '$state', 'Login.Service.Http',
  function($rootScope, $cookies, $scope, $state, Http) {
    // Decide login or session delay
    if(sessionStorage.token){
      sessionStorage.removeItem('token');
    }
    if(sessionStorage.message){
      $scope.alerts = [
        {type: 'danger', msg: sessionStorage.message}
      ];
      $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
      };
      sessionStorage.removeItem('message');
    }
    // Login validation
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
          console.log(JSON.stringify(loginUser));
          var sessionToken = result.data.head.token;
          if(sessionToken){
            sessionStorage.token = sessionToken;
          }
          if (200 == result.data.head.status) {
            $state.go("main.dashboard");
          } else {
            $scope.loginError = true;
          }
        });
      } else {
        $scope.loginSubmitted = true;
      }
    }
  }
]);

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
