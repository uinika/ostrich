'use strict';
var Department = angular.module('Department', ['ui.router']);

/** Main Controller */
Department.controller('Department.Controller.Main', ['$scope', '$q','Department.Service.Http',
  function($scope, $q ,Http) {

  }
])


/* HTTP */
Department.factory('Department.Service.Http', ['$http', '$q', 'API',
  function($http, $q, API) {
    var path = API.path;

    function getInventoryTotal() {
      return $http.get(
        path + '/api/inventoryTotal/'
      )
    };
    return {
      getInventoryTotal: getInventoryTotal
    }
  }
]);
