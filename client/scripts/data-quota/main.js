'use strict';
var DataQuota = angular.module('DataQuota', ['ui.router']);

/** Main Controller */
DataQuota.controller('DataQuota.Controller.Main', ['$scope', '$state', 'DataQuota.Service.Http',
  function($scope, $state, Http) {

    $scope.toggle = function(scope) {
      scope.toggle();
    };

    // Generated Menu
    Http.menu().then(function(result){
      if(200===result.data.head.status){
        $scope.list = result.data.body;
      }
    })


  }
]);

/* DataQuota Http Factory */
DataQuota.factory('DataQuota.Service.Http', ['$http', 'API',
  function($http, API) {
    var path = API.path;
    function menu(params) {
      return $http.get(
        path + '/menu', { params: params }
      )
    };
    return {
      menu: menu
    }
  }
]);
