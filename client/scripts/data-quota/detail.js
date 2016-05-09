'use strict';
var DataQuotaDetail = angular.module('DataQuotaDetail', ['ui.router']);

/** Main Controller */
DataQuotaDetail.controller('DataQuotaDetail.Controller.Main', ['$scope', '$state', 'DataQuotaDetail.Service.Http', '$stateParams',
  function($scope, $state, Http, $stateParams) {
    // Data Quota Detail
    Http.getDataQuotaDetailByDepID(
      $stateParams
    ).then(function(result) {
      $scope.DataQuotaDetail = result.data.body[0];
    });
    // Data Quota Example
    Http.getDataQuotaExampleByDepID(
      {dataquotaid: $stateParams.data_quota_id}
    ).then(function(result) {
      $scope.DataQuotaExample = result.data.body[0];
    });

  }
]);


/* HTTP Factory */
DataQuotaDetail.factory('DataQuotaDetail.Service.Http', ['$http', 'API',
  function($http, API) {
    var path = API.path;
    function getDataQuotaDetailByDepID(params){
      return $http.get(
        path + '/data_quota_detail', { params: params }
      )
    };
    function getDataQuotaExampleByDepID(params){
      return $http.get(
        path + '/examples_detail', { params: params }
      )
    };
    return {
      getDataQuotaDetailByDepID: getDataQuotaDetailByDepID,
      getDataQuotaExampleByDepID: getDataQuotaExampleByDepID
    }
  }
]);
