'use strict';
var DataQuota = angular.module('DataQuota', ['ui.router']);

/** Main Controller */
DataQuota.controller('DataQuota.Controller.Main', ['$scope', '$state', 'DataQuota.Service.Http',
  function($scope, $state, Http) {

    $scope.toggle = function(scope) {
      scope.toggle();
    };
    $scope.treeOptions = {
      nodeChildren: "nodes",
      dirSelectable: true,
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
    $scope.dataForTheTree = [{
      "name": "Joe",
      "age": "21",
      "children": [{
        "name": "Smith",
        "age": "42",
        "children": []
      }, {
        "name": "Gary",
        "age": "21",
        "children": [{
          "name": "Jenifer",
          "age": "23",
          "children": [{
            "name": "Dani",
            "age": "32",
            "children": []
          }, {
            "name": "Max",
            "age": "34",
            "children": []
          }]
        }]
      }]
    }, {
      "name": "Albert",
      "age": "33",
      "children": []
    }, {
      "name": "Ron",
      "age": "29",
      "children": []
    }];
    // Generated Menu
    Http.menu().then(function(result) {
      if (200 === result.data.head.status) {
        $scope.list = result.data.body;
      }
    })


  }
]);

/* DataQuota Http Factory */
DataQuota.factory('DataQuota.Service.Http', ['$http', 'API',
  function($http, API) {
    var path = API.path;

    function menu(params) {
      return $http.get(
        path + '/menu', {
          params: params
        }
      )
    };
    return {
      menu: menu
    }
  }
]);
