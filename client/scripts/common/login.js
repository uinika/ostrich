'use strict';
var Login = angular.module('Login', ['ui.router']);

/** Main Controller */
Login.controller('Login.Controller.Main', ['$scope', '$state', 'Login.Service.Http',
  function($scope, $state, Http) {
    $scope.Login = {};

    $scope.Login.submit = function() {
      var username = $scope.Login.username;
      var password = $scope.Login.password;
      Http.login({
        USERNAME: username,
        PASSWORD: password
      }).then(function(result) {
        console.log(result.data);
        if(200 == result.data.head.status){
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
