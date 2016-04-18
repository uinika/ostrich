'use strict';
var InventoryDetail = angular.module('InventoryDetail', ['ui.router']);

/** InventoryDetail Controller */
InventoryDetail.controller('InventoryDetail.Controller.Main', ['$scope', '$stateParams',
  function($scope, $stateParams, Http) {
    console.log($stateParams.inventoryID);

  }
])

/** InventoryDetail Service */
