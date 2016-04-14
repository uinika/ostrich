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
      restrict: 'ACE',
      template: "<div style='width:300;height:150px;'></div>",
      link: function(scope, element, attr) {
        var myChart = echarts.init((element.find('div'))[0]);
        var option = {
          tooltip: {},
          legend: {
            data: ['销量']
          },
          xAxis: {
            data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
          },
          yAxis: {},
          series: [{
            name: '销量',
            type: 'bar',
            data: [5, 20, 36, 10, 10, 20]
          }]
        };

        // 使用刚指定的配置项和数据显示图表。
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
