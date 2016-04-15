'use strict';
var Main = angular.module('Main', ['ui.router']);

/** Main Controller */
Main.controller('Main.Controller.Main', ['$scope',
  function($scope) {
    $scope.Tab = {};
    $scope.Tab.switcher = function(event){
      console.log(event);
      $scope.Tab.active = 'active';
    };
    $scope.Tab.active = 'active';
  }
])

/** Main Directive */
Main.directive('wiservNavTabSwitcher', [
  function() {
    return{
      link: function(){

      }
    }
  }
])
