'use strict';
var Dashboard = angular.module('Dashboard', ['ui.router']);

/** Dashboard Controller */
Dashboard.controller('Dashboard.Controller.Main', ['$scope',
  function($scope) {
    $scope.Bureaus = {};
    $scope.Bureaus.logo = [
      'anjianju',
      'canlian',
      'chengguanju',
      'dishuiju',
      'fagaiju',
      'gonganju',
      'gongshangju',
      'guihuaju',
      'guoshuiju',
      'guotuju',
      'huanbaoju',
      'jianchaju',
      'jiaotongju',
      'jiaoyuju',
      'jishengju',
      'minzhengju',
      'shichangju',
      'shijianju',
      'sifaju',
      'tongjiju'
    ];



  }
])


/** Dashboard Directive */
Dashboard.directive('wiservOverviewChart', [
  function() {
    return {
      link: function(scope, element, attr) {

      }
    };
  }
]);

Dashboard.directive('wiservStatisticChart', [
  function() {
    return {
      link: function(scope, element, attr) {

      }
    };
  }
]);
