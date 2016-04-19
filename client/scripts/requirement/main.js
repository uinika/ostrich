'use strict';
var RequirementMain = angular.module('RequirementMain', ['ui.router']);

/** InventoryMain Controller */
RequirementMain.controller('RequirementMain.Controller.Main', ['$scope', '$stateParams', 'RequirementMain.Service.Http',
  function($scope, $stateParams, Http) {
    var httpParams = {};
    $scope.Requirement = {};
    Http.getStatistic(httpParams).then(function(result) {
      if(200 == result.data.head.status){
        $scope.Requirement.statistic = result.data.body[0];
      }
    });
    Http.getRequirementList(httpParams).then(function(result) {
      if(200 == result.data.head.status){
        $scope.Requirement.list = result.data.body;
      }
    });
  }
])

/* HTTP Factory */
RequirementMain.factory('RequirementMain.Service.Http', ['$http', 'API',
  function($http, API) {
    var path = API.path;
    function getStatistic(params) {
      return $http.get(
        path + '/requirement/statistic', {params: params}
      )
    };
    function getRequirementList(params) {
      return $http.get(
        path + '/requirement/requirementList', {params: params}
      )
    };
    return {
      getStatistic: getStatistic,
      getRequirementList: getRequirementList
    }
  }
]);
