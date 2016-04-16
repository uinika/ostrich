'use strict';
var Dashboard = angular.module('Dashboard', ['ui.router']);

/** Dashboard Controller */
Dashboard.controller('Dashboard.Controller.Main', ['$scope', 'Dashboard.Service.Http',
  function($scope, Http) {
    // Datas List
    Http.getInventory({
      skip: 0,
      limit: 6
    }).then(function(result) {
      if(200 == result.data.head.status){
         $scope.Inventories = result.data.body;
      }
    });
    Http.getRequirement({
      skip: 0, limit: 7
    }).then(function(result) {
      if(200 == result.data.head.status){
         $scope.Requirements = result.data.body;
      }
    });
    // Echarts Graph
    Http.getInventoryOverview({
      endTime: 0, endTime: 10
    }).then(function(result) {
      if(200 == result.data.head.status){
         $scope.InventoryOverview = result.data.body;
      }
    });
    Http.getRequirementOverview({
      startTime: 0, endTime: 10
    }).then(function(result) {
      if(200 == result.data.head.status){
         $scope.RequirementOverview = result.data.body;
      }
    });
    Http.getInventoryStatistic({
      skip: 0, limit: 10
    }).then(function(result) {
      if(200 == result.data.head.status){
         $scope.InventoryStatistic = result.data.body;
      }
    });
    // Bureaus logo grid
    $scope.Bureaus = [
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

/* HTTP Factory */
Dashboard.factory('Dashboard.Service.Http', ['$http', 'API',
  function($http, API) {
    var path = API.path;
    function getInventory(params) {
      return $http.get(
        path + '/inventory', {params: params}
      )
    };
    function getInventoryOverview(params) {
      return $http.get(
        path + '/inventory/overview', {params: params}
      )
    };
    function getRequirement(params){
      return $http.get(
        path + '/requirement', {params: params}
      )
    };
    function getRequirementOverview(params){
      return $http.get(
        path + '/requirement/overview', {params: params}
      )
    };
    function getInventoryStatistic(params){
      return $http.get(
        path + '/inventory/statistic', {params: params}
      )
    };
    return {
      getInventory: getInventory,
      getInventoryOverview: getInventoryOverview,
      getRequirement: getRequirement,
      getRequirementOverview: getRequirementOverview,
      getInventoryStatistic: getInventoryStatistic
    }
  }
]);

/** Dashboard Directive */
Dashboard.directive('wiservInventoryOverviewChart', [
  function() {
    return {
      restrict: 'AE',
      template: "<div style='width:300;height:240px;'></div>",
      link: function(scope, element, attr) {
        var myChart = echarts.init((element.find('div'))[0]);
        var option = {
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
          },
          series: [{
            name: '清单提供部门',
            type: 'pie',
            selectedMode: 'single',
            radius: [0, '30%'],
            label: {
              normal: {
                position: 'inner'
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [{
              value: 335,
              name: '清单提供部门'
            }, {
              value: 679,
              name: '本月新增',
              selected: true
            }]
          }, {
            name: '清单总数',
            type: 'pie',
            radius: ['40%', '55%'],
            data: [{
              value: 335,
              name: '清单总数'
            }, {
              value: 310,
              name: '本月新增',
              selected: true
            }]
          }]
        };
        myChart.setOption(option);
      }
    };
  }
]);

Dashboard.directive('wiservRequirementOverviewChart', [
  function() {
    return {
      restrict: 'AE',
      template: "<div style='width:300;height:240px;'></div>",
      link: function(scope, element, attr) {
        var myChart = echarts.init((element.find('div'))[0]);
        var option = {
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
          },
          series: [{
            name: '清单提供部门',
            type: 'pie',
            selectedMode: 'single',
            radius: [0, '30%'],
            label: {
              normal: {
                position: 'inner'
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [{
              value: 335,
              name: '清单提供部门'
            }, {
              value: 679,
              name: '本月新增',
              selected: true
            }]
          }, {
            name: '清单总数',
            type: 'pie',
            radius: ['40%', '55%'],
            data: [{
              value: 335,
              name: '清单总数'
            }, {
              value: 310,
              name: '本月新增',
              selected: true
            }]
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
      restrict: 'AE',
      template: "<div style='width:100%;height:240px;'></div>",
      link: function(scope, element, attr) {
        var myChart = echarts.init((element.find('div'))[0]);
        var option = {
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: ['清单', '需求']
          },
          xAxis: [{
            type: 'category',
            name: '数量',
            data: ['保监局', '财政厅', '地税局', '发改委', '工商局', '公安局', '国税局', '国土局', '经信委', '科技厅']
          }],
          yAxis: [{
            type: 'value',
            name: '单位',
            min: 0,
            max: 250,
            interval: 50,
            axisLabel: {
              formatter: '{value} 个'
            }
          }],
          series: [{
            name: '清单',
            type: 'bar',
            data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0]
          }, {
            name: '需求',
            type: 'bar',
            data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8]
          }]
        };
        myChart.setOption(option);
      }
    };
  }
]);
