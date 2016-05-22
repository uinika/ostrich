'use strict';
var DataQuotaList = angular.module('DataQuotaList', ['ui.router']);

/** Main Controller */
DataQuotaList.controller('DataQuotaList.Controller.Main', ['$scope', '$state', 'DataQuotaList.Service.Http', '$stateParams',
  function($scope, $state, Http, StateParams) {
    // Params for pagin
    $scope.currentPage = 1;
    // Common
    function getDataQuotaList(_httpParams){
      Http.getDataQuota(_httpParams).then(function(result) {
        $scope.DataQuotas = result.data.body[0].results;
        $scope.DataQuotasTotal = result.data.body[0].count;
        $scope.totalItems = result.data.body[0].count;
      });
    };
    // Init talbe with pagin
    function initDataQuotaList(){
      var httpParams = {};
      (StateParams.dep_name==='') ? (httpParams = {limit:20, skip: 0}) : (httpParams = _.assign(StateParams, {limit:20, skip: 0}));
      getDataQuotaList(httpParams);
    };
    initDataQuotaList();
    // Paging
    $scope.pageChanged = function() {
      var httpParams = _.assign(StateParams, {limit:20, skip: ($scope.currentPage-1) * 20});
      getDataQuotaList(httpParams);
    };
    // Search for Data Quota Name
    $scope.Retrieval = function(){
      var httpParam = _.assign(StateParams, {quotaname: $scope.TargetDataQuotaName});
      getDataQuotaList(httpParams);
    };
    // Data quota apply info
    $scope.DataQuotaApplyInfo = function(data_quota_id) {
      var httpParams = {};
      var httpParam = { data_quota_id: data_quota_id };
      Http.getDataQuotaApplyInfo(httpParam).then(function() {
        alert('申请查看成功');
        _.assign(httpParams, {limit:20, skip: ($scope.currentPage-1) * 20});
        getDataQuotaList(httpParams);
      });
    };
    /** #Data quota apply info */

    /** SysDict */
    var SHARE_FREQUENCY = 1,
        DATA_LEVEL = 2,
        SHARE_LEVEL = 3;
    Http.getSystemDictByCatagory({
      'dict_category': SHARE_LEVEL
    }).then(function(result) {
      $scope.ShareLevels = result.data.body;
    });
    Http.getSystemDictByCatagory({
      'dict_category': SHARE_FREQUENCY
    }).then(function(result) {
      $scope.ShareFrequencys = result.data.body;
    });
    Http.getSystemDictByCatagory({
      'dict_category': DATA_LEVEL
    }).then(function(result) {
      $scope.DataLevels = result.data.body;
    });
    /** #SysDict */

    /** Filter */
    $scope.ShareLevelFilter = function(id){
      initDataQuotaList();
    };
    $scope.ShareFrequencyFilter = function(id){
      initDataQuotaList();
    };
    $scope.DataLevelFilter = function(id){
      initDataQuotaList();
    };
    $scope.ShareLevelAll = function(){
      initDataQuotaList();
    };
    $scope.ShareFrequencyAll = function(){
      initDataQuotaList();
    };
    $scope.DataLevelAll = function(){
      initDataQuotaList();
    };
    /** #Filter */

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
    function getDataQuotaApplyInfo(data){
      return $http.post(
        path + '/data_quota_apply_info', { data: data }
      )
    };
    return {
      getSystemDictByCatagory: getSystemDictByCatagory,
      getDataQuotaApplyInfo: getDataQuotaApplyInfo,
      getDataQuota: getDataQuota
    }
  }
]);
