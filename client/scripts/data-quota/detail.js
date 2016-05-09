'use strict';
var DataQuotaDetail = angular.module('DataQuotaDetail', ['ui.router']);

/** Main Controller */
DataQuotaDetail.controller('DataQuotaDetail.Controller.Main', ['$scope', '$state', 'DataQuotaDetail.Service.Http', '$stateParams',
  function($scope, $state, Http, $stateParams) {
    console.log($stateParams);
    Http.getDataQuotaDetailByDepID(
      $stateParams
    ).then(function(result) {
      console.log(result.data.body[0]);
      $scope.DataQuotaDetail = result.data.body[0];
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
    return {
      getDataQuotaDetailByDepID: getDataQuotaDetailByDepID
    }
  }
]);
