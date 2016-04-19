'use strict';
var RequirementDetail = angular.module('RequirementDetail', ['ui.router']);

/** InventoryDetail Controller */
RequirementDetail.controller('RequirementDetail.Controller.Main', ['$rootScope', '$scope', '$stateParams', 'RequirementDetail.Service.Http',
  function($rootScope, $scope, $stateParams, Http) {
    var httpParams = {ID: $stateParams.requirementID};
    var _httpParams = {REQUIREMENT_ID: $stateParams.requirementID};
    $scope.RequirementDetail = {};
    Http.requireDetail(httpParams).then(function(result) {
      if(200 == result.data.head.status){
        $scope.RequirementDetail.detail = result.data.body[0];
      }
    });
    Http.requireResponseList(_httpParams).then(function(result) {
      if(200 == result.data.head.status){
        $scope.RequirementDetail.list = result.data.body;
      }
    });

  }
])

/* HTTP Factory */
RequirementDetail.factory('RequirementDetail.Service.Http', ['$http', 'API',
  function($http, API) {
    var path = API.path;
    function requireDetail(params) {
      return $http.get(
        path + '/requirement/requireDetail', {params: params}
      )
    };
    function requireResponseList(params) {
      return $http.get(
        path + '/requirement/requireResponseList', {params: params}
      )
    };
    function addRequireResponse(data) {
      return $http.post(
        path + '/requirement/addRequireResponse', {data: data}
      )
    };
    return {
      requireDetail: requireDetail,
      requireResponseList: requireResponseList,
      addRequireResponse: addRequireResponse
    }
  }
]);
