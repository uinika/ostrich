'use strict';
var DataQuotaList = angular.module('DataQuotaList', ['ui.router']);

/** Main Controller */
DataQuotaList.controller('DataQuotaList.Controller.Main', ['$scope', '$state', 'DataQuotaList.Service.Http', '$stateParams',
  function($scope, $state, Http, StateParams) {
    // Get the parameters form ui-router
    var currentDepID = {quota_dep_id:StateParams.quota_dep_id};
    var currentDepName = {dep_name:StateParams.dep_name};
    // Selected department name
    $scope.currentDep = currentDepName.dep_name;
    // Params for pagin
    $scope.Paging = {};
    $scope.Paging.currentPage = 1;
    $scope.Paging.itemsPerPage = 10;
    var initPaging = {limit:10, skip: 0};
    // Paging change event
    $scope.Paging.pageChanged = function() {
      var httpParams = _.assign(currentDepID, {limit:10, skip: ($scope.Paging.currentPage-1) * 10});
      getDataQuotaList(httpParams);
    };
    // Get data quota list
    function getDataQuotaList(_httpParams){
      Http.getDataQuota(_httpParams).then(function(result) {
        $scope.DataQuotas = result.data.body[0].results;
        $scope.DataQuotasTotal = result.data.body[0].count;
        $scope.Paging.totalItems = result.data.body[0].count;
      });
    };
    // Init data quota talbe
    function initDataQuotaList(){
      var httpParams = {};
      (currentDepID==='') ? (httpParams = initPaging) : (httpParams = _.assign(currentDepID, initPaging));
      getDataQuotaList(httpParams);
    };
    initDataQuotaList();
    // Fetch data quota list by filter
    function getDataQuotaListByFilter(params){
      var httpParams = {};
      (currentDepID.dep_name==='') ? (httpParams = initPaging) : (httpParams = _.assign(currentDepID, initPaging));
      _.assign(httpParams, params);
      getDataQuotaList(httpParams);
    };
    // Search for Data Quota Name
    $scope.Retrieval = function(){
      var httpParam = _.assign(currentDepID, {quotaname: $scope.TargetDataQuotaName});
      getDataQuotaList(httpParam);
    };
    // Data quota apply info
    $scope.DataQuotaApplyInfo = function(data_quota_id) {
      var httpParams = {};
      var httpParam = { data_quota_id: data_quota_id };
      Http.getDataQuotaApplyInfo(httpParam).then(function() {
        alert('申请查看成功');
        _.assign(httpParams, {limit:10, skip: ($scope.currentPage-1) * 10});
        getDataQuotaList(httpParams);
      });
    };
    // Filter generator
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
    /** Handle above filter */
    $scope.ShareLevelFilter = function(id){
      getDataQuotaListByFilter({share_level: id});
    };
    $scope.ShareFrequencyFilter = function(id){
      getDataQuotaListByFilter({share_frequency: id});
    };
    $scope.DataLevelFilter = function(id){
      getDataQuotaListByFilter({sys_dict_id: id});
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
