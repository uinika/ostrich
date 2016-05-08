'use strict';
var Dashboard = angular.module('Dashboard', ['ui.router','ui.bootstrap']);

/** Dashboard Controller */
Dashboard.controller('Dashboard.Controller.Main', ['$scope', 'Dashboard.Service.Http',
  function($scope, Http) {
    Http.getDataQuotaNew({
      skip: 0,
      limit: 6
    }).then(function(result) {
      if (200 == result.data.head.status) {
        $scope.NewIndicators = result.data.body;
      }
    });
    Http.getDataRequirementNew({
      skip: 0,
      limit: 6
    }).then(function(result) {
      if (200 == result.data.head.status) {
        $scope.Requirements = result.data.body;
      }
    });
    // Bureaus logo grid
    Http.getDepartments().then(function(result) {
      if (200 == result.data.head.status) {
        $scope.Bureaus = result.data.body;
      }
    });
    <!-- ECharts -->
    $scope.DataquotaSummary = Http.getDataquotaSummary();
    $scope.DataRequirementSummary = Http.getDataRequirementSummary();
    <!-- #ECharts -->
    $scope.select = function(param){
      console.log(param);
      Http.getDataQuota({
        follow_dep_id: param
      }).then(function(result){
          $scope.followDepIndicators = result.data.body;
      });
    }
    Http.getUserDep({
        // id: $rootScope.User.id
        id:  "29"
      }).then(function(result) {
        var followDepId = "";
        if (200 == result.data.head.status) {
          $scope.followDeps = result.data.body;
          followDepId = $scope.followDeps[0].follow_dep_id;
        }
        return followDepId;
      }).then(function(followDepId){
          Http.getDataQuota({
            follow_dep_id: followDepId
          }).then(function(result1){
              $scope.followDepIndicators = result1.data.body;
          });
     });
 }
])

/* HTTP Factory */
Dashboard.factory('Dashboard.Service.Http', ['$http', 'API',
  function($http, API) {
    var path = API.path;
    function getDataQuotaNew(params) {
      return $http.get(
        path + '/data_quota/new', {params: params}
      )
    };
    function getDataRequirementNew(params) {
      return $http.get(
        path + '/data_requiement/new', {params: params}
      )
    };
    function getDepartments() {
      return $http.get(
        path + '/department'
      )
    }
    function getDataquotaSummary(){
      return $http.get(
        path + '/data_quota/summary'
      )
    }
    function getDataRequirementSummary(){
      return $http.get(
        path + '/data_requiement/summary'
      )
    }
    function getUserDep(params){
      return $http.get(
        path + '/user_dep',{params: params}
      )
    }
    function getDataQuota(params){
      return $http.get(
        path + '/data_quota',{params: params}
      )
    }

    return {
      getDataQuotaNew: getDataQuotaNew,
      getDataRequirementNew: getDataRequirementNew,
      getDepartments: getDepartments,
      getDataquotaSummary: getDataquotaSummary,
      getDataRequirementSummary: getDataRequirementSummary,
      getUserDep: getUserDep,
      getDataQuota: getDataQuota
    }

  }
]);

/** Dashboard Directive */
Dashboard.directive('wiservDataQuotaOverviewChart', [
  function() {
    return {
      restrict: 'AE',
      template: "<div style='width:300;height:240px;'></div>",
      link: function(scope, element, attr) {
        scope.DataquotaSummary.then(function(result) {
          if (200 == result.data.head.status) {
            var summary = result.data.body[0];
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
                  value: summary.data_quota_number,
                  name: '清单提供部门'
                }, {
                  value: summary.department_number,
                  name: '本月新增',
                  selected: true
                }]
              }, {
                name: '清单总数',
                type: 'pie',
                radius: ['40%', '55%'],
                data: [{
                  value: summary.data_quota_number,
                  name: '清单总数'
                }, {
                  value: summary.department_number,
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
        scope.DataRequirementSummary.then(function(result) {
          if (200 == result.data.head.status) {
            var summary = result.data.body[0];
            console.log(summary);
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
                  value: summary.department_number,
                  name: '清单提供部门'
                }, {
                  value: summary.data_quota_number,
                  name: '本月新增',
                  selected: true
                }]
              }, {
                name: '清单总数',
                type: 'pie',
                radius: ['40%', '55%'],
                data: [{
                  value: summary.department_number,
                  name: '清单总数'
                }, {
                  value: summary.data_quota_number,
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
