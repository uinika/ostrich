'use strict';
var RequirementDetail = angular.module('RequirementDetail', ['ui.router']);

/** InventoryDetail Controller */
RequirementDetail.controller('RequirementDetail.Controller.Main', ['$rootScope', '$scope', '$stateParams', 'RequirementDetail.Service.Http',
  function($rootScope, $scope, $stateParams, Http) {
    var httpParams = {ID: $stateParams.requirementID};
    console.log(httpParams);
    // Http.getInventoryDetail(httpParams).then(function(result) {
    //   if(200 == result.data.head.status){
    //     $scope.InventoryDetail.detail = result.data.body[0];
    //   }
    // });

  }
])

/* HTTP Factory */
RequirementDetail.factory('RequirementDetail.Service.Http', ['$http', 'API',
  function($http, API) {
    var path = API.path;
    function getInventoryDetail(params) {
      return $http.get(
        path + '/inventory/getInventoryDetail', {params: params}
      )
    };
    return {
      getInventoryDetail: getInventoryDetail
    }
  }
]);
