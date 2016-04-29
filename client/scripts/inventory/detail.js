'use strict';
var InventoryDetail = angular.module('InventoryDetail', ['ui.router']);

/** InventoryDetail Controller */
InventoryDetail.controller('InventoryDetail.Controller.Main', ['$rootScope', '$scope', '$stateParams', 'InventoryDetail.Service.Http',
  function($rootScope, $scope, $stateParams, Http) {
    $scope.InventoryDetail = {};
    var httpParams = {ID: $stateParams.inventoryID};
    var _httpParams = {dataId: $stateParams.inventoryID};
    Http.getInventoryDetail(httpParams).then(function(result) {
      if(200 == result.data.head.status){
        $scope.InventoryDetail.detail = result.data.body[0];
      }
    });
    Http.indicatorList(_httpParams).then(function(result) {
      if(200 == result.data.head.status){
        $scope.InventoryDetail.indicators = result.data.body;
      }
    });
    Http.examplesList(_httpParams).then(function(result) {
      if(200 == result.data.head.status){
        $scope.InventoryDetail.examples = result.data.body;
      }
    });
  }
])


/* InventoryDetail.Controller.detail controller*/
DepartmentShare.controller('InventoryDetail.Controller.detail', ['$rootScope', '$scope',  'InventoryDetail.Service.Http', '$stateParams' ,
  function($rootScope, $scope, Http, $stateParams) {


  }
])



/* HTTP Factory */
InventoryDetail.factory('InventoryDetail.Service.Http', ['$http', 'API',
  function($http, API) {
    var path = API.path;
    function getInventoryDetail(params) {
      return $http.get(
        path + '/inventory/getInventoryDetail', {params: params}
      )
    };
    function indicatorList(params) {
      return $http.get(
        path + '/indicator/indicatorList', {params: params}
      )
    };
    function examplesList(params) {
      return $http.get(
        path + '/examples/examplesList', {params: params}
      )
    };
    return {
      getInventoryDetail: getInventoryDetail,
      indicatorList: indicatorList,
      examplesList: examplesList
    }
  }
]);
