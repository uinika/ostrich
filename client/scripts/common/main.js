'use strict';
var Main = angular.module('Main', ['ui.router']);

/** Main Controller */
Main.controller('Main.Controller.Main', ['$scope',
  function($scope) {
    $scope.Tab = {};
    $scope.Tab.switcher = function(target){
      switch (target) {
        case 'dashboard': $scope.Tab.Actived = {};
          $scope.Tab.Actived.dashboard = 'active'; break;
        case 'inventory': $scope.Tab.Actived = {};
          $scope.Tab.Actived.inventory = 'active'; break;
        case 'requirement': $scope.Tab.Actived = {};
          $scope.Tab.Actived.requirement = 'active'; break;
        case 'department': $scope.Tab.Actived = {};
          $scope.Tab.Actived.department = 'active'; break;
      }
    };
    $scope.Tab.active = 'active';
  }
]);
