'use strict';
var DataQuotaList = angular.module('DataQuotaList', ['ui.router']);

/** Main Controller */
DataQuotaList.controller('DataQuotaList.Controller.Main', ['$scope', '$state', 'DataQuotaList.Service.Http', '$stateParams',
  function($scope, $state, Http, StateParams) {
    /** Handle Data Quota Table */
    // Paging
    var httpParams = {};
    $scope.currentPage = 1;
    if(StateParams.dep_name===''){
      // Init Data Quota Table
      httpParams = {limit:20, skip: 1} ;
    }
    else{
      // Fetch Data Quota By Department ID
      httpParams = _.assign(StateParams, {limit:20, skip: 1});
    }
    Http.getDataQuota(httpParams).then(function(result) {
      $scope.DataQuotas = result.data.body[0].results;
      $scope.DataQuotasTotal = result.data.body[0].count;
      $scope.totalItems = result.data.body[0].count;
    });
    $scope.pageChanged = function() {
      var paginParams = _.assign(httpParams, {limit:20, skip: ($scope.currentPage-1) * 20});
      Http.getDataQuota(httpParams).then(function(result) {
        $scope.DataQuotas = result.data.body[0].results;
        $scope.DataQuotasTotal = result.data.body[0].count;
        $scope.totalItems = result.data.body[0].count;
      });
    };
    /** #Handle Data Quota Table */

    /** Search for Data Quota Name */
    $scope.Retrieval = function(){
      var httpParam = _.assign(Params, {quotaname: $scope.TargetDataQuotaName});
      Http.getDataQuota(httpParam).then(function(result) {
        $scope.DataQuotas = result.data.body;
        $scope.DataQuotasTotal = result.data.head.total;
      });
    }
    /** #Search for Data Quota Name */

    /** Data quota apply info */
    $scope.DataQuotaApplyInfo = function(data_quota_id){
      var httpParam = {data_quota_id: data_quota_id};
      Http.getDataQuotaApplyInfo(httpParam).then(function() {
        alert('申请查看成功');
        if(StateParams.dep_name===''){
          httpParams = {limit:20, skip: 1} ;
        }
        else{
          httpParams = _.assign(StateParams, {limit:20, skip: 1});
        }
        Http.getDataQuota(httpParams).then(function(result) {
          $scope.DataQuotas = result.data.body[0].results;
          $scope.DataQuotasTotal = result.data.body[0].count;
          $scope.totalItems = result.data.body[0].count;
        });
      });
    }
    /** #Data quota apply info */

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
    function getDataQuota(params){
      return $http.get(
        path + '/data_quota/sys_dict', { params: params }
      )
    };
    function getDataQuotaApplyInfo(params){
      return $http.put(
        path + '/data_quota_apply_info', { params: params }
      )
    };
    return {
      getSystemDictByCatagory: getSystemDictByCatagory,
      getDataQuotaApplyInfo: getDataQuotaApplyInfo,
      getDataQuota: getDataQuota
    }
  }
]);
