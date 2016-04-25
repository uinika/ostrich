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
      if (200 == result.data.head.status) {
        $scope.Inventories = result.data.body;
      }
    });
    Http.getRequirement({
      skip: 0,
      limit: 7
    }).then(function(result) {
      if (200 == result.data.head.status) {
        $scope.Requirements = result.data.body;
      }
    });
    // Echarts Graph
    $scope.QInventoryOverview = Http.getInventoryOverview({
      startTime: 0,
      endTime: 10
    });
    $scope.QRequirementOverview = Http.getRequirementOverview({
      startTime: 0,
      endTime: 10
    });
    $scope.QInventoryStatistic = Http.getInventoryStatistic({
      skip: 0,
      limit: 10
    });
    // Bureaus logo grid
    Http.getDepartments().then(function(result) {
      if (200 == result.data.head.status) {
        $scope.Bureaus = result.data.body;
      }
    });

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
    function getRequirement(params) {
      return $http.get(
        path + '/requirement', {params: params}
      )
    };
    function getRequirementOverview(params) {
      return $http.get(
        path + '/requirement/overview', {params: params}
      )
    };
    function getInventoryStatistic(params) {
      return $http.get(
        path + '/inventory/statistic', {params: params}
      )
    };
    function getDepartments() {
      return $http.get(
        path + '/dep'
      )
    }
    return {
      getInventory: getInventory,
      getInventoryOverview: getInventoryOverview,
      getRequirement: getRequirement,
      getRequirementOverview: getRequirementOverview,
      getInventoryStatistic: getInventoryStatistic,
      getDepartments: getDepartments
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
        scope.QInventoryOverview.then(function(result) {
          if (200 == result.data.head.status) {
            var inventoryOverview = result.data.body[0];
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
                  value: inventoryOverview.INVENTORY_DEPT_NUM,
                  name: '清单提供部门'
                }, {
                  value: inventoryOverview.MONTH_INVENTORY_DEPT_NUM,
                  name: '本月新增',
                  selected: true
                }]
              }, {
                name: '清单总数',
                type: 'pie',
                radius: ['40%', '55%'],
                data: [{
                  value: inventoryOverview.INVENTORY_NUM,
                  name: '清单总数'
                }, {
                  value: inventoryOverview.INVENTORY_DEPT_NUM,
                  name: '本月新增',
                  selected: true
                }]
              }]
            };
            myChart.setOption(option);
          }
        });
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
        scope.QRequirementOverview.then(function(result) {
          if (200 == result.data.head.status) {
            var requirementOverview = result.data.body[0];
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
                  value: requirementOverview.REQUIREMENT_DEPT_NUM,
                  name: '清单提供部门'
                }, {
                  value: requirementOverview.MONTH_REQUIREMENT_DEPT_NUM,
                  name: '本月新增',
                  selected: true
                }]
              }, {
                name: '清单总数',
                type: 'pie',
                radius: ['40%', '55%'],
                data: [{
                  value: requirementOverview.REQUIREMENT_NUM,
                  name: '清单总数'
                }, {
                  value: requirementOverview.REQUIREMENT_DEPT_NUM,
                  name: '本月新增',
                  selected: true
                }]
              }]
            };
            myChart.setOption(option);
          }
        });
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
        scope.QInventoryStatistic.then(function(result) {
          var DEPARTMENT = result.data.body[0];
          var INVENTORY = result.data.body[1];
          var REQUIREMENT = result.data.body[2];
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
              data: DEPARTMENT.DEPARTMENT
            }],
            yAxis: [{
              type: 'value',
              name: '单位',
              min: 0,
              max: 30,
              interval: 30,
              axisLabel: {
                formatter: '{value} 个'
              }
            }],
            series: [{
              name: '清单',
              type: 'bar',
              data: INVENTORY.INVENTORY
            }, {
              name: '需求',
              type: 'bar',
              data: REQUIREMENT.REQUIREMENT
            }]
          };
          myChart.setOption(option);
        });

      }
    };
  }
]);
