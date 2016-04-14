'use strict';
var Dashboard = angular.module('Dashboard', ['ui.router']);

/** Dashboard Controller */
Dashboard.controller('Dashboard.Controller.Main', ['$scope',
  function($scope) {
    $scope.Bureaus = {};
    $scope.Echarts = {};
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
    $scope.Echarts.overview = ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"];
    $scope.Echarts.statistic = [];
  }
])

/** Dashboard Directive */
Dashboard.directive('wiservOverviewChart', [
  function() {
    return {
      restrict: 'AE',
      template: "<div style='width:300;height:150px;'></div>",
      link: function(scope, element, attr) {
        var myChart = echarts.init((element.find('div'))[0]);
        var option = {
          tooltip: {},
          legend: {
            data: ['销量']
          },
          xAxis: {
            data: scope.Echarts.overview
          },
          yAxis: {},
          series: [{
            name: '销量',
            type: 'bar',
            data: [5, 20, 36, 10, 10, 20]
          }]
        };
        myChart.setOption(option);
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
