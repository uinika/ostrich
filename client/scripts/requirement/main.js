'use strict';
var RequirementMain = angular.module('RequirementMain', ['ui.router']);

/** InventoryMain Controller */
RequirementMain.controller('RequirementMain.Controller.Main', ['$scope', '$stateParams', 'RequirementMain.Service.Http',
  function($scope, $stateParams, Http) {
    // Http.getInventoryMain(httpParams).then(function(result) {
    //   if(200 == result.data.head.status){
    //     $scope.InventoryMain.detail = result.data.body[0];
    //   }
    // });

  }
])

/* HTTP Factory */
RequirementMain.factory('RequirementMain.Service.Http', ['$http', 'API',
  function($http, API) {
    var path = API.path;
    function getInventoryMain(params) {
      return $http.get(
        path + '/inventory/getInventoryMain', {params: params}
      )
    };
    return {
      getInventoryMain: getInventoryMain
    }
  }
]);
