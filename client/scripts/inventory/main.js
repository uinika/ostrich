'use strict';
var Inventory = angular.module('Inventory', ['ui.router']);

/** Main Controller */
Inventory.controller('Inventory.Controller.Main', ['$scope', '$state', 'Inventory.Service.Http',
  function($scope, $state, Http) {
    $scope.toggle = function (scope) {
      scope.toggle();
    };
 $scope.list = [{
   "id": 1,
   "title": "node1",
   "nodes": [{
     "id": 11,
     "title": "node1.1",
     "nodes": [{
       "id": 111,
       "title": "node1.1.1",
       "nodes": []
     }]
   }, {
     "id": 12,
     "title": "node1.2",
     "nodes": []
   }]
 }, {
   "id": 2,
   "title": "node2",
   "nodrop": true,
   "nodes": [{
     "id": 21,
     "title": "node2.1",
     "nodes": []
   }, {
     "id": 22,
     "title": "node2.2",
     "nodes": []
   }]
 }, {
   "id": 3,
   "title": "node3",
   "nodes": [{
     "id": 31,
     "title": "node3.1",
     "nodes": []
   }]
 }]

    // $scope.Inventory = {};
    // // Get department list
    // Http.getDepWithInventoryNum().then(function(result) {
    //   if(200 == result.data.head.status){
    //     $scope.Inventory.departments = result.data.body;
    //   }
    // });
    // // Init another datas
    // getAll();
    // // Switch current scope
    // $scope.Inventory.switcher = function(target){
    //   var httpParams = {DEP_ID: target}
    //   getAll(httpParams);
    // }
    //
    // // Promise all
    // function getAll(httpParams){
    //   Http.getShareDictWithInventoryNum(httpParams).then(function(result) {
    //     if(200 == result.data.head.status){
    //       $scope.Inventory.shareDict = result.data.body;
    //     }
    //   });
    //   Http.getAreaDictWithInventoryNum(httpParams).then(function(result) {
    //     if(200 == result.data.head.status){
    //       $scope.Inventory.areaDict = result.data.body;
    //     }
    //   });
    //   Http.getShareDictWithInventoryNum(httpParams).then(function(result) {
    //     if(200 == result.data.head.status){
    //       $scope.Inventory.shareDict = result.data.body;
    //     }
    //   });
    //   Http.inventoryList(httpParams).then(function(result) {
    //     if(200 == result.data.head.status){
    //       $scope.Inventory.inventoryList = result.data.body;
    //     }
    //   });
    // };

    var _httpParams = {};
    _httpParams.limit = 10;
    _httpParams.skip = 0;

    // init
    getDepartmentInvntList(_httpParams);

    Http.getInventoryDepTotal().then(function(result) {
      $scope.ivntDepTotal = result.data.body[0].INVENTORY_NUM;
      $scope.depName = result.data.body[0].DEP_NAME;
    });

    Http.getShareLevelFilter().then(function(result) {
      $scope.shareLevelList = result.data.body;
    });

    Http.getSpatialFilter().then(function(result) {
      $scope.areaPeriodList = result.data.body;
    });


    function getDepartmentInvntList(_httpParams) {
      Http.getDepartInvntList(_httpParams).then(function(result) {
        $scope.depIvntList = result.data.body;
        //  $scope.Paging.totalItems = data.head.total;
      });
    }

    // filter by share level
    $scope.shareLvMainSelection = [];
    $scope.getIvntListBySl = function(item) {
      var idx = $scope.shareLvMainSelection.indexOf(item.SYS_DICT_ID);
      if (idx > -1) {
        $scope.shareLvMainSelection = [];
      } else {
        $scope.shareLvMainSelection = item.SYS_DICT_ID;
      }
      _httpParams.SHARE_LEVEL = $scope.shareLvMainSelection;
      _httpParams.limit = 10;
      _httpParams.skip = 0;
      getDepartmentInvntList(_httpParams);
    }

    // filter by partial
    $scope.areaMainSelection = [];
    $scope.getIvntListByAP = function(item) {
      var idx = $scope.areaMainSelection.indexOf(item.DICTID);
      // is currently selected
      if (idx > -1) {
        $scope.areaMainSelection.splice(idx, 1);
      }
      // is newly selected
      else {
        $scope.areaMainSelection.push(item.SYS_DICT_ID);
      }
      console.log($scope.areaMainSelection);

      _httpParams.AREA_DATA_LEVEL = $scope.areaMainSelection;
      _httpParams.limit = 10;
      _httpParams.skip = 0;
      getDepartmentInvntList(_httpParams);
    }

    // share level all
    $scope.getShareLevelAll = function() {
      $scope.shareLvMainSelection = [];
      _httpParams.SHARE_LEVEL = null;
      _httpParams.limit = 10;
      _httpParams.skip = 0;
      getDepartmentInvntList(_httpParams);
    }

    // get spatial all
    $scope.getSpatialAll = function() {
      $scope.areaMainSelection = [];
      _httpParams.AREA_DATA_LEVEL = null;
      _httpParams.limit = 10;
      _httpParams.skip = 0;
      getDepartmentInvntList(_httpParams);
    }





  }
])

/* HTTP Factory */
Inventory.factory('Inventory.Service.Http', ['$http', 'API',
  function($http, API) {
    var path = API.path;
    // function getDepWithInventoryNum(params) {
    //   return $http.get(
    //     path + '/inventory/getDepWithInventoryNum'
    //   )
    // };
    // function getShareDictWithInventoryNum(params) {
    //   return $http.get(
    //     path + '/inventory/getShareDictWithInventoryNum', {params: params}
    //   )
    // };
    // function getAreaDictWithInventoryNum(params) {
    //   return $http.get(
    //     path + '/inventory/getAreaDictWithInventoryNum', {params: params}
    //   )
    // };
    // function inventoryList(params) {
    //   return $http.get(
    //     path + '/inventory/inventoryList', {params: params}
    //   )
    // };
    // function updateVisitCount(params) {
    //   return $http.put(
    //     path + '/inventory/updateVisitCount', {data: data}
    //   )
    // };


    function getSystemDictByCatagory(params) {
      return $http.get(
        path + '/dict', {
          params: params
        }
      )
    };

    function getDepartmentList() {
      return $http.get(
        path + '/dep/'
      )
    }

    function getInventoryDepTotal() {
      return $http.get(
        path + '/inventory/getDepWithInventoryNumByDep'
      )
    }

    function getDepartInvntList(params) {
      return $http.get(
        path + '/inventory/inventoryListByDep', {
          params: params
        }
      )
    }

    function getShareLevelFilter(params) {
      return $http.get(
        path + '/inventory/getShareDictWithInventoryNumByDep', {
          params: params
        }
      )
    }

    function getSpatialFilter(params) {
      return $http.get(
        path + '/inventory/getAreaDictWithInventoryNumByDep', {
          params: params
        }
      )
    }


    return {
      // getDepWithInventoryNum: getDepWithInventoryNum,
      // getShareDictWithInventoryNum: getShareDictWithInventoryNum,
      // getAreaDictWithInventoryNum: getAreaDictWithInventoryNum,
      // inventoryList: inventoryList,
      // updateVisitCount: updateVisitCount
      getSystemDictByCatagory: getSystemDictByCatagory,
      getDepartmentList: getDepartmentList,
      getDepartInvntList: getDepartInvntList,
      getShareLevelFilter: getShareLevelFilter,
      getSpatialFilter: getSpatialFilter,
      getInventoryDepTotal: getInventoryDepTotal
    }

  }
]);
