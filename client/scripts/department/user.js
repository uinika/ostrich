'use strict';
var SystemUser = angular.module('Department.SystemUser', ['ui.router']);

/** Main Controller */
SystemUser.controller('Department.SystemUser.Controller.Main', ['$scope', '$q','Department.SystemUser.Service.Http', 'Department.SystemUser.Service.Component', '$uibModal',
  function($scope, $q ,Http, Component, $uibModal) {
    Http.getUserList().then(function(result) {
      $scope.users = result.data.body;
    });

    // add user
    $scope.addUserModal= function() {
      $scope.Modal = {}; // Clean scope of modal
      $scope.Modal.user = {}; // Clean scope of modal

      Component.popModal($scope, '添加', 'add-user-modal').result.then(function() {
        Http.saveUser($scope.user).then(function(result) {
          if (200 == result.data.head.status) {
            alert('添加成功');
          }
        })
      });
    }


  }
])


/* HTTP */
SystemUser.factory('Department.SystemUser.Service.Http', ['$http', '$q', 'API',
  function($http, $q, API) {
    var path = API.path;

    function getUserList() {
      return $http.get(
        path + '/user'
      )
    };

    function saveUser(data) {
      return $http.post(
        path + '/user',{
          data: data
        }
      )
    };

    return {
      getUserList: getUserList,
      saveUser: saveUser
    }
  }
]);

/* Component */
SystemUser.service('Department.SystemUser.Service.Component', ['$uibModal',
  function($uibModal) {
    // prompt Alert
    function popAlert(scope, info) {
      scope.Alerts = [{
        type: info.type,
        message: info.message,
        timeout: 1200
      }];
      scope.CloseAlert = function(index) {
        scope.Alerts.splice(index, 1);
      };
    };
    // prompt Modal
    function popModal(scope, type, templateUrl) {
      scope.Modal.type = type;
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: templateUrl + '.html',
        scope: scope
      });
      scope.Modal.confirm = function(isValid) {
        if (isValid) {
          modalInstance.close(scope.Modal);
        }

      };
      scope.Modal.cancel = function() {
        modalInstance.dismiss();
      };
      return modalInstance;
    };

    return {
      popAlert: popAlert,
      popModal: popModal
    }
  }
])
