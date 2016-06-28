'use strict';
var DataQuotaDetail = angular.module('DataQuotaDetail', ['ui.router']);

/** Main Controller */
DataQuotaDetail.controller('DataQuotaDetail.Controller.Main', ['$scope', '$state', 'DataQuotaDetail.Service.Http', '$stateParams',
  function($scope, $state, Http, $stateParams) {
    // Data Quota Detail
    Http.getDataQuotaDetailByDepID(
      $stateParams
    ).then(function(result) {
      $scope.DataQuotaDetail = result.data.body[0];
    });
    // Data Quota Example
    Http.getDataQuotaExampleByDepID(
      {resource_id: $stateParams.resource_id}
    ).then(function(result) {
      $scope.DataQuotaExample = result.data.body;
    });

    //informationResource required by deps
    $scope.DataquotaRequirementByDepTotals = Http.getDataQuotaRequirementByDepTotals(
      {resource_id: $stateParams.resource_id}
    );


  }
]);


/* HTTP Factory */
DataQuotaDetail.factory('DataQuotaDetail.Service.Http', ['$http', 'API',
  function($http, API) {
    var path = API.path;
    function getDataQuotaDetailByDepID(params){
      return $http.get(
        path + '/info_resource_detail', { params: params }
      )
    };
    function getDataQuotaExampleByDepID(params){
      return $http.get(
        path + '/info_item_detail', { params: params }
      )
    };
    function getDataQuotaRequirementByDepTotals(params){
      return $http.get(
        path + '/info_item_requirementDeps', { params: params }
      )
    };
    return {
      getDataQuotaDetailByDepID: getDataQuotaDetailByDepID,
      getDataQuotaExampleByDepID: getDataQuotaExampleByDepID,
      getDataQuotaRequirementByDepTotals: getDataQuotaRequirementByDepTotals
    }
  }
]);
DataQuotaDetail.directive('requirementDepatmentRelationship',[
  function(){
    return {
      restrict: 'AE',
      template: "<div style='width:400px;height:400px;position:relative;top:8px'></div>",
      link: function(scope, element, attr){

        var myChart = echarts.init((element.find('div'))[0]);
        var option1 = {
            title: {
                text: '信息资源对应的需求部门数'
            },
            tooltip: {},
            animationDurationUpdate: 1500,
            animationEasingUpdate: 'quinticInOut',
            series : [
                {
                    type: 'graph',
                    layout: 'none',
                    symbolSize: 50,
                    roam: true,
                    label: {
                        normal: {
                            show: true
                        }
                    },
                    edgeSymbol: ['circle', 'arrow'],
                    edgeSymbolSize: [4, 10],
                    edgeLabel: {
                        normal: {
                            textStyle: {
                                fontSize: 20
                            }
                        }
                    },
                    data: [{
                        name: '中心',
                        x: 550,
                        y: 250
                    }, {
                        name: '节点1',
                        x: 800,
                        y: 250
                    }, {
                        name: '节点2',
                        x: 550,
                        y: 50
                    }, {
                        name: '节点3',
                        x: 550,
                        y: 400
                    }, {
                        name: '节点4',
                        x: 300,
                        y: 250
                    }],
                    links: [{
                        source: '中心',
                        target: '节点1',

                    }, {
                        source: '中心',
                        target: '节点2'
                    }, {
                        source: '中心',
                        target: '节点3'
                    }, {
                        source: '中心2',
                        target: '节点4'
                    }, {
                        source: '节点1',
                        target: '节点4'
                    }],
                    lineStyle: {
                        normal: {
                            opacity: 0.9,
                            width: 2,
                            curveness: 0
                        }
                    }
                }
            ]
        };
        myChart.setOption(option1);
      }
    }
  }
]);
