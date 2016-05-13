'use strict';
var DataQuotaList = angular.module('DataQuotaList', ['ui.router']);

/** Main Controller */
DataQuotaList.controller('DataQuotaList.Controller.Main', ['$scope', '$state', 'DataQuotaList.Service.Http', '$stateParams',
  function($scope, $state, Http, Params) {
    /** Handle Data Quota Table */
    if(Params.dep_name==='' && typeof Params.dep_name==='string'){
      // Init Data Quota Table
      Http.getDataQuota().then(function(result) {
        $scope.DataQuotas = result.data.body;
        $scope.DataQuotasTotal = result.data.head.total;
      });
    }
    else{
      // Fetch Data Quota By Department ID
      Http.getDataQuotaByDepID(Params).then(function(result) {
        $scope.DataQuotas = result.data.body;
        $scope.DataQuotasTotal = result.data.head.total;
      });
    }
    /** #Handle Data Quota Table */

    /** Search for Data Quota Name */
    $scope.Retrieval = function(){
      var httpParam = _.assign(Params, {quotaname: $scope.TargetDataQuotaName});
      Http.getDataQuotaByDepID(httpParam).then(function(result) {
        $scope.DataQuotas = result.data.body;
        $scope.DataQuotasTotal = result.data.head.total;
      });
    }
    /** #Search for Data Quota Name */

    /** SysDict */
    var SHARE_FREQUENCY = 1,
        DATA_LEVEL = 2,
        SHARE_LEVEL = 3;
    Http.getSystemDictByCatagory({
      'dict_category': SHARE_FREQUENCY
    }).then(function(result) {
      $scope.shareFrequencyList = result.data.body;
    });
    Http.getSystemDictByCatagory({
      'dict_category': SHARE_LEVEL
    }).then(function(result) {
      $scope.shareLevelList = result.data.body;
    });
    Http.getSystemDictByCatagory({
      'dict_category': DATA_LEVEL
    }).then(function(result) {
      $scope.dataLevelList = result.data.body;
    });
    /** #SysDict */

  }
]);


/* HTTP Factory */
DataQuotaList.factory('DataQuotaList.Service.Http', ['$http', 'API',
  function($http, API) {
    var path = API.path;
    function getSystemDictByCatagory(params) {
      return $http.get(
        path + '/sys_dict', { params: params }
      )
    };
    function getDataQuotaByDepID(params){
      return $http.get(
        path + '/data_quota/sys_dict', { params: params }
      )
    }
    function getDataQuota(){
      return $http.get(
        path + '/data_quota/sys_dict'
      )
    }
    return {
      getSystemDictByCatagory: getSystemDictByCatagory,
      getDataQuotaByDepID: getDataQuotaByDepID,
      getDataQuota: getDataQuota
    }
  }
]);
