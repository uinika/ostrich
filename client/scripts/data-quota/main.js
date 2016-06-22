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
    $scope.leftOpen = function () {
				$scope.$broadcast('rightHello', {message : $scope.message});
			};

    $scope.$on('rightHello', function(event, args) {

  		$scope.message = args.message;

  		panels.open("test01");
  	});
    $scope.comparator = false;
    $scope.showSelected = function(sel) {
         $scope.selectedNode = sel;
     };
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

// DataQuota.controller('leftCtrl', ['$scope', 'panels', function ($scope, panels) {
//
// 	$scope.$on('rightHello', function(event, args) {
//
// 		$scope.message = args.message;
//
// 		panels.open("test01");
// 	});
//   //close callback
// 	$scope.testpanelClose = function () {
// 		window.alert('Close Callback!!');
// 	};
// }]);
