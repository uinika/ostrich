'use strict';
var Login = angular.module('Login', ['ui.router']);

/** Main Controller */
Login.controller('Login.Controller.Main', ['$scope', 'Login.Service.Http',
  function($scope, Http) {
    Http.test().then(function(result) {
      console.log(result);
    })
  }
])

/** HTTP Service */
Login.factory('Login.Service.Http', ['$http', 'API',
  function($http, API) {
    var path = API.path;
    function test() {
      return $http.get(
        path + '/123'
      )
    };
    return {
      test: test
    }
  }
]);
