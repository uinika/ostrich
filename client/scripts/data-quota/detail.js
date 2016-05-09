'use strict';
var DataQuotaDetail = angular.module('DataQuotaDetail', ['ui.router']);

/** Main Controller */
DataQuotaDetail.controller('DataQuotaDetail.Controller.Main', ['$scope', '$state', '$stateParams',
  function($scope, $state, $stateParams) {
    console.log($stateParams);
  }
]);
