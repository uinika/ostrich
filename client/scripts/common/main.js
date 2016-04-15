'use strict';
var Main = angular.module('Main', ['ui.router']);

/** Main Controller */
Main.controller('Main.Controller.Main', ['$scope',
  function($scope) {
    $scope.Tab = {};
    $scope.Tab.switcher = function(){
      console.log('test');
    };
    $scope.Tab.active = '';
  }
])


/** Main Controller */
Main.directive('wiservNavTabSwitcher', [
  function() {
    return{
      link: function(){

      }
    }
  }
])
