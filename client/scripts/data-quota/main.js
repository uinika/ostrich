'use strict';
var DataQuota = angular.module('DataQuota', ['ui.router']);

/** Main Controller */
DataQuota.controller('DataQuota.Controller.Main', ['$scope', '$state', 'DataQuota.Service.Http','panels',
  function($scope, $state, Http, panels) {
    window.scrollTo(0,0);
    // Menu configration
    $scope.treeOptions = {
      nodeChildren: "nodes",
      dirSelectable: false,
      injectClasses: {
        ul: "a1",
        li: "a2",
        liSelected: "a7",
        iExpanded: "a2",
        iCollapsed: "a4",
        iLeaf: "a5",
        label: "a6",
        labelSelected: "a8"
      }
    }
    $scope.styleListOpen = function () {
				$scope.$broadcast('type', {message : 1});
			};

    $scope.$on('type', function(event, args) {
  		$scope.flag = args.message;
      // TypeMenu Generator
      Http.menu().then(function(result) {
        if (200 === result.data.head.status) {
          $scope.list = result.data.body;
        }
      });
      $scope.predicate = '';
  		panels.open("test01");
  	});
    $scope.ocupationListOpen = function () {
        $scope.$broadcast('ocupation', {message : 2});
      };

    $scope.$on('ocupation', function(event, args) {
      $scope.flag = args.message;
      // OcupationMenu Generator
      Http.menuRole().then(function(result) {
        if (200 === result.data.head.status) {
          $scope.OcupationList = result.data.body;
        }
      });
      $scope.predicate = '';
      panels.open("test01");
    });
    $scope.areaListOpen = function () {
        $scope.$broadcast('area', {message : 3});
      };

    $scope.$on('area', function(event, args) {
      $scope.flag = args.message;
      // AreaMenu Generator
      Http.menuArea().then(function(result) {
        if (200 === result.data.head.status) {
          $scope.areaList = result.data.body;
        }
      });
      $scope.predicate = '';
      panels.open("test01");
    });
    $scope.themeListOpen = function () {
        $scope.$broadcast('theme', {message : 4});
      };

    $scope.$on('theme', function(event, args) {
      $scope.flag = args.message;
      // AreaMenu Generator


      $scope.predicate = '';
      panels.open("test01");
    });


    $scope.comparator = false;
    $scope.showSelected = function(sel) {
         $scope.selectedNode = sel;
     };


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
