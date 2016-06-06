'use strict';
/* Bootstrap Application */
var app = angular.module('app', [
  'Config',
  'ui.router',
  'ui.bootstrap',
  'treeControl',
  'isteven-multi-select',
  'Login',
  'Main',
  'Dashboard',
  'Admin',
  'Admin.User',
  'Admin.Department',
  'Department',
  'DataQuota',
  'DataQuotaList',
  'DataQuotaDetail',
  'Department.Inventory',
  'Department.Audit',
  'Department.Requirement',
  'DepartmentShare'
]);

app.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', '$provide',
  function($stateProvider, $urlRouterProvider, $httpProvider, $provide) {
    /** HTTP Interceptor */
    $httpProvider.interceptors.push(['$q',
      function($q) {
        return {
          'request': function(config) {
            config.withCredentials = true;
            return config;
          },
          'requestError': function(rejection) {
            return rejection;
          },
          'response': function(response) {
            $q.when(response, function(result){
              if( response.data && typeof response.data==='object'){
                if(result.data.head.status===300){
                  sessionStorage.message = '登陆超时，请重新登陆！';
                  window.location.href='/';
                };
              };
            });
            return response;
          },
          'responseError': function(rejection) {
            return rejection;
          }
        };
      }
    ]);
    /** Config Router */
    $urlRouterProvider.otherwise('/login');
    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'views/common/login.html',
        controller: 'Login.Controller.Main'
      })
      .state('main', {
        url: '/main',
        templateUrl: 'views/common/main.html',
        controller: 'Main.Controller.Main'
      })
      .state('main.dashboard', {
        url: '/dashboard',
        templateUrl: 'views/common/dashboard.html',
        controller: 'Dashboard.Controller.Main'
      })
      .state('main.admin', {
        url: '/admin',
        templateUrl: 'views/admin/main.html',
        controller: 'Admin.Controller.Main'
      })
      .state('main.admin.department', {
        url: '/dashboard',
        templateUrl: 'views/admin/department.html',
        controller: 'Admin.Department.Controller.Main'
      })
      .state('main.admin.user', {
        url: '/user',
        templateUrl: 'views/admin/user.html',
        controller: 'Admin.User.Controller.Main'
      })
      .state('main.data-quota', {
        url: '/data-quota',
        templateUrl: 'views/data-quota/main.html',
        controller: 'DataQuota.Controller.Main'
      })
      .state('main.data-quota.list', {
        url: '/list/:resource_dep_id/:dep_name',
        templateUrl: 'views/data-quota/list.html',
        controller: 'DataQuotaList.Controller.Main'
      })
      .state('main.data-quota.detail', {
        url: '/detail/:resource_id',
        templateUrl: 'views/data-quota/detail.html',
        controller: 'DataQuotaDetail.Controller.Main'
      })
      .state('main.department', {
        url: '/department',
        templateUrl: 'views/department/main.html'
      })
      .state('main.department.summary', {
        url: '/summary',
        cache:'false',
        reload: true,
        templateUrl: 'views/department/summary.html',
        controller: 'Department.Controller.Main'
      })
      .state('main.department.inventory', {
        url: '/inventory',
        cache:'false',
        templateUrl: 'views/department/inventory.html',
        controller: 'Department.Inventory.Controller.Main'
      })
      .state('main.department.inventory.publish', {
        url: '/publish',
        templateUrl: 'views/department/inventory-publish.html',
        controller: 'Department.Inventory.Controller.publish'
      })
      .state('main.department.inventory.update', {
        url: '/update/{item:json}',
        params:{
          item:null
        },
        templateUrl: 'views/department/inventory-update.html',
        controller: 'Department.Inventory.Controller.publish'
      })
      .state('main.department.detail', {
        url: '/detail/{item:json}',
        params:{
          item:null
        },
        cache:'false',
        templateUrl: 'views/department/inventory-detail.html',
        controller: 'Department.Inventory.Controller.detail'
      })
      .state('main.department.share', {
        url: '/share',
        templateUrl: 'views/department/share.html',
        controller: 'DepartmentShare.Controller.Main'
      })
      .state('main.department.share.detail', {
        url: '/detail?ID',
        templateUrl: 'views/department/share-detail.html',
        controller: 'DepartmentShare.Controller.detail'
      })
      .state('main.department.requirementConfirm', {
        url: '/requirement-confirm',
        templateUrl: 'views/department/requirement-confirm.html',
        controller: 'Department.Requirement.Controller.confirm'
      })
      .state('main.department.requirement', {
        url: '/requirement',
        templateUrl: 'views/department/requirement.html',
        controller: 'Department.Requirement.Controller.Main'
      })
      .state('main.department.requirement.publish', {
        url: '/publish',
        templateUrl: 'views/department/requirement-publish.html'
      })
      .state('main.department.requirement.detail', {
        url: '/detail?ID',
        templateUrl: 'views/department/requirement-detail.html',
        controller: 'Department.Requirement.Controller.detail'
      })
      .state('main.department.audit', {
        url: '/audit',
        cache:'false',
        templateUrl: 'views/department/audit.html',
        controller: 'Department.Audit.Controller.Main'
      })
      .state('main.department.audit.info', {
        url: '/info/{item:json}',
        params:{
          item:null
        },
        templateUrl: 'views/department/audit-info.html',
        controller: 'Department.Audit.Controller.info'
      })

  }
]);

app.run(['$rootScope', function($rootScope){
  $rootScope.$on('$stateChangeStart',
    function(event, toState, toParams, fromState, fromParams){
      if(toState.name!=='login'){
        if(!sessionStorage.token){
          window.location.href='/';
        };
      };
    });
}]);

'use strict';
/* Application Configration */
var Config = angular.module('Config', []);

Config.constant('API', {
  path: 'http://localhost:8080/drrp/api'
});

'use strict';
var AdminDepartment = angular.module('Admin.Department', ['ui.router']);

/** DepartmentReq Controller */
AdminDepartment.controller('Admin.Department.Controller.Main', ['$rootScope', '$scope', '$stateParams','AdminDepartment.Service.Http', 'AdminDepartment.Service.Component', '$uibModal', '$state',
  function($rootScope, $scope, $stateParams, Http, Component, $uibModal, $state) {
    $scope.Modal = {}; // Clean scope of modal
    $scope.previousDepNames = [];
    $scope.areaNames = [];
    $scope.Paging = {};
    $scope.Paging.maxSize = 5;
    $scope.Paging.itemsPerPage = 10;

    var _httpParams = {};
    _httpParams.limit = 10;
    _httpParams.skip = 0;

    $scope.Paging.pageChanged = function() {
      _httpParams.skip = ($scope.Paging.currentPage - 1)*_httpParams.limit;
      getDepartmentList(_httpParams);
    }
    //pagination
    function getDepartmentList(_httpParams) {
      Http.getDepartmentList(_httpParams).then(function(result) {
        $scope.AdminDepartments = result.data.body;
      });
    }

    // init
    getDepartmentList(_httpParams);
    function getDepTotal(){
      Http.getDepTotal({
      }).then(function(result) {
        $scope.depTotal = result.data.body[0].number;
        $scope.Paging.totalItems = $scope.depTotal;
      });
    }
    getDepTotal();
    Http.getDepartmentList().then(function(result) {
      $scope.AllDepartments = result.data.body;
    });
    Http.getSysDict({
      dict_category:"7"
    }).then(function(result) {
      $scope.types = result.data.body;
    });
    Http.getSysDict({
      dict_category:"9"
    }).then(function(result) {
      $scope.areaNames = result.data.body;
    });

    $scope.placeholder = {};
    $scope.placeholder.dep_sn = "必填";
    $scope.placeholder.order_by = "必填";
    $scope.placeholder.dep_name = "必填";
    $scope.placeholder.dep_short_name = "必填";
    $scope.placeholder.dep_en_name = "必填";
    $scope.placeholder.contacts = "必填";
    $scope.placeholder.contact_phone = "必填";

    // add Department
    $scope.addDepartmentModal = function() {
      $scope.Modal = {}; // Clean scope of modal
      $scope.department = {}; // Clean scope of modal
      $scope.department.dep_en_name="anquanting.png";
      $scope.department.parent_id = "0";
      $scope.department.area_code ="c9cf130a-1e2f-11e6-ac02-507b9d1b58bb";
      $scope.department.dep_type = "aa7772bb-10de-11e6-9b44-507b9d1b58bb";
      var promise = Component.popModal($scope, '添加', 'add-department-modal');
      promise.opened.then(function() {
        $scope.Modal.TypeArea = function(){
          <!--parent_id is selected -->
          if($scope.department.parent_id!="0"){
            var index = _.findIndex($scope.AllDepartments, function(o) { return o.id == $scope.department.parent_id; } );
            $scope.department1 = $scope.AllDepartments[index];
          }
          <!--parent_id is selected -->
        }
        $scope.Modal.validDepName = function (depName){
          $scope.validDepName = false;
          $scope.placeholder.dep_name = "必填";
          Http.getDepartmentList().then(function(result) {
             var deps = result.data.body;
             for (var i = 0; i < deps.length; i++) {
               if(deps[i].dep_name === depName){
                 $scope.validDepName = true;
                 $scope.placeholder.dep_name ="该部门已存在,请重新输入";
                 $scope.department.dep_name ="";
               }
             }
          });
        }
        $scope.Modal.validPhone = function (){
          $scope.placeholder.contact_phone = "必填";
          $scope.validPhone = false ;
          var reg =/^((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/;
          if(!reg.test($scope.department.contact_phone)&&($scope.department.contact_phone!=null)){
            $scope.validPhone = true ;
            $scope.placeholder.contact_phone = "电话格式不对";
            $scope.department.contact_phone ="";
          }
        }
      });
      promise.result.then(function() {
        Http.saveDepartment($scope.department).then(function(result) {
          if (200 == result.data.head.status) {
            alert('添加成功');
          }
          else{
            alert('添加失败');
          }
          _httpParams.limit = 10;
          _httpParams.skip = 0;
          $scope.Paging.currentPage = 0 ;
          getDepartmentList(_httpParams);
          getDepTotal();
        })
      });
    }
    $scope.updateDepartment = function(AdminDep) {
      $scope.department = AdminDep;
      $scope.department.parent_id = "0";
      $scope.department.area_code ="c9cf130a-1e2f-11e6-ac02-507b9d1b58bb";
      $scope.department.dep_type = "aa7772bb-10de-11e6-9b44-507b9d1b58bb";
      $scope.department.dep_en_name="anquanting.png";
      _.remove($scope.AllDepartments, function(dep) {
        return (dep.dep_name == AdminDep.dep_name);
     });
      var promise = Component.popModal($scope, '修改', 'add-department-modal');
      promise.opened.then(function() {
        $scope.Modal.TypeArea = function(){
          <!--parent_id is selected -->
          if($scope.department.parent_id!="0"){
            var index = _.findIndex($scope.AllDepartments, function(o) { return o.id == $scope.department.parent_id; } );
            $scope.department1 = $scope.AllDepartments[index];
          }
          <!--parent_id is selected -->
        }
        $scope.Modal.validDepName = function (depName){
          $scope.validDepName = false;
          $scope.placeholder.dep_name = "必填";
          Http.getDepartmentList().then(function(result) {
             var deps = result.data.body;
             for (var i = 0; i < deps.length; i++) {
               if(deps[i].dep_name === depName){
                 $scope.validDepName = true;
                 $scope.placeholder.dep_name ="该部门已存在,请重新输入";
                 $scope.department.dep_name ="";
               }
             }
          });
        }
        $scope.Modal.validPhone = function (){
          $scope.placeholder.contact_phone = "必填";
          $scope.validPhone = false ;
          var reg =/^((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/;
          if(!reg.test($scope.department.contact_phone)&&($scope.department.contact_phone!=null)){
            $scope.validPhone = true ;
            $scope.placeholder.contact_phone = "电话格式不对";
            $scope.department.contact_phone ="";
          }
        }

      });
      promise.result.then(function() {
        Http.updateDepartment($scope.department).then(function(result) {
          _httpParams.limit = 10;
          _httpParams.skip = 0;
          $scope.Paging.currentPage = 0 ;
          if (200 == result.data.head.status) {
            alert('修改成功');
          }
          else{
            alert('修改失败');
          }
          getDepartmentList(_httpParams);
        })
    });
    }

    $scope.deleteDepartment = function(AdminDep) {
      var flag = confirm("确定要删除吗？");
      if (flag) {
        Http.deleteDepartment(AdminDep).then(function(result) {
          _httpParams.limit = 10;
          _httpParams.skip = 0;
          $scope.Paging.currentPage = 0 ;
          if (200 == result.data.head.status) {
            alert('删除成功');
          }
          else{
            alert('删除失败！');
          }
          $state.go("main.admin.department", {}, {
            reload: true
          });
        })
      }
    }

    //search department
    $scope.searchDepartment = function(){
      _httpParams.limit = 10;
      _httpParams.skip = 0;
      _httpParams.sysdepname = $scope.dep_name;
      if($scope.dep_name==null){
        getDepTotal();
        getDepartmentList(_httpParams);
      }else{
        Http.getDepartmentList(_httpParams).then(function(result) {
          if(result.data.head.total >=1){
            $scope.AdminDepartments = result.data.body;
            $scope.depTotal = result.data.head.total;
            $scope.Paging.totalItems =  $scope.depTotal;
          }else {
            alert("系统没有查到'"+$scope.dep_name+"'这个部门，请重新输入");
            $scope.dep_name = "";
            $state.go("main.admin.department", {}, {
              reload: true
            });
          }
        });
      }
    }

  }
])



/* HTTP */
AdminDepartment.factory('AdminDepartment.Service.Http', ['$http', 'API',
  function($http, API) {
    var path = API.path;

    function getDepartmentList(params) {
      return $http.get(
        path + '/sys_dep',{
          params:params
        }
      )
    };

    function getDepTotal() {
      return $http.get(
        path + '/sys_dep/count'
      )
    };
    function saveDepartment(data) {
      return $http.post(
        path + '/sys_dep', {
          data: data
        }
      )
    };
    function getSysDict(params){
      return $http.get(
        path + '/sys_dict', {
          params: params
        }
      )
    }
    function updateDepartment(data) {
      return $http.put(
        path + '/sys_dep' , {
          data: data
        }
      )
    }
    function deleteDepartment(data) {
      return $http.delete(
        path + '/sys_dep', {
            data: {"id":data.id}
        }
      )
    }

    return {
      getDepartmentList: getDepartmentList,
      getDepTotal: getDepTotal,
      saveDepartment: saveDepartment,
      getSysDict: getSysDict,
      updateDepartment: updateDepartment,
      deleteDepartment: deleteDepartment
    }
  }
]);

/* Component */
AdminDepartment.service('AdminDepartment.Service.Component', ['$uibModal','$state',
  function($uibModal,$state) {
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
        backdrop : 'static',
        templateUrl: templateUrl + '.html',
        scope: scope,
        size: 'md'
      });
      scope.Modal.confirm = function(isValid) {
        if (isValid) {
          modalInstance.close(scope.Modal);
        }

      };
      scope.Modal.cancel = function() {
        modalInstance.dismiss();
        $state.go("main.admin.department", {}, {
          reload: true
        });
      };
      return modalInstance;
    };

    return {
      popAlert: popAlert,
      popModal: popModal
    }
  }
])

'use strict';
var Admin = angular.module('Admin', ['ui.router','ngCookies']);

/** DepartmentReq Controller */
Admin.controller('Admin.Controller.Main', ['$cookies', '$scope', '$stateParams',
  function($cookies, $scope, $stateParams) {
       var User = JSON.parse($cookies.get('User'));
       if(User.id === "e147f177-1e83-11e6-ac02-507b9d1b58bb"){
         $scope.titleName ="用户/部门管理";
       }else{
         $scope.titleName = "用户管理";
       }
  }
])

'use strict';
var AdminUser = angular.module('Admin.User', ['ui.router','ngCookies']);

/** DepartmentReq Controller */
AdminUser.controller('Admin.User.Controller.Main', ['$cookies', '$scope', '$q', '$stateParams','AdminUser.Service.Http', 'AdminUser.Service.Component','$uibModal','$state',
  function($cookies, $scope, $q, $stateParams, Http, Component, $uibModal, $state) {
    var LoginUser = JSON.parse($cookies.get('User'));
    var dep_id = ((LoginUser.id==='e147f177-1e83-11e6-ac02-507b9d1b58bb') ? null : LoginUser.dep_id);
    var dep_name= ((LoginUser.id==='e147f177-1e83-11e6-ac02-507b9d1b58bb') ? null : LoginUser.dep_name);
    $scope.Paging = {};
    $scope.Paging.maxSize = 5;
    $scope.Paging.itemsPerPage = 10;

    var _httpParams = {};
    _httpParams.limit =10;
    _httpParams.skip = 0;
    _httpParams.dep_id = ((LoginUser.id==='e147f177-1e83-11e6-ac02-507b9d1b58bb') ? null : dep_id);
    $scope.Paging.pageChanged = function() {
      _httpParams.skip = ($scope.Paging.currentPage - 1)*_httpParams.limit;
      getUserList(_httpParams);
    }


    $scope.Modal = {}; // Clean scope of modal
    $scope.deptList = [];
    function getUserList(_httpParams) {
      Http.getUserList(_httpParams).then(function(result) {
        $scope.users = result.data.body;
      });
    }
    function getUserTotal(){
      Http.getUserTotal({
        "dep_id" : dep_id
      }).then(function(result) {
        if (LoginUser.id==='e147f177-1e83-11e6-ac02-507b9d1b58bb') {
          var tatol =  result.data.body[0].number - 1 ;
          $scope.UserTotal = tatol;
        }else {
          $scope.UserTotal = result.data.body[0].number;
        }
        $scope.Paging.totalItems = $scope.UserTotal;
      });
    }
    // init
    getUserTotal();
    getUserList(_httpParams);

    //department
    Http.getDepartmentList({
      'dep_name': dep_name
    }).then(function(result) {
      $scope.deptList = result.data.body;
    });

    $scope.placeholder = {};
    $scope.placeholder.name = "必填";
    $scope.placeholder.password = "必填";
    $scope.placeholder.password1 = "必填";
    $scope.placeholder.personName = "必填";
    $scope.placeholder.organization = "必填";
    $scope.placeholder.organization_code = "必填，根据机构名称自动生成";
    $scope.placeholder.phone = "必填";
    $scope.placeholder.email = "必填";
    $scope.placeholder.remark = "";
    // add user
    $scope.addUserModal = function() {
      $scope.Modal = {}; // Clean scope of modal
      $scope.sysUser = {}; // Clean scope of modal
      $scope.sysUser.remark = "";
      var prom = Component.popModal($scope, '添加', 'add-user-modal');
      prom.opened.then(function() {
        $scope.Modal.validUser = function (user){
          $scope.placeholder.name ="必填";
          $scope.validUser = false;
          Http.getUserList({
            "dep_id":dep_id
          }).then(function(result) {
             var users = result.data.body;
             for (var i = 0; i < users.length; i++) {
               if(users[i].username === user){
                 $scope.validUser = true;
                 $scope.placeholder.name ="用户名已存在,请重新输入";
                 $scope.sysUser.username ="";
               }
             }
          });
        }
        $scope.Modal.organization = function(){
          $scope.placeholder.organization = "必填";
          $scope.placeholder.organization_code = "必填";
          $scope.organization = false;
          var organization = $scope.sysUser.organization ;
          if(organization){
            Http.getUserOrganizationCode({
              "organization":organization
            }).then(function (result){
              if(200 == result.data.head.status){
                $scope.sysUser.organization_code = result.data.body[0].organization_code ;
              }else{
                $scope.placeholder.organization = "机构名称不对";
                $scope.organization = true;
                $scope.sysUser.organization = "";
                $scope.placeholder.organization_code = "没有相对应的机构编码";
              }
            });
          }
        }
        $scope.Modal.validPword = function (){
          $scope.placeholder.password1 ="必填";
          $scope.validPword = false;
          if($scope.sysUser.password!=$scope.sysUser.password1&&$scope.sysUser.password1!=null){
            $scope.validPword = true;
            $scope.placeholder.password1 ="两次输入的密码不同,请重新输入";
            $scope.sysUser.password1 ="";
          }
        }
        $scope.Modal.validPhone = function (){
          $scope.placeholder.phone = "必填";
          $scope.validPhone = false ;
          var reg =/^((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/;
          if(!reg.test($scope.sysUser.phone)&&($scope.sysUser.phone!=null)){
            $scope.validPhone = true ;
            $scope.placeholder.phone = "电话格式不对";
            $scope.sysUser.phone ="";
          }
        }
        $scope.Modal.validEmail = function (invalid){
          $scope.placeholder.email = "必填";
          $scope.validEmail = false ;
          if(invalid){
            $scope.validEmail = true ;
            $scope.placeholder.email = "邮箱格式不对";
            $scope.sysUser.email ="";
          }
        }

      });
      prom.result.then(function() {
        Http.saveUser($scope.sysUser).then(function(result) {
          if (200 == result.data.head.status) {
            alert('添加成功');
          }
          else{
            alert('保存数据库失败');
          }
          _httpParams.limit = 10;
          _httpParams.skip = 0;
          $scope.Paging.currentPage = 0 ;
          getUserList(_httpParams);
          getUserTotal();
        })
      });



    }
    $scope.updateUser = function(user) {
      $scope.sysUser = user;
      $scope.sysUser.password1 =0;
      $scope.sysUser.password = 0;
      $scope.sysUser.remark = ((user.remark) ?user.remark : "");
      var prom = Component.popModal($scope, '修改', 'add-user-modal');
      prom.opened.then(function() {
        $scope.Modal.validUser = function (user){
          $scope.placeholder.name ="必填";
          $scope.validUser = false;
          Http.getUserList({
            "dep_id":dep_id
          }).then(function(result) {
             var users = result.data.body;
             for (var i = 0; i < users.length; i++) {
               if(users[i].username === user){
                 $scope.validUser = true;
                 $scope.placeholder.name ="用户名已存在,请重新输入";
                 $scope.sysUser.username ="";
               }
             }
          });
        }
        $scope.Modal.organization = function(){
          $scope.placeholder.organization = "必填";
          $scope.placeholder.organization_code = "必填";
          $scope.organization = false;
          var organization = $scope.sysUser.organization ;
          if(organization){
            Http.getUserOrganizationCode({
              "organization":organization
            }).then(function (result){
              if(200 == result.data.head.status){
                $scope.sysUser.organization_code = result.data.body[0].organization_code ;
              }else{
                $scope.placeholder.organization = "机构名称不对";
                $scope.organization = true;
                $scope.sysUser.organization = "";
                $scope.placeholder.organization_code = "没有相对应的机构编码";
              }
            });
          }
        }
        $scope.Modal.validPhone = function (){
          $scope.placeholder.phone = "必填";
          $scope.validPhone = false ;
          var reg =/^((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/;
          if(!reg.test($scope.sysUser.phone)&&$scope.sysUser.phone!=null){
            $scope.validPhone = true ;
            $scope.placeholder.phone = "电话格式不对";
            $scope.sysUser.phone ="";
          }
        }
        $scope.Modal.validEmail = function (invalid){
          $scope.placeholder.email = "必填";
          $scope.validEmail = false ;
          if(invalid){
            $scope.validEmail = true ;
            $scope.placeholder.email = "邮箱格式不对";
            $scope.sysUser.email ="";
          }
        }

      });
      prom.result.then(function() {
        Http.updateUser($scope.sysUser).then(function(result) {
          _httpParams.limit = 10;
          _httpParams.skip = 0;
          $scope.Paging.currentPage = 0 ;
          if (200 == result.data.head.status) {
            alert('修改成功');
          }
          else{
            alert('修改失败');
          }
          getUserList(_httpParams);
        })
      });
    }
    $scope.deleteUser = function(user) {
      if(user.id!=LoginUser.id){
        var flag = confirm("确定要删除吗？");
        if (flag) {
          Http.deleteUser(user).then(function(result) {
            _httpParams.limit = 10;
            _httpParams.skip = 0;
            $scope.Paging.currentPage = 0 ;
            if (200 == result.data.head.status) {
              alert('删除成功');
              getUserTotal();
              getUserList(_httpParams);
            }
            else{
              alert('删除失败！');
            }
            $state.go("main.admin.user", {}, {
              reload: true
            });
          })
        }
      }else{
        alert("当前登录用户不能删除！");
      }
    }

    $scope.Password = function(user) {
      $scope.placeholder.password_1 = "必填";
      $scope.placeholder.password_2 = "必填";
      $scope.placeholder.password_3 = "必填";
      var id = 0;
      id = user.id;
      $scope.Modal.password_pre = "";
      $scope.Modal.p2 = "";
      $scope.Modal.password = "";
      $scope.password_1 = false;
      $scope.password_2 = false;
      $scope.password_3 = false;
      var prom = Component.popModal($scope, '密码', 'update-password-modal');
      prom.opened.then(function() {
        $scope.Modal.validPword1 = function (){
          $scope.password_1 = false;
          $scope.placeholder.password_1 ="必填";
          Http.validatePassword({
            "id":id,
            "password":$scope.Modal.password_pre
          }).then(function(result) {
            if(result.data.head.total == 0) {
              $scope.password_1 = true;
              $scope.placeholder.password_1 ="原密码不对,请重新输入";
              $scope.Modal.password_pre = "";
            }
          });
        }
        $scope.Modal.validPword = function (){
             $scope.password_3 = false;
             $scope.placeholder.password_3 ="必填";
             if($scope.Modal.p2!=$scope.Modal.password){
               $scope.password_3 = true;
               $scope.placeholder.password_3 = "两次输入的密码不同,请重新输入";
               $scope.Modal.password ="";
             }
        }
      });

      prom.result.then(function() {
        Http.UpdatePassword({
          "id": id,
          "password":$scope.Modal.password
        }).then(function(result) {
          if (200 == result.data.head.status) {
            alert('修改成功');
          }
          else{
            alert('修改失败');
          }
          _httpParams.limit = 10;
          _httpParams.skip = 0;
          $scope.Paging.currentPage = 0 ;
          getUserList(_httpParams);
          getUserTotal();
        })
      });
    }

    //search user
    $scope.searchUser = function(){
      _httpParams.limit = 10;
      _httpParams.skip = 0;
      _httpParams.dep_id = dep_id;
      _httpParams.sysusername = $scope.username;
      if($scope.username==null){
        getUserTotal();
        getUserList(_httpParams);
      }else{
        Http.getUserList(_httpParams).then(function(result) {
          if(result.data.head.total >= 1){
            $scope.users = result.data.body;
            $scope.UserTotal = result.data.head.total;
            $scope.Paging.totalItems = $scope.UserTotal;
          }else{
            alert("系统没有查到'"+$scope.username+"'这个用户名，请重新输入");
            $state.go("main.admin.user", {}, {
              reload: true
            });
          }
        });
      }
    }

  }
])

/* HTTP */
AdminUser.factory('AdminUser.Service.Http', ['$http', 'API',
  function($http, API) {
    var path = API.path;

    function getUserOrganizationCode(params) {
      return $http.get(
        path + '/sys_user/organization_code',{
           params: params
        }
      )
    };
    function getUserList(params) {
      return $http.get(
        path + '/sys_user',{
           params: params
        }
      )
    };
    function getUserTotal(params) {
      return $http.get(
        path + '/sys_user/count',{
           params: params
        }
      )
    };

    function getDepartmentList(params) {
      return $http.get(
        path + '/sys_dep',{
          params: params
        }
      )
    }

    function saveUser(data) {
      return $http.post(
        path + '/sys_user', {
          data: data
        }
      )
    };



    function updateUser(data) {
      return $http.put(
        path + '/sys_user' , {
          data: data
        }
      )
    }

    function deleteUser(data) {
      return $http.delete(
        path + '/sys_user', {
            data: {"id":data.id}
        }
      )
    }
    function validatePassword(params){
      return $http.get(
        path + '/sys_user/password', {
            params: params
        }
      )
    }
    function UpdatePassword(data) {
      return $http.put(
        path + '/sys_user/password' , {
          data: data
        }
      )
    }
    return {
      getUserOrganizationCode: getUserOrganizationCode,
      getUserList: getUserList,
      saveUser: saveUser,
      getDepartmentList: getDepartmentList,
      updateUser: updateUser,
      deleteUser: deleteUser,
      getUserTotal: getUserTotal,
      validatePassword: validatePassword,
      UpdatePassword: UpdatePassword
    }
  }
]);

/* Component */
AdminUser.service('AdminUser.Service.Component', ['$uibModal','$state',
  function($uibModal,$state) {
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
        backdrop : 'static',
        templateUrl: templateUrl + '.html',
        scope: scope,
        size: 'md'
      });
      scope.Modal.confirm = function(isValid) {
        if (isValid) {
          modalInstance.close(scope.Modal);
        }

      };

      scope.Modal.cancel = function() {
        modalInstance.dismiss();
        $state.go("main.admin.user", {}, {
          reload: true
        });
      };
      return modalInstance;
    };

    return {
      popAlert: popAlert,
      popModal: popModal
    }
  }
])

'use strict';
var Dashboard = angular.module('Dashboard', ['ui.router','ui.bootstrap']);

/** Dashboard Controller */
Dashboard.controller('Dashboard.Controller.Main', ['$scope', 'Dashboard.Service.Http',
  function($scope, Http) {
    <!-- Bureaus logo grid -->
    Http.getDepartments().then(function(result) {
      if (200 == result.data.head.status) {
        $scope.Bureaus = result.data.body;
      }
    });
    <!-- #Bureaus logo grid -->

    <!-- ECharts -->
    $scope.DataquotaSummary = Http.getDataquotaSummary();
    $scope.DataRequirementSummary = Http.getDataRequirementSummary();
    Http.getDataquotaSummary().then(function(result){
      $scope.SummaryDataQuota = result.data.body[0];
    })
    Http.getDataRequirementSummary().then(function(result){
      $scope.SummaryRequirement = result.data.body[0];
    })
    <!-- #ECharts -->

    <!-- DataQuota & Requirement Summary -->
    Http.getDataQuotaNew({
      skip: 0, limit: 7
    }).then(function(result) {
      if (200 == result.data.head.status) {
        $scope.NewIndicators = result.data.body;
      }
    });
    Http.getDataRequirementNew({
      skip: 0, limit: 7
    }).then(function(result) {
      if (200 == result.data.head.status) {
        $scope.Requirements = result.data.body;
      }
    });
    <!-- #DataQuota & Requirement Summary -->

    <!-- DataQuota for Concerned Departments -->
    // Handle Selected Department
    $scope.select = function(param){
      $scope.departmentID = {resource_dep_id: param};
      Http.getDataQuota({
        skip: 0, limit: 5,  dep_name: param
      }).then(function(result){
          $scope.followDepIndicators = result.data.body[0].results;
      });
    }
    // Generoted Department
    Http.getUserDep().then(function(result) {
        if (200 === result.data.head.status && result.data.body.length !== 0) {
          $scope.followDeps = result.data.body;
          return result.data.body[0].id;
        }else{
          return 0;
        }
      }).then(function(followDepId){
        Http.getDataQuota({
          skip: 0,
          limit: 5,
          dep_name: followDepId
        }).then(function(result){
          $scope.followDepIndicators = result.data.body[0].results;
        });
     });
     <!-- #DataQuota for Concerned Departments -->

 }
])

/* HTTP Factory */
Dashboard.factory('Dashboard.Service.Http', ['$http', 'API',
  function($http, API) {
    var path = API.path;
    function getDataQuotaNew(params) {
      return $http.get(
        path + '/data_resource/new', {params: params}
      )
    };
    function getDataRequirementNew(params) {
      return $http.get(
        path + '/data_requiement/new', {params: params}
      )
    };
    function getDepartments() {
      return $http.get(
        path + '/sys_dep'
      )
    };
    function getDataquotaSummary(){
      return $http.get(
        path + '/data_resource/summary'
      )
    };
    function getDataRequirementSummary(){
      return $http.get(
        path + '/data_requiement/summary'
      )
    };
    function getUserDep(params){
      return $http.get(
        path + '/department',{params: params}
      )
    };
    function getDataQuota(params){
      return $http.get(
        path + '/data_quota',{params: params}
      )
    };

    return {
      getDataQuotaNew: getDataQuotaNew,
      getDataRequirementNew: getDataRequirementNew,
      getDepartments: getDepartments,
      getDataquotaSummary: getDataquotaSummary,
      getDataRequirementSummary: getDataRequirementSummary,
      getUserDep: getUserDep,
      getDataQuota: getDataQuota
    };

  }
]);

/** Dashboard Directive */
Dashboard.directive('wiservDataQuotaOverviewChart', [
  function() {
    return {
      restrict: 'AE',
      template: "<div style='width:300;height:155px;position:relative;top:-8px'></div>",
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
                name: '资源提供部门',
                type: 'pie',
                // selectedMode: 'single',
                radius: [0, '40%'],
                label: {
                  normal: {
                    position: 'inner',
                    textStyle :{
                        color:'#FFAD38'
                      }
                  }
                },
                labelLine: {
                  normal: {
                    show: false
                  }
                },
                data: [{
                  value: summary.dep_resource,
                  name: '资源提供部门'
                }, {
                  value: summary.month_increment_dpet_resource,
                  name: '本月新增',
                  selected: true
                }]
              }, {
                name: '资源总数',
                type: 'pie',
                radius: ['60%', '75%'],
                data: [{
                  value: summary.total_resource,
                  name: '资源总数'
                }, {
                  value: summary.month_increment_resource,
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
      template: "<div style='width:300;height:155px;position:relative;top:-8px'></div>",
      link: function(scope, element, attr) {
        scope.DataRequirementSummary.then(function(result) {
          if (200 == result.data.head.status) {
            var summary = result.data.body[0];
            var myChart = echarts.init((element.find('div'))[0]);
            var option = {
              tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)"
              },
              series: [{
                name: '需求涉及部门',
                type: 'pie',
                // selectedMode: 'single',
                radius: [0, '40%'],
                label: {
                  normal: {
                    position: 'inner',
                    textStyle :{
                        color:'#FFAD38'
                      }
                  }
                },
                labelLine: {
                  normal: {
                    show: false
                  }
                },
                data: [{
                  value: summary.department_number,
                  name: '需求涉及部门'
                }, {
                  value: summary.department_number_inc,
                  name: '本月新增',
                  selected: true
                }]
              }, {
                name: '需求总数',
                type: 'pie',
                radius: ['60%', '75%'],
                data: [{
                  value: summary.requiement_number,
                  name: '需求总数'
                }, {
                  value: summary.requiement_number_inc,
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
              data: ['资源', '需求']
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
              name: '资源',
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

'use strict';
var Login = angular.module('Login', ['ui.router', 'ngCookies']);

/** Main Controller */
Login.controller('Login.Controller.Main', ['$rootScope', '$cookies', '$scope', '$state', 'Login.Service.Http',
  function($rootScope, $cookies, $scope, $state, Http) {
    // Decide login or session delay
    if(sessionStorage.message){
      $scope.alerts = [
        {type: 'danger', msg: sessionStorage.message}
      ];
      $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
      };
      sessionStorage.removeItem('message');
    }
    // Login validation
    $scope.Login = {};
    $scope.Login.submit = function(valid) {
      $scope.loginSubmitted = false;
      if (valid) {
        var username = $scope.Login.username;
        var password = $scope.Login.password;
        Http.login({
          username: username,
          password: password
        }).then(function(result) {
          var loginUser = result.data.body[0];
          $rootScope.User = loginUser;
          $cookies.put('User', JSON.stringify(loginUser));
          console.log(JSON.stringify(loginUser));
          var sessionToken = result.data.head.token;
          if(sessionToken){
            sessionStorage.token = sessionToken;
          }
          if (200 == result.data.head.status) {
            $state.go("main.dashboard");
          } else {
            $scope.loginError = true;
          }
        });
      } else {
        $scope.loginSubmitted = true;
      }
    }
  }
]);

/* HTTP Factory */
Login.factory('Login.Service.Http', ['$http', 'API',
  function($http, API) {
    var path = API.path;
    function login(params) {
      return $http.get(
        path + '/login', {
          params: params
        }
      )
    };
    return {
      login: login
    }
  }
]);

'use strict';
var Main = angular.module('Main', ['ui.router', 'ngCookies']);

/** Main Controller */
Main.controller('Main.Controller.Main', ['$scope', '$cookies',
  function($scope, $cookies) {
    $scope.User = JSON.parse($cookies.get('User'));
  }
]);

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
    return {
      getDataQuotaDetailByDepID: getDataQuotaDetailByDepID,
      getDataQuotaExampleByDepID: getDataQuotaExampleByDepID
    }
  }
]);

'use strict';
var DataQuotaList = angular.module('DataQuotaList', ['ui.router']);

/** Main Controller */
DataQuotaList.controller('DataQuotaList.Controller.Main', ['$scope', '$state', 'DataQuotaList.Service.Http', '$stateParams',
  function($scope, $state, Http, StateParams) {
    // Get the parameters form ui-router
    var currentDepID = {resource_dep_id:StateParams.resource_dep_id};
    var currentDepName = {dep_name:StateParams.dep_name};
    // Selected department name
    $scope.currentDep = currentDepName.dep_name;
    // Params for pagin
    var initPaging = {limit:10, skip: 0};
    $scope.Paging = {};
    $scope.Paging.currentPage = 1;
    $scope.Paging.itemsPerPage = 10;
    $scope.Paging.pageChanged = function() {
      var httpParams = {};
      _.assign(httpParams, currentDepID, {limit:10, skip: ($scope.Paging.currentPage-1) * 10});
      getDataQuotaList(httpParams);
    };
    // Get data quota list
    function getDataQuotaList(_httpParams){
      Http.getDataQuota(_httpParams).then(function(result) {
        $scope.DataQuotas = result.data.body[0].results;
        $scope.DataQuotasTotal = result.data.body[0].count;
        $scope.Paging.totalItems = result.data.body[0].count;
      });
    };
    // Init data quota talbe
    (function initDataQuotaList(){
        /* Init selected status for filter */
        $scope.resourceFormatActiveAll = $scope.ShareLevelActiveAll = $scope.openToSocietyActiveAll = $scope.ShareFrequencyActiveAll = $scope.DataLevelActiveAll = $scope.isScretActiveAll= 'active';
        /* Init ajax parameters*/
        var httpParams = {};
        (currentDepID==='') ? (httpParams = initPaging) : (httpParams = _.assign(httpParams, currentDepID, initPaging));
        getDataQuotaList(httpParams);
    })();
    // Fetch data quota list by filter
    function getDataQuotaListByFilter(params){
      var httpParams = {};
      (currentDepID.dep_name==='') ? (httpParams = initPaging) : (httpParams = _.assign(httpParams, currentDepID, initPaging));
      _.assign(httpParams, params);
      getDataQuotaList(httpParams);
    };
    // Search for Data Quota Name
    $scope.Retrieval = function(){
      var httpParams = {};
      var searchTarget = {resource_name: $scope.TargetDataQuotaName};
      (currentDepID==='') ? (_.assign(httpParams, initPaging, searchTarget)) : (_.assign(httpParams, currentDepID, initPaging, searchTarget));
      getDataQuotaList(httpParams);
    };
    // Data quota apply info
    $scope.DataQuotaApplyInfo = function(data_quota_id) {
      Http.getDataQuotaApplyInfo({info_resource_id: data_quota_id}).then(function() {
        alert('申请查看成功');
        var httpParams = {};
        _.assign(httpParams, {limit:10, skip: ($scope.Paging.currentPage-1) * 10});
        getDataQuotaList(httpParams);
      });
    };
    // Filter generator
    var SHARE_FREQUENCY = 1, //更新周期
        DATA_LEVEL = 2, //分地区数据级别
        SHARE_LEVEL = 3, //共享级别
        RESOURCE_FORMAT = 11, //信息资源格式
        SOCIAL_OPEN_FLAG  = 14, //面向社会开放
        SECRET_FLAG = 5  //是否涉密
    Http.getSystemDictByCatagory({
      'dict_category': RESOURCE_FORMAT
    }).then(function(result) {
      $scope.resourceFormats = result.data.body;
    });
    Http.getSystemDictByCatagory({
      'dict_category': SOCIAL_OPEN_FLAG
    }).then(function(result) {
      $scope.openToSocietys = result.data.body;
    });
    Http.getSystemDictByCatagory({
      'dict_category': SECRET_FLAG
    }).then(function(result) {
      $scope.isScrets = result.data.body;
    });
    Http.getSystemDictByCatagory({
      'dict_category': SHARE_LEVEL
    }).then(function(result) {
      $scope.ShareLevels = result.data.body;
    });
    Http.getSystemDictByCatagory({
      'dict_category': SHARE_FREQUENCY
    }).then(function(result) {
      $scope.ShareFrequencys = result.data.body;
    });
    Http.getSystemDictByCatagory({
      'dict_category': DATA_LEVEL
    }).then(function(result) {
      $scope.DataLevels = result.data.body;
    });
    // Handle above filter
    var filterParams = {};

    /*信息资源格式*/
    $scope.resourceFormatFilter = function(id, index){
      $scope.resourceFormatActive = [];
      $scope.resourceFormatActiveAll = '';
      $scope.resourceFormatActive[index] = 'active';
      filterParams.re_format = id;
      if('ALL'===id){
        delete filterParams.re_format;
        $scope.resourceFormatActiveAll = 'active';
        getDataQuotaListByFilter(filterParams);
      }else{
        getDataQuotaListByFilter(filterParams);
      }
    };
    /* 共享级别 */
    $scope.ShareLevelFilter = function(id, index){
      $scope.ShareLevelActive = [];
      $scope.ShareLevelActiveAll = '';
      $scope.ShareLevelActive[index] = 'active';
      filterParams.share_level = id;
      if('ALL'===id){
        delete filterParams.share_level;
        $scope.ShareLevelActiveAll = 'active';
        getDataQuotaListByFilter(filterParams);
      }else{
        getDataQuotaListByFilter(filterParams);
      }
    };

    /*面向社会开放*/
    $scope.openToSocietyFilter = function(id, index){
      $scope.openToSocietyActive = [];
      $scope.openToSocietyActiveAll = '';
      $scope.openToSocietyActive[index] = 'active';
      filterParams.social_open_flag = id;
      if('ALL'===id){
        delete filterParams.social_open_flag;
        $scope.openToSocietyActiveAll = 'active';
        getDataQuotaListByFilter(filterParams);
      }else{
        getDataQuotaListByFilter(filterParams);
      }
    };
    /* 更新周期（共享频率） */
    filterParams.update_period = [];
    $scope.ShareFrequencyActive = [];
    $scope.ShareFrequencyFilter = function(id, index){
      if('ALL'===id){
        filterParams.update_period = [];
        $scope.ShareFrequencyActiveAll = 'active';
        $scope.ShareFrequencyActive = [];
        getDataQuotaListByFilter(filterParams);
      }else{
        $scope.ShareFrequencyActiveAll = '';
        ($scope.ShareFrequencyActive[index]==='active')?($scope.ShareFrequencyActive[index]=''):($scope.ShareFrequencyActive[index]='active');
        filterParams.update_period.push(id);
        getDataQuotaListByFilter(filterParams);
      }
    };

    /* 分地区数据级别 */
    filterParams.area_level = [];
    $scope.DataLevelActive = [];
    $scope.DataLevelFilter = function(id, index){
      if('ALL'===id){
        filterParams.area_level = [];
        $scope.DataLevelActiveAll = 'active';
        $scope.DataLevelActive=[];
        getDataQuotaListByFilter(filterParams);
      }else{
        $scope.DataLevelActiveAll = '';
        ($scope.DataLevelActive[index]==='active')?($scope.DataLevelActive[index]=''):($scope.DataLevelActive[index]='active');
        filterParams.area_level.push(id);
        getDataQuotaListByFilter(filterParams);
      };
    };
    /*是否涉密*/
    $scope.isScretFilter = function(id, index){
      $scope.isScretActive = [];
      $scope.isScretActiveAll = '';
      $scope.isScretActive[index] = 'active';
      filterParams.issecret = id;
      if('ALL'===id){
        delete filterParams.issecret;
        $scope.isScretActiveAll = 'active';
        getDataQuotaListByFilter(filterParams);
      }else{
        getDataQuotaListByFilter(filterParams);
      }
    };

  }
]);


/* HTTP Factory */
DataQuotaList.factory('DataQuotaList.Service.Http', ['$http', 'API',
  function($http, API) {
    var path = API.path;
    function getSystemDictByCatagory(params) {
      return $http.get(
        path + '/sys_dict', { params: params }
      )
    };
    function getDataQuota(params){
      return $http.get(
        path + '/resource/sys_dict', { params: params }
      )
    };
    function getDataQuotaApplyInfo(data){
      return $http.post(
        path + '/info_resource_apply_info', { data: data }
      )
    };
    return {
      getSystemDictByCatagory: getSystemDictByCatagory,
      getDataQuotaApplyInfo: getDataQuotaApplyInfo,
      getDataQuota: getDataQuota
    }
  }
]);

'use strict';
var DataQuota = angular.module('DataQuota', ['ui.router']);

/** Main Controller */
DataQuota.controller('DataQuota.Controller.Main', ['$scope', '$state', 'DataQuota.Service.Http',
  function($scope, $state, Http) {
    window.scrollTo(0,0);
    // Menu configration
    $scope.treeOptions = {
      nodeChildren: "nodes",
      dirSelectable: false,
      injectClasses: {
        ul: "a1",
        li: "a2",
        liSelected: "a7",
        iExpanded: "a3",
        iCollapsed: "a4",
        iLeaf: "a5",
        label: "a6",
        labelSelected: "a8"
      }
    }
    // Menu Generator
    Http.menu().then(function(result) {
      if (200 === result.data.head.status) {
        $scope.list = result.data.body;
      }
    })
  }
]);

/* DataQuota Http Factory */
DataQuota.factory('DataQuota.Service.Http', ['$http', 'API',
  function($http, API) {
    var path = API.path;

    function menu(params) {
      return $http.get(
        path + '/menu', { params: params }
      )
    };
    return {
      menu: menu
    }
  }
]);

'use strict';
var Audit = angular.module('Department.Audit', ['ui.router']);

/** Main Controller */
Audit.controller('Department.Audit.Controller.Main', ['$scope', '$q', 'Department.Audit.Service.Http',
  function($scope, $q, Http) {
    $scope.InfoResource = {};

    $scope.Paging = {};
    $scope.Paging.maxSize = 5;
    $scope.Paging.itemsPerPage = 10;

    var _httpParams = {};
    _httpParams.limit = 10;
    _httpParams.skip = 0;

    $scope.Paging.pageChanged = function() {
      _httpParams.skip = ($scope.Paging.currentPage - 1)*_httpParams.limit;
      getAuditList(_httpParams);
    }

    // init
    getAuditList();

    function getAuditList() {
      $scope.auditPromise = Http.getAuditList(_httpParams).then(function(result) {
        $scope.auditList = result.data.body[0].results;
        $scope.Paging.totalItems = result.data.body[0].count;
      });
    }

    $scope.searchInfoResourceByName = function() {
      _httpParams.resource_name = $scope.InfoResource.resource_name_filter;
      _httpParams.limit = 10;
      _httpParams.skip = 0;
      getAuditList();
    }


  }
])


Audit.controller('Department.Audit.Controller.info', ['$scope', '$state', '$q', 'Department.Audit.Service.Http', '$stateParams',
  function( $scope, $state, $q, Http, $stateParams) {
    $scope.TabItemShow = true;
    $scope.TabRequireShow = true;
    $scope.AuditInfo = {};
    $scope.AuditInfo.audit_opinion = '';
    console.log($stateParams.item);
    // get audit detail by id
    $scope.InfoResourceDetail = $stateParams.item;
    $scope.InfoItemShow = false;
    Http.getInfoItemList({
      resource_id: $scope.InfoResourceDetail.id
    }).then(function(result) {
      if (result.data.body.length == 0) {
        $scope.InfoItemShow = false;
      } else {
        $scope.InfoItemShow = true;
        $scope.InfoItems = result.data.body;
      }
    })


    $scope.submitAudit = function() {
      console.log($scope.AuditInfo.audit_status);
      if(!$scope.AuditInfo.audit_status) {
        $scope.auditError = true;
        return;
      }
      $scope.AuditInfo.audit_id = $stateParams.item.audit_id;
      Http.updateAuditDetail($scope.AuditInfo).then(function(result) {
        if (200 == result.data.head.status) {
          alert('审核成功');
          $state.go("main.department.audit", {}, {
            reload: true
          });
        } else {
          alert('审核失败');
        }
      });
    }
  }
])

/* HTTP */
Audit.factory('Department.Audit.Service.Http', ['$http', '$q', 'API',
  function($http, $q, API) {
    var path = API.path;

    function getAuditList(params) {
      return $http.get(
        path + '/openinfo_resourcelist', {
          params: params
        }
      )
    }

    function getInfoResourceDetail(params) {
      return $http.get(
        path + '/data_quota_detail', {
          params: params
        }
      )
    }

    function updateAuditDetail(data) {
      return $http.put(
        path + '/openinfo_resourceok', {
          data: data
        }
      )
    }

    function getQuotaRequirement(params) {
      return $http.get(
        path + '/requiement_detail', {
          params: params
        }
      )
    }
    function getInfoItemList(params) {
      return $http.get(
        path + '/item_detail', {
          params: params
        }
      )
    }
    return {
      getAuditList: getAuditList,
      getInfoResourceDetail: getInfoResourceDetail,
      updateAuditDetail: updateAuditDetail,
      getQuotaRequirement: getQuotaRequirement,
      getInfoItemList: getInfoItemList
    }
  }
]);

'use strict';
var DInventory = angular.module('Department.Inventory', ['ui.router', 'ngCookies', 'cgBusy']);

/** Inventory Controller */
DInventory.controller('Department.Inventory.Controller.Main', ['$cookies', '$scope', '$q', 'Department.Inventory.Service.Http',
  function($cookies, $scope, $q, Http) {
    var SHARE_FREQUENCY = 1;
    var DATA_LEVEL = 2;
    var SHARE_LEVEL = 3;
    var SECRET_FLAG = 5;
    var RESOURCE_FORMAT = 11;
    var SOCIAL_OPEN_FLAG = 14;

    var LoginUser = JSON.parse($cookies.get('User'));
    var DEP_NAME = LoginUser.dep_id;
    $scope.DepartInfoResource = {};

    $scope.Paging = {};
    $scope.Paging.maxSize = 5;
    $scope.Paging.itemsPerPage = 10;

    var _httpParams = {};
    _httpParams.limit = 10;
    _httpParams.skip = 0;

    Http.getSystemDictByCatagory({
      'dict_category': SECRET_FLAG
    }).then(function(result) {
      $scope.secretFlagList = result.data.body;
    });

    // Get system dict
    Http.getSystemDictByCatagory({
      'dict_category': SHARE_FREQUENCY
    }).then(function(result) {
      $scope.shareFrequencyList = result.data.body;
    });

    Http.getSystemDictByCatagory({
      'dict_category': SHARE_LEVEL
    }).then(function(result) {
      $scope.shareLevelList = result.data.body;
    });

    Http.getSystemDictByCatagory({
      'dict_category': RESOURCE_FORMAT
    }).then(function(result) {
      $scope.resourceFormatList = result.data.body;
    });

    Http.getSystemDictByCatagory({
      'dict_category': DATA_LEVEL
    }).then(function(result) {
      $scope.dataLevelList = result.data.body;
    });

    Http.getSystemDictByCatagory({
      'dict_category': SOCIAL_OPEN_FLAG
    }).then(function(result) {
      $scope.socialOpenList = result.data.body;
    });

    $scope.Paging.pageChanged = function() {
      _httpParams.skip = ($scope.Paging.currentPage - 1) * _httpParams.limit;
      getDeptInfoResourceList(_httpParams);
    }

    function getDeptInfoResourceList(_httpParams) {
      //_httpParams.dep_name = DEP_NAME;
      $scope.promise = Http.getDepartInfoResList(_httpParams).then(function(result) {
        console.log(result);
        $scope.infoResourceList = result.data.body[0].results;
        $scope.Paging.totalItems = result.data.body[0].count;
      });
    }


    //init
    getDeptInfoResourceList(_httpParams);

    // resource format all
    $scope.getResFormatAll = function() {
      $scope.resFormatMainSelection = [];
      _httpParams.re_format = null;
      _httpParams.limit = 10;
      _httpParams.skip = 0;
      getDeptInfoResourceList(_httpParams);
    }

    // share level all
    $scope.getShareLevelAll = function() {
      $scope.shareLvMainSelection = [];
      _httpParams.share_level = null;
      _httpParams.limit = 10;
      _httpParams.skip = 0;
      getDeptInfoResourceList(_httpParams);
    }

    // social open all
    $scope.getSocialOpenAll = function() {
      $scope.socialOpenMainSelection = [];
      _httpParams.social_open_flag = null;
      _httpParams.limit = 10;
      _httpParams.skip = 0;
      getDeptInfoResourceList(_httpParams);
    }

    // share frequency all
    $scope.getShareFreqAll = function() {
      $scope.shareFreqSelection = [];
      _httpParams.update_period = null;
      _httpParams.limit = 10;
      _httpParams.skip = 0;
      getDeptInfoResourceList(_httpParams);
    }

    // secret flag all
    $scope.getSecretFlagAll = function() {
      $scope.secretFlagMainSelection = [];
      _httpParams.issecret = null;
      _httpParams.limit = 10;
      _httpParams.skip = 0;
      getDeptInfoResourceList(_httpParams);
    }

    // filter by resource format
    $scope.resFormatMainSelection = [];
    $scope.getInfoResourceByResFormat = function(item) {
      var idx = $scope.shareFreqSelection.indexOf(item.id);
      if (idx > -1) {
        $scope.resFormatMainSelection = [];
      } else {
        $scope.resFormatMainSelection = item.id;
      }
      _httpParams.re_format = $scope.resFormatMainSelection;
      _httpParams.limit = 10;
      _httpParams.skip = 0;
      getDeptInfoResourceList(_httpParams);
    }

    // filter by share frequency
    $scope.shareFreqSelection = [];
    $scope.getInfoResourceListBySF = function(item) {
      var idx = $scope.shareFreqSelection.indexOf(item.id);
      if (idx > -1) {
        $scope.shareFreqSelection = [];
      } else {
        $scope.shareFreqSelection = item.id;
      }
      _httpParams.update_period = $scope.shareFreqSelection;
      _httpParams.limit = 10;
      _httpParams.skip = 0;
      getDeptInfoResourceList(_httpParams);
    }

    // filter by share level
    $scope.shareLvMainSelection = [];
    $scope.getInfoResourceListBySl = function(item) {
      var idx = $scope.shareLvMainSelection.indexOf(item.id);
      if (idx > -1) {
        $scope.shareLvMainSelection = [];
      } else {
        $scope.shareLvMainSelection = item.id;
      }
      _httpParams.share_level = $scope.shareLvMainSelection;
      _httpParams.limit = 10;
      _httpParams.skip = 0;
      getDeptInfoResourceList(_httpParams);
    }

    // filter by social open flag
    $scope.socialOpenMainSelection = [];
    $scope.getInfoResourceListBySO = function(item) {
      var idx = $scope.socialOpenMainSelection.indexOf(item.dict_code);
      if (idx > -1) {
        $scope.socialOpenMainSelection = [];
      } else {
        $scope.socialOpenMainSelection = item.dict_code;
      }
      _httpParams.social_open_flag = $scope.socialOpenMainSelection;
      _httpParams.limit = 10;
      _httpParams.skip = 0;
      getDeptInfoResourceList(_httpParams);
    }

    // filter by secret flag
    $scope.secretFlagMainSelection = [];
    $scope.getInfoResourceListBySecFlag = function(item) {
      var idx = $scope.secretFlagMainSelection.indexOf(item.id);
      if (idx > -1) {
        $scope.secretFlagMainSelection = [];
      } else {
        $scope.secretFlagMainSelection = item.id;
      }
      _httpParams.issecret = $scope.secretFlagMainSelection;
      _httpParams.limit = 10;
      _httpParams.skip = 0;
      getDeptInfoResourceList(_httpParams);
    }


    // get spatial all
    $scope.getSpatialAll = function() {
      $scope.areaMainSelection = [];
      _httpParams.area_level = null;
      _httpParams.limit = 10;
      _httpParams.skip = 0;
      getDeptInfoResourceList(_httpParams);
    }

    // filter by partial
    $scope.areaMainSelection = [];
    $scope.getInfoResourceListByAP = function(item) {
      var idx = $scope.areaMainSelection.indexOf(item.id);
      // is currently selected
      if (idx > -1) {
        $scope.areaMainSelection.splice(idx, 1);
      }
      // is newly selected
      else {
        $scope.areaMainSelection.push(item.id);
      }

      _httpParams.area_level = $scope.areaMainSelection;
      _httpParams.limit = 10;
      _httpParams.skip = 0;
      getDeptInfoResourceList(_httpParams);
    }

    // search by name
    $scope.searchDeptInfoResourceByName = function() {
      _httpParams.resource_name = $scope.DepartInfoResource.resource_name_filter;
      _httpParams.limit = 10;
      _httpParams.skip = 0;
      getDeptInfoResourceList(_httpParams);
    }

    // delete info resource
    $scope.deleteInfoResource = function(resourceId) {
      var deleteConfirm = confirm('确定删除本条信息资源？删除后将不可恢复。');
      if (deleteConfirm) {
        Http.deleteInfoResource({
          resourceid: resourceId
        }).then(function(result) {
          if (200 == result.data.head.status) {
            alert('删除成功！');
            getDeptInfoResourceList(_httpParams);
          } else {
            alert('删除失败');
          }
        })
      }
    }


  }
])

/** Inventory Controller */
DInventory.controller('Department.Inventory.Controller.detail', ['$scope', '$q', 'Department.Inventory.Service.Http', '$stateParams', '$state',
  function($scope, $q, Http, $stateParams, $state) {
    console.log($stateParams.item);
    $scope.InfoResourceDetail = $stateParams.item;
    $scope.InfoItemShow = false;
    Http.getInfoItemList({
      resource_id: $scope.InfoResourceDetail.id
    }).then(function(result) {
      if (result.data.body.length == 0) {
        $scope.InfoItemShow = false;
      } else {
        $scope.InfoItemShow = true;
        $scope.InfoItems = result.data.body;
      }


    })
  }
])

DInventory.controller('Department.Inventory.Controller.publish', ['$cookies', '$scope', '$stateParams', '$state', '$q', '$uibModal', 'Department.Inventory.Service.Component', 'Department.Inventory.Service.Http',
  function($cookies, $scope, $stateParams, $state, $q, $uibModal, Component, Http) {
    var RESOURCE_CATEGORY = 10;
    var SHARE_TYPE = 12;
    var SHARE_METHOD = 13;
    var ITEM_TYPE = 15;
    var LEVEL_AUTH = '250375bd-02f0-11e6-a52a-5cf9dd40ad7e'; // 授权开放
    var LEVEL_ALL_OPEN = '2501e32c-02f0-11e6-a52a-5cf9dd40ad7e'; // 全开放
    var RESOURCE_FORMAT_DATA = 'aaee8194-2614-11e6-a9e9-507b9d1b58bb';
    var RESOURCE_FORMAT_OTHER = 'ab11fdd4-2614-11e6-a9e9-507b9d1b58bb';
    var SHARE_METHOD_OTHER = 'd8d61ff3-2616-11e6-a9e9-507b9d1b58bb';

    var LoginUser = JSON.parse($cookies.get('User'));
    var DEP_ID = LoginUser.dep_id;
    $scope.DEP_NAME = LoginUser.dep_name;
    $scope.ORG_NAME = LoginUser.organization;
    $scope.ORG_CODE = LoginUser.organization_code;
    $scope.InfoResource = {};
    $scope.InfoResource.alias = '';
    $scope.InfoResource.rel_category = '';
    $scope.InfoResource.secret_flag = '';
    $scope.InfoResource.meter_unit = "";
    $scope.InfoResource.calculate_method = '';
    $scope.InfoResource.resource_format_other = '';
    $scope.InfoResource.share_method_other = '';
    $scope.InfoResource.social_open_limit = '';
    $scope.InfoResource.linkman = '';
    $scope.InfoResource.contact_phone = '';
    // item list
    $scope.ResourceItemList = [];
    $scope.ResourceItemConfigList = [];

    // resource name duplicate check
    $scope.resNameExist = false;
    $scope.checkResName = function() {
      if($scope.InfoResource.resource_name && $scope.InfoResource.resource_name != '') {
        Http.checkResName({
          resource_name: $scope.InfoResource.resource_name
        }).then(function(res) {
          if(res.data.body[0].isexists == 'true') {
            $scope.resNameExist = true;
          }
          else{
            $scope.resNameExist = false;
          }
        })
      }

    }
    $scope.parent = {};
    $scope.parent.itemNameExist = false;
    $scope.checkItemName = function() {
      if($scope.ResourceItem.item_name && $scope.ResourceItem.item_name != '') {
        Http.checkItemName({
          item_name: $scope.ResourceItem.item_name
        }).then(function(res) {
          if(res.data.body[0].isexists == 'true') {
            $scope.parent.itemNameExist = true;
          }
          else{
            $scope.parent.itemNameExist = false;
          }
        })
      }

    }

    Http.getDepartmentList().then(function(result) {
      $scope.deptList = result.data.body;
      var evens = _.remove($scope.deptList, function(item) {
        return item.id == DEP_ID;
      });
    });

    Http.getSystemDictByCatagory({
      'dict_category': RESOURCE_CATEGORY
    }).then(function(result) {
      $scope.resourceCategoryList = result.data.body;
    });

    Http.getSystemDictByCatagory({
      'dict_category': SHARE_TYPE
    }).then(function(result) {
      $scope.shareTypeList = result.data.body;
    });

    Http.getSystemDictByCatagory({
      'dict_category': SHARE_METHOD
    }).then(function(result) {
      $scope.shareMethodList = result.data.body;
    });

    Http.getSystemDictByCatagory({
      'dict_category': ITEM_TYPE
    }).then(function(result) {
      $scope.itemTypeList = result.data.body;
    });

    $scope.close = function(isValid) {
      $state.go("main.department.inventory", {}, {
        reload: true
      });
    }

    // submit add
    $scope.addInfoResource = function(isValid) {
      $scope.submitted = true;
      var InfoResourceAddObj = {};
      var InfoResource_RelationConfig = [];
      var InfoResourceApplyInfo = [];
      var InfoItem_RelationConfig = [];
      if($scope.resNameExist) {
        isValid = false;
      }
      if ($scope.shareFreqSelection.length == 0 && !$scope.resItemAddBtn) { // 未选择更新周期
        isValid = false;
      }
      if ($scope.resItemAddBtn && ($scope.ResourceItemList.length == 0)) { // 未添加信息项
        isValid = false;
      }

      if (isValid) {
        InfoResourceAddObj.InfoResource = $scope.InfoResource;
        _($scope.dataLevelSelection).forEach(function(value) {
          var sys_dict = {};
          sys_dict.InfoResourceId = $scope.InfoResource.resource_name;
          sys_dict.sys_dict_id = value;
          InfoResource_RelationConfig.push(sys_dict);
        });

        _($scope.shareFreqSelection).forEach(function(value) {
          var sys_dict = {};
          sys_dict.InfoResourceId = $scope.InfoResource.resource_name;
          sys_dict.sys_dict_id = value;
          sys_dict.obj_type = 1;
          InfoResource_RelationConfig.push(sys_dict);
        });

        var shareDeps = _.map($scope.outputDeptList, 'id');
        _(shareDeps).forEach(function(value) {
          var share_dep = {};
          share_dep.InfoResourceId = $scope.InfoResource.resource_name;
          share_dep.apply_dep = value;
          InfoResourceApplyInfo.push(share_dep);
        });
        _($scope.ResourceItemList).forEach(function(item, index) {
          console.log(index);
          item.item_ord = index;
          item.InfoResourceId = $scope.InfoResource.resource_name;
          console.log($scope.ResourceItemList);
        })

        InfoResourceAddObj.InfoResource_RelationConfig = InfoResource_RelationConfig;
        InfoResourceAddObj.InfoResourceApplyInfo = InfoResourceApplyInfo;
        InfoResourceAddObj.InfoItem_RelationConfig = $scope.ResourceItemConfigList;
        InfoResourceAddObj.InfoItem = $scope.ResourceItemList;

        console.log(InfoResourceAddObj);
        Http.saveInfoResource(InfoResourceAddObj).then(function(result) {
          console.log(result.data);
          if (200 == result.data.head.status) {
            $scope.Modal = {};
            $state.go("main.department.inventory", {}, {
              reload: true
            });

          } else {
            alert('保存失败');
          }
        })
      } else {
        return;
      }
    }


    // submit update
    console.log($stateParams.item);
    $scope.resItemUpdateBtn = false;
    if ($stateParams.item) { // 选择修改
      $scope.InfoResource = $stateParams.item;

      // 获取资源分地区数据级别
      Http.getResourceAreaLevel({
        resource_id: $scope.InfoResource.id
      }).then(function(res) {
        $scope.dataLevelSelection = res.data.body[0].id;
      })

      // 获取资源更新周期
      Http.getResourceUpdatePeriod({
        resource_id: $scope.InfoResource.id
      }).then(function(res) {
        $scope.shareFreqSelection = res.data.body[0].id;
      })

      // 获取指定开放部门列表
      Http.getResourceShareDeps({
        resource_id: $scope.InfoResource.id
      }).then(function(res) {
        var authDepts = res.data.body[0].id;
        if (authDepts.length > 0) {
          $scope.depShow = true;
        }
        _($scope.deptList).forEach(function(allItem) {
          _(authDepts).forEach(function(authItem) {
            if (allItem.id == authItem) {
              allItem.ticked = true;
              $scope.outputDeptList.push(allItem);
            }
          })
        });
      })

      // 选中数据库类
      if (RESOURCE_FORMAT_DATA == $scope.InfoResource.resource_format) {
        $scope.resItemUpdateBtn = true;
      }
    }


    $scope.updateInfoResource = function(isValid) {
      $scope.submitted = true;
      var InfoResourceAddObj = {};
      var InfoResource_RelationConfig = [];
      var InfoResourceApplyInfo = [];
      var InfoItem_RelationConfig = [];
      if($scope.resNameExist) {
        isValid = false;
      }
      if ($scope.shareFreqSelection.length == 0 && !$scope.resItemUpdateBtn) { // 未选择更新周期
        isValid = false;
      }
      if ($scope.resItemAddBtn && ($scope.ResourceItemList.length == 0)) { // 未添加信息项
        isValid = false;
      }

      if (isValid) {
        InfoResourceAddObj.InfoResource = $scope.InfoResource;
        _($scope.dataLevelSelection).forEach(function(value) {
          var sys_dict = {};
          sys_dict.InfoResourceId = $scope.InfoResource.id;
          sys_dict.sys_dict_id = value;
          InfoResource_RelationConfig.push(sys_dict);
        });

        _($scope.shareFreqSelection).forEach(function(value) {
          var sys_dict = {};
          sys_dict.InfoResourceId = $scope.InfoResource.id;
          sys_dict.sys_dict_id = value;
          sys_dict.obj_type = 1;
          InfoResource_RelationConfig.push(sys_dict);
        });

        var shareDeps = _.map($scope.outputDeptList, 'id');
        _(shareDeps).forEach(function(value) {
          var share_dep = {};
          share_dep.InfoResourceId = $scope.InfoResource.id;
          share_dep.apply_dep = value;
          InfoResourceApplyInfo.push(share_dep);
        });
        _($scope.ResourceItemList).forEach(function(item, index) {
          console.log(index);
          item.item_ord = index;
          item.InfoResourceId = $scope.InfoResource.id;
          console.log($scope.ResourceItemList);
        })

        InfoResourceAddObj.InfoResource_RelationConfig = InfoResource_RelationConfig;
        InfoResourceAddObj.InfoResourceApplyInfo = InfoResourceApplyInfo;
        InfoResourceAddObj.InfoItem_RelationConfig = $scope.ResourceItemConfigList;
        InfoResourceAddObj.InfoItem = $scope.ResourceItemList;

        console.log(InfoResourceAddObj);
        Http.updateInfoResource(InfoResourceAddObj).then(function(result) {
          console.log(result.data);
          if (200 == result.data.head.status) {
            alert('保存成功！');
            $scope.Modal = {};
            $state.go("main.department.inventory", {}, {
              reload: true
            });

          } else {
            alert('保存失败');
          }
          // 清空多选项
          $scope.dataLevelSelection = [];
          $scope.shareFreqSelection = [];
        })
      } else {
        return;
      }
    }

    $scope.editItems = function(id) {
      Http.getInfoItemList({
        resource_id: id
      }).then(function(result) {
        $scope.ResourceItemList = result.data.body;
        // 拼接信息资源所有信息项的多选项
        _($scope.ResourceItemList).forEach(function(item) {
          var itemConfig = {};
          itemConfig.InfoItemId = item.item_name;
          var shareFreqDictName = [];
          _(item.config).forEach(function(config) {
            itemConfig.sys_dict_id = config.id;
            shareFreqDictName.push(config.dict_name);
            $scope.ResourceItemConfigList.push(itemConfig);
          })
          item.update_period_name = shareFreqDictName;
        })
        console.log($scope.ResourceItemConfigList);
      })
      $scope.ResItemListShow = true;
    }

    $scope.addResourceItem = function(type) {
      $scope.shareFreqEmpty = false;
      $scope.Modal = {};
      $scope.itemAdded = false;
      $scope.ResourceItem = {};
      $scope.ResourceItem.meter_unit = '';
      $scope.ResourceItem.calculate_method = '';
      $scope.ResourceItem.shareFreqItemSelection = [];
      $scope.ResourceItem.shareFreqItemObjSelection = [];
      $scope.parent.itemNameExist = false;

      $scope.data = {};
      $scope.data.item_type = $scope.itemTypeList[0];
      $scope.data.secret_flag = $scope.secretFlagList[0];

      $scope.$watch('data.item_type', function(n) {
        $scope.ResourceItem.item_type = n.id;
        $scope.ResourceItem.item_type_name = n.dict_name;
      })

      $scope.$watch('data.secret_flag', function(n) {
        $scope.ResourceItem.secret_flag = n.id;
        $scope.ResourceItem.secret_flag_name = n.dict_name;
      })

      Component.popModal($scope, 'Department.Inventory.Controller.publish', '新增', 'item-add-modal').result.then(function(res) {
        console.log($scope.ResourceItem);
        $scope.itemAdded = false;
        console.log(type);
        // if(type == 2) {// 新增资源时的新增信息项
        //   $scope.ResourceItemList.push($scope.ResourceItem);
        // }

        var shareFreqDictName = [];
        _($scope.ResourceItem.shareFreqItemObjSelection).forEach(function(item) {
          var sys_dict = {};
          sys_dict.InfoItemId = $scope.ResourceItem.item_name;
          sys_dict.sys_dict_id = item.id;
          $scope.ResourceItemConfigList.push(sys_dict);
          shareFreqDictName.push(item.dict_name);
        });
        $scope.ResourceItem.config = $scope.ResourceItem.shareFreqItemObjSelection;
        $scope.ResourceItem.update_period_name = shareFreqDictName;
        $scope.ResourceItemList.push($scope.ResourceItem);

        console.log($scope.ResourceItemList);
      })
    }

    // update resource item
    $scope.updateItem = function(InfoItem) {
      console.log(InfoItem);
      $scope.Modal = {};
      $scope.itemUpdated = false;
      $scope.ResourceItem = InfoItem;
      $scope.ResourceItem.shareFreqItemSelection = _.map(InfoItem.config,'id');
      $scope.ResourceItem.shareFreqItemObjSelection = InfoItem.config;
      $scope.shareFreqEmpty = false;

      $scope.data = {};

      // if (InfoItem.id) { // 在修改信息资源中修改
      //   // 获取该条信息项更新周期
      //   Http.getItemUpdatePeriod({
      //     item_id: InfoItem.id
      //   }).then(function(res) {
      //     $scope.shareFreqItemObjSelection = res.data.body;
      //     $scope.shareFreqItemSelection = _.map($scope.shareFreqItemObjSelection, 'id');
      //   });
      // } else { // 新增资源时修改
      //   $scope.shareFreqItemSelection = $scope.ResourceItem.update_period_temp;
      //   $scope.shareFreqItemObjSelection = $scope.ResourceItem.update_period_obj_temp;
      // }

      _($scope.secretFlagList).forEach(function(secretFlag) {
        if (InfoItem.secret_flag == secretFlag.id) {
          $scope.data.secret_flag = secretFlag;
        }
      })

      _($scope.itemTypeList).forEach(function(itemType) {
        if (InfoItem.item_type == itemType.id) {
          $scope.data.item_type = angular.copy(itemType);
          console.log($scope.data.item_type);
        }
      })

      $scope.$watch('data.item_type', function(n) {
        console.log($scope.data.item_type);
        if (n) {
          $scope.ResourceItem.item_type = n.id;
          $scope.ResourceItem.item_type_name = n.dict_name;
        }
      })

      $scope.$watch('data.secret_flag', function(n) {
        console.log(n);
        $scope.ResourceItem.secret_flag = n.id;
        $scope.ResourceItem.secret_flag_name = n.dict_name;
      })

      Component.popModal($scope, 'Department.Inventory.Controller.publish', '修改', 'item-add-modal').result.then(function(res) {
        $scope.itemUpdated = false;
        var shareFreqDictName = [];
        // 删除本条信息项已选中的多选项
        _.remove($scope.ResourceItemConfigList, function(config) {
          return config.InfoItemId == $scope.ResourceItem.item_name;
        });

        _($scope.ResourceItem.shareFreqItemObjSelection).forEach(function(item) {
          var sys_dict = {};
          sys_dict.InfoItemId = $scope.ResourceItem.item_name;
          sys_dict.sys_dict_id = item.id;
          $scope.ResourceItemConfigList.push(sys_dict);
          shareFreqDictName.push(item.dict_name);
        });
        $scope.ResourceItem.update_period_name = shareFreqDictName;
        console.log($scope.ResourceItemList);
      })
    }

    // delete info item
    $scope.deleteItem = function(index) {
      var deleteFlag = confirm('确定删除本条信息项？');
      console.log(index);
      if (deleteFlag && index > -1) {
        $scope.ResourceItemList.splice(index,1);
      }
    }



    // show or hide department
    $scope.depShow = false;
    $scope.showHideDeps = function(ev) {
      if (LEVEL_ALL_OPEN != $scope.InfoResource.share_level) {
        if (LEVEL_AUTH == $scope.InfoResource.share_level) {
          $scope.depShow = true;
          $scope.socialOpenFlag = false;
        } else {
          $scope.depShow = false;
          $scope.socialOpenFlag = true;
        }
        $scope.InfoResource.social_open_flag = 0;
      } else {
        $scope.InfoResource.social_open_flag = 1;
      }

    }

    $scope.shareMethodOtherShow = false;
    $scope.showHideShareMethodOther = function() {
      if (SHARE_METHOD_OTHER == $scope.InfoResource.share_method) {
        $scope.shareMethodOtherShow = true;
      } else {
        $scope.shareMethodOtherShow = false;
      }
    }

    //show or hide resource item add button
    $scope.resItemAddBtn = false;
    $scope.resFormatOtherShow = false;
    $scope.showHideResAddBtn = function() {
      $scope.resFormatOtherShow = false;
      if (RESOURCE_FORMAT_DATA == $scope.InfoResource.resource_format) {
        if ($stateParams.item) { // 修改
          $scope.resItemUpdateBtn = true;
        } else { // 新增
          $scope.resItemAddBtn = true;
        }

        $scope.resFormatOtherShow = false;
        $scope.shareFreqSelection = [];
        $scope.InfoResource.secret_flag = '';
        $scope.InfoResource.meter_unit = "";
        $scope.InfoResource.calculate_method = '';
      } else if (RESOURCE_FORMAT_OTHER == $scope.InfoResource.resource_format) {
        $scope.resFormatOtherShow = true;
        $scope.resItemAddBtn = false;
        $scope.resItemUpdateBtn = false;
      } else {
        $scope.resItemAddBtn = false;
        $scope.resFormatOtherShow = false;
        $scope.resItemUpdateBtn = false;
      }
    }

    $scope.dataLevelSelection = [];
    $scope.toggleDataLevelSelection = function(item) {
      var idx = $scope.dataLevelSelection.indexOf(item.id);
      // is currently selected
      if (idx > -1) {
        $scope.dataLevelSelection.splice(idx, 1);
      }

      // is newly selected
      else {
        $scope.dataLevelSelection.push(item.id);
      }
    };

    $scope.shareFreqSelection = [];
    $scope.toggleShareFreqSelection = function(item) {
      var idx = $scope.shareFreqSelection.indexOf(item.id);
      // is currently selected
      if (idx > -1) {
        $scope.shareFreqSelection.splice(idx, 1);
      }

      // is newly selected
      else {
        $scope.shareFreqSelection.push(item.id);
      }
    };



    $scope.toggleShareFreqItemSelection = function(item) {
      //var shareFreqItemSelectionIds = _.map($scope.shareFreqItemSelection, 'id');
      var idx = $scope.ResourceItem.shareFreqItemSelection.indexOf(item.id);
      console.log(idx);
      // is currently selected
      if (idx > -1) {
        $scope.ResourceItem.shareFreqItemSelection.splice(idx, 1);
        $scope.ResourceItem.shareFreqItemObjSelection.splice(idx, 1);
      }

      // is newly selected
      else {
        $scope.ResourceItem.shareFreqItemSelection.push(item.id);
        $scope.ResourceItem.shareFreqItemObjSelection.push(item);
      }
      console.log($scope.ResourceItem.shareFreqItemObjSelection);
    };


  }

])


/* HTTP */
DInventory.factory('Department.Inventory.Service.Http', ['$http', '$q', 'API',
  function($http, $q, API) {
    var path = API.path;

    function getDepartmentList() {
      return $http.get(
        path + '/sys_dep'
      )
    }

    function getDepartInfoResList(params) {
      return $http.get(
        path + '/info_resource_list', {
          params: params
        }
      )
    }

    function getInfoResourceDetail(params) {
      return $http.get(
        path + '/data_quota_detail', {
          params: params
        }
      )
    }

    function saveInfoResource(data) {
      return $http.post(
        path + '/info_resource', {
          data: data
        }
      )
    };

    function updateInfoResource(data) {
      return $http.put(
        path + '/info_resource', {
          data: data
        }
      )
    }

    function getInfoItemList(params) {
      return $http.get(
        path + '/allitem_detail', {
          params: params
        }
      )
    }

    function getSystemDictByCatagory(params) {
      return $http.get(
        path + '/sys_dict', {
          params: params
        }
      )
    };

    function deleteInfoResource(id) {
      return $http.delete(
        path + '/info_resource', {
          data: id
        }
      )
    }

    function getResourceAreaLevel(params) {
      return $http.get(
        path + '/resource_area_level', {
          params: params
        }
      )
    }

    function getResourceUpdatePeriod(params) {
      return $http.get(
        path + '/resource_update_period', {
          params: params
        }
      )
    }

    function getResourceShareDeps(params) {
      return $http.get(
        path + '/resource_share_dep', {
          params: params
        }
      )
    }

    function updateInfoItem(params) {
      return $http.put(
        path + '/info_item', {
          data: params
        }
      )
    }

    function getItemUpdatePeriod(params) {
      return $http.get(
        path + '/item_update_period', {
          params: params
        }
      )
    }
    function checkResName(params) {
      return $http.get(
        path + '/info_resource_name', {
          params: params
        }
      )
    }

    function checkItemName(params) {
      return $http.get(
        path + '/info_item_name', {
          params: params
        }
      )
    }
    return {
      saveInfoResource: saveInfoResource,
      getDepartmentList: getDepartmentList,
      getDepartInfoResList: getDepartInfoResList,
      getInfoResourceDetail: getInfoResourceDetail,
      getSystemDictByCatagory: getSystemDictByCatagory,
      deleteInfoResource: deleteInfoResource,
      updateInfoResource: updateInfoResource,
      getInfoItemList: getInfoItemList,
      getResourceAreaLevel: getResourceAreaLevel,
      getResourceUpdatePeriod: getResourceUpdatePeriod,
      getResourceShareDeps: getResourceShareDeps,
      updateInfoItem: updateInfoItem,
      getItemUpdatePeriod: getItemUpdatePeriod,
      checkResName: checkResName,
      checkItemName: checkItemName
    }
  }
]);



/* Component */
DInventory.service('Department.Inventory.Service.Component', ['$uibModal', '$state',
  function($uibModal, $state) {
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
    function popModal(scope, controller, type, templateUrl) {
      scope.Modal.type = type;
      var modalInstance = $uibModal.open({
        animation: true,
        backdrop: 'static',
        templateUrl: templateUrl + '.html',
        controller: controller,
        size: 'lg',
        scope: scope
      });
      scope.Modal.confirm = function() {
        console.log(scope.parent.itemNameExist);
        if (scope.ResourceItem.shareFreqItemSelection.length == 0 || scope.parent.itemNameExist) {
          scope.shareFreqEmpty = true;
          return;
        }
        modalInstance.close(scope.Modal);
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


DInventory.directive('fileModel', ['$parse', function($parse) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      var model = $parse(attrs.fileModel);
      var modelSetter = model.assign;
      scope.parentIvntObj = {};
      element.bind('change', function() {
        var rgx = /(xls|xlsx)/i;
        var fileSuffix = element[0].files[0].name;
        var ext = fileSuffix.substring(fileSuffix.lastIndexOf(".") + 1);
        if (!rgx.test(ext)) {
          scope.$apply(function() {
            scope.parentIvntObj.fileNameError = true;
          })

        } else {
          scope.parentIvntObj.fileNameError = false;
          scope.$apply(function() {
            modelSetter(scope, element[0].files[0]);
          });
        }

      });
    }
  };
}]);

'use strict';
var Department = angular.module('Department', ['ui.router']);

/** Main Controller */
Department.controller('Department.Controller.Main', ['$cookies', '$scope', '$q', 'Department.Service.Http', '$sce','$state',
  function($cookies, $scope, $q, Http, $sce, $state) {
    var LoginUser = JSON.parse($cookies.get('User'));
    var DEP_ID = LoginUser.dep_id;
    var SHARE_FREQUENCY = 1;
    var DATA_LEVEL = 2;
    var SHARE_LEVEL = 3;
    var SECRET_FLAG = 5;
    var RESOURCE_FORMAT = 11;
    var SOCIAL_OPEN_FLAG = 14;
    var _httpParams = {};
    _httpParams.limit = 10;
    _httpParams.skip = 0;
    var _httpConfirmParams = {};
    _httpConfirmParams.limit = 10;
    _httpConfirmParams.skip = 0;

    // follow department
    $scope.depSelect = {};
    $scope.followDeptList = [];
    $scope.parentObj = {};
    function toFollowDep() {
      $scope.depSelect.show = false;
      $scope.followDeptList = $scope.parentObj.outputAllDeptList;
      // send request to add follow department
      var params = [];
      _($scope.followDeptList).forEach(function(item) {
        var followDep = {};
        followDep.follow_dep_id = item.dep_id;
        params.push(followDep);
      });
      Http.followDepts({
        userdep: params
      }).then(function(result) {

      })
    }

    // init
    getAuditList();

    function getAuditList() {
      $scope.mainAuditPromise = Http.getAuditList(_httpParams).then(function(result) {
        $scope.toAuditList = result.data.body[0].results;
        $scope.auditTotal = result.data.body[0].count;
      });
    }

    // init
    getDeptRequirementConfirmList();

    function getDeptRequirementConfirmList() {
      _httpConfirmParams.response_dep_id = DEP_ID;
      console.log(_httpConfirmParams);
      $scope.mainReqPromise = Http.getDepartmentRequirementList(_httpConfirmParams).then(function(result) {
        $scope.requireToConfirmList = result.data.body[0].results;
        $scope.reqTotal = result.data.body[0].count;
      })
    }

    Http.getSystemDictByCatagory({
      'dict_category': SECRET_FLAG
    }).then(function(result) {
      $scope.secretFlagList = result.data.body;
    });

    // Get system dict
    Http.getSystemDictByCatagory({
      'dict_category': SHARE_FREQUENCY
    }).then(function(result) {
      $scope.shareFrequencyList = result.data.body;
    });

    Http.getSystemDictByCatagory({
      'dict_category': SHARE_LEVEL
    }).then(function(result) {
      $scope.shareLevelList = result.data.body;
    });

    Http.getSystemDictByCatagory({
      'dict_category': RESOURCE_FORMAT
    }).then(function(result) {
      $scope.resourceFormatList = result.data.body;
    });

    Http.getSystemDictByCatagory({
      'dict_category': DATA_LEVEL
    }).then(function(result) {
      $scope.dataLevelList = result.data.body;
    });

    Http.getSystemDictByCatagory({
      'dict_category': SOCIAL_OPEN_FLAG
    }).then(function(result) {
      $scope.socialOpenList = result.data.body;
    });

    Http.getDepDataQuotaTotal().then(function(result) {
      $scope.Count = result.data.body[0];
    });

    // go to audit list page
    $scope.auditMore = function() {
      $state.go("main.department.audit", {}, {
        reload: true
      });
    }

    // go to requirement list page
    $scope.reqMore = function() {
      $state.go("main.department.requirement", {}, {
        reload: true
      });
    }

    // 已关注部门列表
    Http.getFollowDepList().then(function(result) {
      $scope.parentObj.outputAllDeptList = result.data.body;
      $scope.followDeptList = _.uniq($scope.parentObj.outputAllDeptList);
      //console.log($scope.parentObj.outputAllDeptList);
      Http.getDepartmentFollowList().then(function(result) {
        $scope.parentObj.deptAllList = _.remove(result.data.body, function(item) {
          return item.dep_id != DEP_ID;
        });
        $scope.parentObj.outputDeptList = [];

        _($scope.parentObj.deptAllList).forEach(function(allItem) {
          allItem.icon = '<img  src=styles/images/bureau/'+ allItem.dep_en_name +' />'
          _($scope.parentObj.outputAllDeptList).forEach(function(outItem) {
            if(allItem.dep_id == outItem.dep_id) {
              allItem.ticked = true;
              $scope.parentObj.outputDeptList.push(allItem);
            }
          })
        });

         $scope.$broadcast('someEvent', $scope.parentObj.outputDeptList);
        // $scope.parentObj.deptAllList = _.pullAllWith($scope.parentObj.deptAllList, $scope.parentObj.outputAllDeptList,function(arrItem,othItem) {
        //   return arrItem.dep_id == othItem.dep_id || DEP_ID == arrItem.dep_id;
        // });
        // console.log($scope.parentObj.deptAllList);
      });
    })

    $scope.openFn = function() {
      $scope.parentObj.outputAllDeptList = $scope.parentObj.outputDeptList;
      console.log($scope.parentObj.outputAllDeptList);
    }



    $scope.followDep = function() {
      toFollowDep();
    }
  }
])


/* HTTP */
Department.factory('Department.Service.Http', ['$http', '$q', 'API',
  function($http, $q, API) {
    var path = API.path;

    function getDepartmentFollowList() {
      return $http.get(
        path + '/follow_sys_dep'
      )
    }

    function getDepDataQuotaTotal() {
      return $http.get(
        path + '/depquota/summary'
      )
    };

    function getSystemDictByCatagory(params) {
      return $http.get(
        path + '/sys_dict', {
          params: params
        }
      )
    };

    function getAuditList(params) {
      return $http.get(
        path + '/depresource/wait_audit', {
          params: params
        }
      )
    }

    function getDepartmentRequirementList(params) {
      return $http.get(
        path + '/data_requiement', {
          params: params
        }
      )
    };

    function getFollowDepList() {
      return $http.get(
        path + '/followed_user_dep'
      )
    }

    function followDepts(params) {
      return $http.post(
        path + '/user_dep_batch', {
          data: params
        }
      )
    }
    return {
      getSystemDictByCatagory: getSystemDictByCatagory,
      getAuditList: getAuditList,
      getDepartmentRequirementList: getDepartmentRequirementList,
      getDepartmentFollowList: getDepartmentFollowList,
      getDepDataQuotaTotal: getDepDataQuotaTotal,
      followDepts: followDepts,
      getFollowDepList: getFollowDepList
    }
  }
]);

'use strict';
var DepartmentReq = angular.module('Department.Requirement', ['ui.router']);

/** DepartmentReq Controller */
DepartmentReq.controller('Department.Requirement.Controller.Main', ['$cookies', '$scope', '$stateParams', 'Department.Requirement.Service.Component', 'Department.Requirement.Service.Http',
  function($cookies, $scope, $stateParams, Component, Http) {
    var LoginUser = JSON.parse($cookies.get('User'));
    var DEP_ID = LoginUser.dep_id;
    var SHARE_FREQUENCY = 1;
    var DATA_LEVEL = 2;
    $scope.DeptRequirement = {};

    $scope.Paging = {};
    $scope.Paging.maxSize = 5;
    $scope.Paging.itemsPerPage = 10;

    var _httpParams = {};
    _httpParams.limit = 10;
    _httpParams.skip = 0;

    $scope.Paging.pageChanged = function() {
      _httpParams.skip = ($scope.Paging.currentPage - 1) * _httpParams.limit;
      getDeptRequirementList(_httpParams);
    }

    // init
    getDeptRequirementList();

    Http.getDepartmentList().then(function(result) {
      $scope.deptList = result.data.body;
      var evens = _.remove($scope.deptList, function(item) {
        return item.id == DEP_ID;
      });
    });

    Http.getSystemDictByCatagory({
      'dict_category': SHARE_FREQUENCY
    }).then(function(result) {
      $scope.shareFrequencyList = result.data.body;
    });

    Http.getSystemDictByCatagory({
      'dict_category': DATA_LEVEL
    }).then(function(result) {
      $scope.dataLevelList = result.data.body;
    });

    function getDeptRequirementList() {
      _httpParams.dep_id = DEP_ID;
      $scope.reqPromise = Http.getDepartmentRequirementList(_httpParams).then(function(result) {
        $scope.requirementList = result.data.body[0].results;
        $scope.Paging.totalItems = result.data.body[0].count;
      })
    }


    $scope.toggleDataLevelReqSelection = function(item) {
      var idx = $scope.dataLevelReqSelection.indexOf(item.id);
      // is currently selected
      if (idx > -1) {
        $scope.dataLevelReqSelection.splice(idx, 1);
      }

      // is newly selected
      else {
        $scope.dataLevelReqSelection.push(item.id);
      }
    };


    $scope.toggleShareFreqSelection = function(item) {
      var idx = $scope.shareFreqSelection.indexOf(item.id);
      // is currently selected
      if (idx > -1) {
        $scope.shareFreqSelection.splice(idx, 1);
      }

      // is newly selected
      else {
        $scope.shareFreqSelection.push(item.id);
      }
    };



    $scope.publishReq = function() {
      $scope.Modal = {};
      $scope.Modal.DepRequirment = {};

      var _httpPublishParams = {};
      var dataRelationConfig = [];
      $scope.reqParent = {};
      $scope.reqParent.outputDeptList = [];

      $scope.shareFreqSelection = [];
      $scope.dataLevelReqSelection = [];

      Component.popModal($scope, '发布', 'add-req-modal').result.then(function() {
        _($scope.dataLevelReqSelection).forEach(function(value) {
          var req_sys_dict = {};
          req_sys_dict.datarequiementId = $scope.Modal.DepRequirment.requiement_name;
          req_sys_dict.sys_dict_id = value;
          req_sys_dict.obj_type = 2;
          dataRelationConfig.push(req_sys_dict);
        });

        _($scope.shareFreqSelection).forEach(function(value) {
          var req_sys_dict = {};
          req_sys_dict.datarequiementId = $scope.Modal.DepRequirment.requiement_name;
          req_sys_dict.sys_dict_id = value;
          req_sys_dict.obj_type = 2;
          dataRelationConfig.push(req_sys_dict);
        });

        var res_dep_id = _.map($scope.reqParent.outputDeptList, 'id');

        console.log(res_dep_id);
        $scope.Modal.DepRequirment.response_dep_id = res_dep_id[0];
        _httpPublishParams.dataRequiement = $scope.Modal.DepRequirment;
        _httpPublishParams.dataRelationConfig = dataRelationConfig;

        Http.publishRequirement(_httpPublishParams).then(function(result) {
          if (200 == result.data.head.status) {
            alert('发布成功');
            getDeptRequirementList();
          } else {
            alert('发布失败');
          }
        })
      });
    }

    $scope.searchDeptReqByName = function() {
      _httpParams.requiement_name = $scope.DeptRequirement.req_name_filter;
      _httpParams.limit = 10;
      _httpParams.skip = 0;
      getDeptRequirementList();
    }


    // delete requirement
    $scope.deleteReq = function(id) {
      var deleteFlag = confirm('确定删除本条需求？删除后将不可恢复。');
      if(deleteFlag) {
        Http.deleteRequirement({
          requiement_id: id
        }).then(function(result) {
            if (200 == result.data.head.status) {
              alert('删除成功！');
              getDeptRequirementList();
            }
            else {
              alert('删除失败！');
            }
        })
      }
    }

    // update requirement
    $scope.updateReq = function(item) {
      $scope.Modal = {};
      $scope.Modal.DepRequirment = item;

      var _httpPublishParams = {};
      var dataRelationConfig = [];

      $scope.reqParent = {};
      $scope.reqParent.outputDeptList = [];

      $scope.shareFreqSelection = [];
      $scope.dataLevelReqSelection = [];

      _($scope.deptList).forEach(function(outItem) {
        if(item.response_dep_id == outItem.id) {
          outItem.ticked = true;
          $scope.reqParent.outputDeptList.push(outItem);
        }
      })

      // 获取需求对应的共享频率数据
      Http.getReqUpdatePeriod({
        requiement_id: item.id
      }).then(function(res) {
        $scope.shareFreqSelection = res.data.body;
      })

      // 获取需求对应的分地区数据级别
      Http.getReqAreaLevel({
        requiement_id: item.id
      }).then(function(res) {
        $scope.dataLevelReqSelection = res.data.body;
      })

      Component.popModal($scope, '修改', 'add-req-modal').result.then(function() {
        _($scope.dataLevelReqSelection).forEach(function(value) {
          var req_sys_dict = {};
          req_sys_dict.datarequiementId = $scope.Modal.DepRequirment.id;
          req_sys_dict.sys_dict_id = value;
          req_sys_dict.obj_type = 2;
          dataRelationConfig.push(req_sys_dict);
        });

        _($scope.shareFreqSelection).forEach(function(value) {
          var req_sys_dict = {};
          req_sys_dict.datarequiementId = $scope.Modal.DepRequirment.id;
          req_sys_dict.sys_dict_id = value;
          req_sys_dict.obj_type = 2;
          dataRelationConfig.push(req_sys_dict);
        });

        var res_dep_id = _.map($scope.reqParent.outputDeptList, 'id');
        $scope.Modal.DepRequirment.response_dep_id = res_dep_id[0];

        _httpPublishParams.dataRequiement = $scope.Modal.DepRequirment;
        _httpPublishParams.dataRelationConfig = dataRelationConfig;

        Http.updateRequirementInfo(_httpPublishParams).then(function(result) {
          if (200 == result.data.head.status) {
            alert('修改成功');
            getDeptRequirementList();
          } else {
            alert('修改失败');
          }
        })
      });
    }

  }
])


/** DepartmentReq Controller */
DepartmentReq.controller('Department.Requirement.Controller.confirm', ['$cookies', '$scope', '$stateParams', 'Department.Requirement.Service.Http', 'Department.Requirement.Service.Component',
  function($cookies, $scope, $stateParams, Http, Component) {
    $scope.Modal = {};
    $scope.DeptRequirementConfirm = {};

    var LoginUser = JSON.parse($cookies.get('User'));
    var DEP_ID = LoginUser.dep_id;
    $scope.DeptRequirement = {};

    $scope.Paging = {};
    $scope.Paging.maxSize = 5;
    $scope.Paging.itemsPerPage = 10;

    var _httpConfirmParams = {};
    _httpConfirmParams.limit = 10;
    _httpConfirmParams.skip = 0;

    $scope.Paging.pageChanged = function() {
      _httpConfirmParams.skip = ($scope.Paging.currentPage - 1) * _httpConfirmParams.limit;
      getDeptRequirementConfirmList(_httpConfirmParams);
    }

    // init
    getDeptRequirementConfirmList();

    function getDeptRequirementConfirmList() {
      _httpConfirmParams.response_dep_id = DEP_ID;
      $scope.reqConfirmPromise = Http.getDepartmentRequirementList(_httpConfirmParams).then(function(result) {
        $scope.requirementConfirmList = result.data.body[0].results;
        $scope.Paging.totalItems = result.data.body[0].count;
      })
    }

    $scope.searchDeptReqConfirmByName = function() {
      _httpConfirmParams.requiement_name = $scope.DeptRequirementConfirm.req_name_filter;
      _httpConfirmParams.limit = 10;
      _httpConfirmParams.skip = 0;
      getDeptRequirementConfirmList();
    }

    Http.getDeptInfoResourceList().then(function(result) {
      console.log(result);
      $scope.depInfoResourceList = result.data.body[0].results;

      //  $scope.Paging.totalItems = data.head.total;
    });

    $scope.toConfirm = function(item) {
      // get requirement detail
      $scope.Modal.ReqDetail = item;
      $scope.Modal.ReqResponse = {};
      console.log($scope.depInfoResourceList.length);
      if($scope.depInfoResourceList.length == 0) {
        $scope.Modal.ReqResponse.resource_id = '';
        $scope.errorMsg = '本部门还未发布任何信息资源';
        $scope.dataQuotaIdNull = true;
      }
      else{
        $scope.Modal.ReqResponse.resource_id = $scope.depInfoResourceList[0].id;
      }

      Component.popModalConfirm($scope, '', 'confirm-req-modal').result.then(function() {
        console.log($scope.Modal.ReqResponse);
        $scope.Modal.ReqResponse.requiement_id = item.id;

        Http.updateRequirement($scope.Modal.ReqResponse).then(function(result) {
          if (200 == result.data.head.status) {
            if ($scope.Modal.ReqResponse.status == 1) {
              // 保存需求响应
              Http.saveReqResponse({
                requiement_id: item.id,
                resource_id: $scope.Modal.ReqResponse.resource_id
              }).then(function(saveResult) {
                if (200 == saveResult.data.head.status) {
                  alert('保存成功！');
                  getDeptRequirementConfirmList();
                } else {
                  alert('保存失败！');
                  getDeptRequirementConfirmList();
                }
              })
            } else {
              alert('保存成功！');
              getDeptRequirementConfirmList();
            }

          } else {
            alert('保存失败');
          }
        })
      });
    }

  }
])

/** DepartmentReq Controller */
DepartmentReq.controller('Department.Requirement.Controller.detail', [ '$scope', '$stateParams', 'Department.Requirement.Service.Http', 'Department.Requirement.Service.Component',
    function( $scope, $stateParams, Http, Component) {
      console.log($stateParams.ID);
      Http.getReqDetail({
        requiement_id: $stateParams.ID
      }).then(function(result) {
        console.log(result.data.body[0]);
        $scope.ReqDetail = result.data.body[0];
      })
    }
  ])
  /* HTTP Factory */
DepartmentReq.factory('Department.Requirement.Service.Http', ['$http', 'API',
  function($http, API) {
    var path = API.path;

    function getDepartmentRequirementList(params) {
      return $http.get(
        path + '/data_requiement', {
          params: params
        }
      )
    };

    function publishRequirement(data) {
      return $http.post(
        path + '/data_requiement', {
          data: data
        }
      )
    }

    // 需求确认修改状态
    function updateRequirement(data) {
      return $http.put(
        path + '/data_requiement_ok', {
          data: data
        }
      )
    }

    // 修改需求信息
    function updateRequirementInfo(data) {
      return $http.put(
        path + '/data_requiement', {
          data: data
        }
      )
    }

    function saveReqResponse(data) {
      return $http.post(
        path + '/data_requiement_response', {
          data: data
        }
      )
    }

    function getDeptInfoResourceList(params) {
      return $http.get(
        path + '/info_resource_list', {
          params: params
        }
      )
    }

    function getReqDetail(params) {
      return $http.get(
        path + '/data_requiement_detail', {
          params: params
        }
      )
    }

    function getResponseList(params) {
      return $http.get(
        path + '/requirement/requireResponseList', {
          params: params
        }
      )
    }

    function getDepartmentList() {
      return $http.get(
        path + '/sys_dep'
      )
    }

    function deleteRequirement(id) {
      return $http.delete(
        path + '/data_requiement', {
          data: id
        }
      )
    }

    function getSystemDictByCatagory(params) {
      return $http.get(
        path + '/sys_dict', {
          params: params
        }
      )
    };

    function getReqUpdatePeriod(params) {
      return $http.get(
        path + '/requiement_update_period', {
          params: params
        }
      )
    }

    function getReqAreaLevel(params) {
      return $http.get(
        path + '/requiement_area_level', {
          params: params
        }
      )
    }
    return {
      getDepartmentRequirementList: getDepartmentRequirementList,
      publishRequirement: publishRequirement,
      getReqDetail: getReqDetail,
      getResponseList: getResponseList,
      updateRequirement: updateRequirement,
      updateRequirementInfo: updateRequirementInfo,
      saveReqResponse: saveReqResponse,
      getDeptInfoResourceList: getDeptInfoResourceList,
      getDepartmentList: getDepartmentList,
      deleteRequirement: deleteRequirement,
      getSystemDictByCatagory: getSystemDictByCatagory,
      getReqUpdatePeriod: getReqUpdatePeriod,
      getReqAreaLevel: getReqAreaLevel
    }
  }
]);


/* Component */
DepartmentReq.service('Department.Requirement.Service.Component', ['$uibModal',
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
    // prompt Modal for confirm
    function popModalConfirm(scope, type, templateUrl) {
      scope.Modal.type = type;
      var modalInstanceConfirm = $uibModal.open({
        animation: true,
        backdrop: 'static',
        templateUrl: templateUrl + '.html',
        scope: scope,
        size: 'lg'
      });
      scope.Modal.confirm = function(isValid) {
        console.log(scope);
        if (isValid) {
          modalInstanceConfirm.close(scope.Modal);
        } else {
          return;
        }

      };
      scope.Modal.cancel = function() {
        modalInstanceConfirm.dismiss();
      };
      return modalInstanceConfirm;
    };
    // prompt Modal
    function popModal(scope, type, templateUrl) {
      scope.Modal.type = type;
      var modalInstance = $uibModal.open({
        animation: true,
        backdrop: 'static',
        templateUrl: templateUrl + '.html',
        scope: scope,
        size: 'lg'
      });
      scope.Modal.confirm = function(isValid) {
        console.log(scope);
        if (isValid && scope.reqParent.outputDeptList.length > 0) {
          modalInstance.close(scope.Modal);
        } else {
          scope.error = true;
        }

      };
      scope.Modal.cancel = function() {
        modalInstance.dismiss();
      };
      return modalInstance;
    };

    return {
      popAlert: popAlert,
      popModal: popModal,
      popModalConfirm: popModalConfirm
    }
  }
])

'use strict';
var DepartmentShare = angular.module('DepartmentShare', ['ui.router']);

/** InventoryDetail Controller */
DepartmentShare.controller('DepartmentShare.Controller.Main', [ '$scope', 'DepartmentShare.Service.Http',
  function( $scope, Http) {
    $scope.DepartInfoResource = {};

    $scope.Paging = {};
    $scope.Paging.maxSize = 5;
    $scope.Paging.itemsPerPage = 10;

    var _httpParams = {};
    _httpParams.limit = 10;
    _httpParams.skip = 0;

    $scope.Paging.pageChanged = function() {
      _httpParams.skip = ($scope.Paging.currentPage - 1)*_httpParams.limit;
      getDepartmentShareList(_httpParams);
    }

    function getDepartmentShareList(_httpParams) {
      $scope.sharePromise = Http.shareInfoResourceList(_httpParams).then(function(result) {
        $scope.depShareList = result.data.body[0].results;
        $scope.Paging.totalItems = result.data.body[0].count;
      });
    }

    //init
    getDepartmentShareList(_httpParams);

    // resource format all
    $scope.getResFormatAll = function() {
      $scope.resFormatMainSelection = [];
      _httpParams.re_format = null;
      _httpParams.limit = 10;
      _httpParams.skip = 0;
      getDepartmentShareList(_httpParams);
    }

    // share level all
    $scope.getShareLevelAll = function() {
      $scope.shareLvMainSelection = [];
      _httpParams.share_level = null;
      _httpParams.limit = 10;
      _httpParams.skip = 0;
      getDepartmentShareList(_httpParams);
    }

    // social open all
    $scope.getSocialOpenAll = function() {
      $scope.socialOpenMainSelection = [];
      _httpParams.social_open_flag = null;
      _httpParams.limit = 10;
      _httpParams.skip = 0;
      getDepartmentShareList(_httpParams);
    }

    // share frequency all
    $scope.getShareFreqAll = function() {
      $scope.shareFreqSelection = [];
      _httpParams.update_period = null;
      _httpParams.limit = 10;
      _httpParams.skip = 0;
      getDepartmentShareList(_httpParams);
    }

    // secret flag all
    $scope.getSecretFlagAll = function() {
      $scope.secretFlagMainSelection = [];
      _httpParams.issecret = null;
      _httpParams.limit = 10;
      _httpParams.skip = 0;
      getDepartmentShareList(_httpParams);
    }

    // filter by resource format
    $scope.resFormatMainSelection = [];
    $scope.getInfoResourceByResFormat = function(item) {
      var idx = $scope.shareFreqSelection.indexOf(item.id);
      if (idx > -1) {
        $scope.resFormatMainSelection = [];
      } else {
        $scope.resFormatMainSelection = item.id;
      }
      _httpParams.re_format = $scope.resFormatMainSelection;
      _httpParams.limit = 10;
      _httpParams.skip = 0;
      getDepartmentShareList(_httpParams);
    }

    // filter by share frequency
    $scope.shareFreqSelection = [];
    $scope.getInfoResourceListBySF = function(item) {
      var idx = $scope.shareFreqSelection.indexOf(item.id);
      if (idx > -1) {
        $scope.shareFreqSelection = [];
      } else {
        $scope.shareFreqSelection = item.id;
      }
      _httpParams.update_period = $scope.shareFreqSelection;
      _httpParams.limit = 10;
      _httpParams.skip = 0;
      getDepartmentShareList(_httpParams);
    }

    // filter by share level
    $scope.shareLvMainSelection = [];
    $scope.getInfoResourceListBySl = function(item) {
      var idx = $scope.shareLvMainSelection.indexOf(item.id);
      if (idx > -1) {
        $scope.shareLvMainSelection = [];
      } else {
        $scope.shareLvMainSelection = item.id;
      }
      _httpParams.share_level = $scope.shareLvMainSelection;
      _httpParams.limit = 10;
      _httpParams.skip = 0;
      getDepartmentShareList(_httpParams);
    }

    // filter by social open flag
    $scope.socialOpenMainSelection = [];
    $scope.getInfoResourceListBySO = function(item) {
      var idx = $scope.socialOpenMainSelection.indexOf(item.dict_code);
      if (idx > -1) {
        $scope.socialOpenMainSelection = [];
      } else {
        $scope.socialOpenMainSelection = item.dict_code;
      }
      _httpParams.social_open_flag = $scope.socialOpenMainSelection;
      _httpParams.limit = 10;
      _httpParams.skip = 0;
      getDepartmentShareList(_httpParams);
    }

    // filter by secret flag
    $scope.secretFlagMainSelection = [];
    $scope.getInfoResourceListBySecFlag = function(item) {
      var idx = $scope.secretFlagMainSelection.indexOf(item.id);
      if (idx > -1) {
        $scope.secretFlagMainSelection = [];
      } else {
        $scope.secretFlagMainSelection = item.id;
      }
      _httpParams.issecret = $scope.secretFlagMainSelection;
      _httpParams.limit = 10;
      _httpParams.skip = 0;
      getDepartmentShareList(_httpParams);
    }


    // get spatial all
    $scope.getSpatialAll = function() {
      $scope.areaMainSelection = [];
      _httpParams.area_level = null;
      _httpParams.limit = 10;
      _httpParams.skip = 0;
      getDepartmentShareList(_httpParams);
    }

    // filter by partial
    $scope.areaMainSelection = [];
    $scope.getInfoResourceListByAP = function(item) {
      var idx = $scope.areaMainSelection.indexOf(item.id);
      // is currently selected
      if (idx > -1) {
        $scope.areaMainSelection.splice(idx, 1);
      }
      // is newly selected
      else {
        $scope.areaMainSelection.push(item.id);
      }

      _httpParams.area_level = $scope.areaMainSelection;
      _httpParams.limit = 10;
      _httpParams.skip = 0;
      getDepartmentShareList(_httpParams);
    }

    // search by name
    $scope.searchDeptInfoResourceByName = function() {
      _httpParams.resource_name = $scope.DepartInfoResource.resource_name_filter;
      _httpParams.limit = 10;
      _httpParams.skip = 0;
      getDepartmentShareList(_httpParams);
    }

    var SHARE_FREQUENCY = 1;
    var DATA_LEVEL = 2;
    var SHARE_LEVEL = 3;
    var SECRET_FLAG = 5;
    var RESOURCE_FORMAT = 11;
    var SOCIAL_OPEN_FLAG = 14;
    // Get system dict
    Http.getSystemDictByCatagory({
      'dict_category': SECRET_FLAG
    }).then(function(result) {
      $scope.secretFlagList = result.data.body;
    });

    // Get system dict
    Http.getSystemDictByCatagory({
      'dict_category': SHARE_FREQUENCY
    }).then(function(result) {
      $scope.shareFrequencyList = result.data.body;
    });

    Http.getSystemDictByCatagory({
      'dict_category': SHARE_LEVEL
    }).then(function(result) {
      $scope.shareLevelList = result.data.body;
    });

    Http.getSystemDictByCatagory({
      'dict_category': RESOURCE_FORMAT
    }).then(function(result) {
      $scope.resourceFormatList = result.data.body;
    });

    Http.getSystemDictByCatagory({
      'dict_category': DATA_LEVEL
    }).then(function(result) {
      $scope.dataLevelList = result.data.body;
    });

    Http.getSystemDictByCatagory({
      'dict_category': SOCIAL_OPEN_FLAG
    }).then(function(result) {
      $scope.socialOpenList = result.data.body;
    });

  }
])


// Department share detail controller
DepartmentShare.controller('DepartmentShare.Controller.detail', [ '$scope', 'DepartmentShare.Service.Http', '$stateParams',
  function( $scope, Http, $stateParams) {
    // get department share detail
    Http.getQuotaDetail({
      data_quota_id: $stateParams.ID
    }).then(function(result) {
      $scope.DataQuotaDetail = result.data.body[0];
    })

  }
])

/* HTTP Factory */
DepartmentShare.factory('DepartmentShare.Service.Http', ['$http', 'API',
  function($http, API) {
    var path = API.path;

    function shareInfoResourceList(params) {
      return $http.get(
        path + '/share_list', {
          params: params
        }
      )
    };
    function getQuotaDetail(params) {
      return $http.get(
        path + '/data_quota_detail', {
          params: params
        }
      )
    };
    function followDepartment(id) {
      return $http.post(
        path + '/user_dep', {
          data: id
        }
      )
    };
    function getSystemDictByCatagory(params) {
      return $http.get(
        path + '/sys_dict', {
          params: params
        }
      )
    };
    function cancelFollowDepartment(id) {
      return $http.delete(
        path + '/user_dep', {
          data: id
        }
      )
    };
    return {
      getSystemDictByCatagory: getSystemDictByCatagory,
      shareInfoResourceList: shareInfoResourceList,
      getQuotaDetail: getQuotaDetail,
      followDepartment: followDepartment,
      cancelFollowDepartment: cancelFollowDepartment
    }
  }
]);

'use strict';
var SystemUser = angular.module('Department.SystemUser', ['ui.router']);

/** Main Controller */
SystemUser.controller('Department.SystemUser.Controller.Main', ['$scope', '$q', 'Department.SystemUser.Service.Http', 'Department.SystemUser.Service.Component', '$uibModal',
  function($scope, $q, Http, Component, $uibModal) {
    $scope.Modal = {}; // Clean scope of modal
    $scope.deptList = [];

    function getUserList() {
      Http.getUserList().then(function(result) {
        $scope.users = result.data.body;
        $scope.DepUserTotal =result.data.head.total;
      });
    }
    // Http.getDepartmentList().then(function(result) {
    //   $scope.deptList = result.data.body;
    // });

    // init
    getUserList();

    // add user
    $scope.addUserModal = function() {
      $scope.Modal = {}; // Clean scope of modal
      $scope.sysUser = {}; // Clean scope of modal

      Component.popModal($scope, '添加', 'add-user-modal').result.then(function() {
        Http.saveUser($scope.sysUser).then(function(result) {
          if (200 == result.data.head.status) {
            alert('添加成功');
            getUserList();
          }
          else{
            alert('添加失败');
          }
        })
      });

    }

    $scope.searchUser = function(){
      var username= $scope.username;
      alert(username);
      // http.getUser({
      //   USERNAME: username,
      // })then(function(result) {
      //   if(200 == result.data.head.status){
      //     $scope.users = result.data.body;
      //     $scope.DepUserTotal =result.data.head.total;
      //   }else {
      //     alert("输入错误，请");
      //   }
      //
      // });
    }

    $scope.updateUser = function(user) {
      user.DEP_NAME = null;
      $scope.sysUser = user;
      Component.popModal($scope, '修改', 'add-user-modal').result.then(function() {
        Http.updateUser($scope.sysUser).then(function(result) {
          if (200 == result.data.head.status) {
            alert('修改成功');
            getUserList();
          }
          else{
            alert('修改失败');
          }
        })
      });
    }

    $scope.deleteUser = function(user) {
      console.log(user);
      var fig = confirm("确定要删除吗？");
      if (fig) {
        Http.deleteUser(user).then(function(result) {
          console.log(result.data);
          if (200 == result.data.head.status) {
            alert('删除成功');
            getUserList();
          }
          else{
            alert('删除失败！');
          }
          getUserList();
        })
      }
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
    function getUser(params) {
      return $http.get(
        path + '/user', {
          params: params
        }

      )
    };

    function saveUser(data) {
      return $http.post(
        path + '/user', {
          data: data
        }
      )
    };

    function getDepartmentList() {
      return $http.get(
        path + '/dep/'
      )
    }

    function updateUser(data) {
      return $http.put(
        path + '/user/' , {
          data: data
        }
      )
    }

    function deleteUser(data) {
      return $http.delete(
        path + '/user', {
            data: {"ID":data.ID}
        }
      )
    }
    return {
      getUserList: getUserList,
      saveUser: saveUser,
      getDepartmentList: getDepartmentList,
      updateUser: updateUser,
      deleteUser: deleteUser,
      getUser:getUser
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
        backdrop : 'static',
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
