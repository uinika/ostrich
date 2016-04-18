'use strict';
var InventoryDetail = angular.module('InventoryDetail', ['ui.router']);

/** Main Controller */
InventoryDetail.controller('InventoryDetail.Controller.Main', ['$scope', '$stateParams',
  function($scope, $stateParams, Http) {
    console.log($stateParams);

  }
])
