'use strict';
var DataQuota = angular.module('DataQuota', ['ui.router']);

/** Main Controller */
DataQuota.controller('DataQuota.Controller.Main', ['$scope', '$state', 'DataQuota.Service.Http',
  function($scope, $state, Http) {
    window.scrollTo(0,0);
    // Menu configration
    $scope.treeOptions = {
      nodeChildren: "nodes",
      dirSelectable: false,
      injectClasses: {
        ul: "a1",
        li: "a2",
        liSelected: "a7",
        iExpanded: "a3",
        iCollapsed: "a4",
        iLeaf: "a5",
        label: "a6",
        labelSelected: "a8"
      }
    }
    // TypeMenu Generator
    Http.menu().then(function(result) {
      if (200 === result.data.head.status) {
        $scope.list = result.data.body;
      }
    });
    // OcupationMenu Generator
    Http.menuRole().then(function(result) {
      if (200 === result.data.head.status) {
        $scope.OcupationList = result.data.body;
      }
    });
    // AreaMenu Generator
    Http.menuArea().then(function(result) {
      if (200 === result.data.head.status) {
        $scope.areaList = result.data.body;
      }
    });
  }
]);

/* DataQuota Http Factory */
DataQuota.factory('DataQuota.Service.Http', ['$http', 'API',
  function($http, API) {
    var path = API.path;

    function menu(params) {
      return $http.get(
        path + '/menu', { params: params }
      )
    };
    function menuRole(params) {
      return $http.get(
        path + '/menu_role', { params: params }
      )
    };
    function menuArea(params) {
      return $http.get(
        path + '/menu_area', { params: params }
      )
    };
    return {
      menu: menu,
      menuRole: menuRole,
      menuArea: menuArea
    }
  }
]);
