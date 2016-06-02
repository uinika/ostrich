'use strict';
var DataQuotaList = angular.module('DataQuotaList', ['ui.router']);

/** Main Controller */
DataQuotaList.controller('DataQuotaList.Controller.Main', ['$scope', '$state', 'DataQuotaList.Service.Http', '$stateParams',
  function($scope, $state, Http, StateParams) {
    // Get the parameters form ui-router
    var currentDepID = {resource_dep_id:StateParams.quota_dep_id};
    var currentDepName = {dep_name:StateParams.dep_name};
    // Selected department name
    $scope.currentDep = currentDepName.dep_name;
    // Params for pagin
    var initPaging = {limit:10, skip: 0};
    $scope.Paging = {};
    $scope.Paging.currentPage = 1;
    $scope.Paging.itemsPerPage = 10;
    $scope.Paging.pageChanged = function() {
      var httpParams = {};
      _.assign(httpParams, currentDepID, {limit:10, skip: ($scope.Paging.currentPage-1) * 10});
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
    (function initDataQuotaList(){
        /* Init selected status for filter */
        $scope.resourceFormatActiveAll = $scope.ShareLevelActiveAll = $scope.openToSocietyActiveAll = $scope.ShareFrequencyActiveAll = $scope.DataLevelActiveAll = $scope.isScretActiveAll= 'active';
        /* Init ajax parameters*/
        var httpParams = {};
        (currentDepID==='') ? (httpParams = initPaging) : (httpParams = _.assign(httpParams, currentDepID, initPaging));
        getDataQuotaList(httpParams);
    })();
    // Fetch data quota list by filter
    function getDataQuotaListByFilter(params){
      var httpParams = {};
      (currentDepID.dep_name==='') ? (httpParams = initPaging) : (httpParams = _.assign(httpParams, currentDepID, initPaging));
      _.assign(httpParams, params);
      getDataQuotaList(httpParams);
    };
    // Search for Data Quota Name
    $scope.Retrieval = function(){
      var httpParams = {};
      var searchTarget = {resource_name: $scope.TargetDataQuotaName};
      (currentDepID==='') ? (_.assign(httpParams, initPaging, searchTarget)) : (_.assign(httpParams, currentDepID, initPaging, searchTarget));
      getDataQuotaList(httpParams);
    };
    // Data quota apply info
    $scope.DataQuotaApplyInfo = function(data_quota_id) {
      Http.getDataQuotaApplyInfo({data_quota_id: data_quota_id}).then(function() {
        alert('申请查看成功');
        var httpParams = {};
        _.assign(httpParams, {limit:10, skip: ($scope.Paging.currentPage-1) * 10});
        getDataQuotaList(httpParams);
      });
    };
    // Filter generator
    var SHARE_FREQUENCY = 1, //更新周期
        DATA_LEVEL = 2, //分地区数据级别
        SHARE_LEVEL = 3, //共享级别
        RESOURCE_FORMAT = 11, //信息资源格式
        SOCIAL_OPEN_FLAG  = 14, //面向社会开放
        SECRET_FLAG = 5  //是否涉密
    Http.getSystemDictByCatagory({
      'dict_category': RESOURCE_FORMAT
    }).then(function(result) {
      $scope.resourceFormats = result.data.body;
    });
    Http.getSystemDictByCatagory({
      'dict_category': SOCIAL_OPEN_FLAG
    }).then(function(result) {
      $scope.openToSocietys = result.data.body;
    });
    Http.getSystemDictByCatagory({
      'dict_category': SECRET_FLAG
    }).then(function(result) {
      $scope.isScrets = result.data.body;
    });
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
    // Handle above filter
    var filterParams = {};

    /*信息资源格式*/
    $scope.resourceFormatFilter = function(id, index){
      $scope.resourceFormatActive = [];
      $scope.resourceFormatActiveAll = '';
      $scope.resourceFormatActive[index] = 'active';
      filterParams.re_format = id;
      if('ALL'===id){
        delete filterParams.re_format;
        $scope.resourceFormatActiveAll = 'active';
        getDataQuotaListByFilter(filterParams);
      }else{
        getDataQuotaListByFilter(filterParams);
      }
    };
    /* 共享级别 */
    $scope.ShareLevelFilter = function(id, index){
      $scope.ShareLevelActive = [];
      $scope.ShareLevelActiveAll = '';
      $scope.ShareLevelActive[index] = 'active';
      filterParams.share_level = id;
      if('ALL'===id){
        delete filterParams.share_level;
        $scope.ShareLevelActiveAll = 'active';
        getDataQuotaListByFilter(filterParams);
      }else{
        getDataQuotaListByFilter(filterParams);
      }
    };

    /*面向社会开放*/
    $scope.openToSocietyFilter = function(id, index){
      $scope.openToSocietyActive = [];
      $scope.openToSocietyActiveAll = '';
      $scope.openToSocietyActive[index] = 'active';
      filterParams.social_open_flag = id;
      if('ALL'===id){
        delete filterParams.social_open_flag;
        $scope.openToSocietyActiveAll = 'active';
        getDataQuotaListByFilter(filterParams);
      }else{
        getDataQuotaListByFilter(filterParams);
      }
    };
    /* 更新周期（共享频率） */
    filterParams.update_period = [];
    $scope.ShareFrequencyActive = [];
    $scope.ShareFrequencyFilter = function(id, index){
      if('ALL'===id){
        filterParams.update_period = [];
        $scope.ShareFrequencyActiveAll = 'active';
        $scope.ShareFrequencyActive = [];
        getDataQuotaListByFilter(filterParams);
      }else{
        $scope.ShareFrequencyActiveAll = '';
        ($scope.ShareFrequencyActive[index]==='active')?($scope.ShareFrequencyActive[index]=''):($scope.ShareFrequencyActive[index]='active');
        filterParams.update_period.push(id);
        getDataQuotaListByFilter(filterParams);
      }
    };

    /* 分地区数据级别 */
    filterParams.area_level = [];
    $scope.DataLevelActive = [];
    $scope.DataLevelFilter = function(id, index){
      if('ALL'===id){
        filterParams.area_level = [];
        $scope.DataLevelActiveAll = 'active';
        $scope.DataLevelActive=[];
        getDataQuotaListByFilter(filterParams);
      }else{
        $scope.DataLevelActiveAll = '';
        ($scope.DataLevelActive[index]==='active')?($scope.DataLevelActive[index]=''):($scope.DataLevelActive[index]='active');
        filterParams.area_level.push(id);
        getDataQuotaListByFilter(filterParams);
      };
    };
    /*是否涉密*/
    $scope.isScretFilter = function(id, index){
      $scope.isScretActive = [];
      $scope.isScretActiveAll = '';
      $scope.isScretActive[index] = 'active';
      filterParams.issecret = id;
      if('ALL'===id){
        delete filterParams.issecret;
        $scope.isScretActiveAll = 'active';
        getDataQuotaListByFilter(filterParams);
      }else{
        getDataQuotaListByFilter(filterParams);
      }
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
        path + '/resource/sys_dict', { params: params }
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
