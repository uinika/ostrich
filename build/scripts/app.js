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
        url: '/list/:quota_dep_id/:dep_name',
        templateUrl: 'views/data-quota/list.html',
        controller: 'DataQuotaList.Controller.Main'
      })
      .state('main.data-quota.detail', {
        url: '/detail/:data_quota_id',
        templateUrl: 'views/data-quota/detail.html',
        controller: 'DataQuotaDetail.Controller.Main'
      })
      .state('main.department', {
        url: '/department',
        cache:'false',
        reload: true,
        templateUrl: 'views/department/main.html',
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
      .state('main.department.inventory.detail', {
        url: '/detail?ID',
        cache:'false',
        templateUrl: 'views/department/inventory-detail.html',
        controller: 'Department.Inventory.Controller.detail'
      })
      .state('main.department.inventory.upload', {
        url: '/upload?ID',
        cache:'false',
        templateUrl: 'views/department/inventory-upload.html',
        controller: 'Department.Inventory.Controller.upload'
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
        url: '/info/:AUDITID/:DATAQUOTAID/:APPLYDEPNAME/:APPLYTIME',
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
  path: 'http://localhost:8080/drrp/api' //发布
  // path: 'http://172.16.1.78:8080/api' //测试
  // path: 'http://localhost:5001/api' //本机
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
        console.log(LoginUser.id);
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
    $scope.placeholder.phone = "必填";
    $scope.placeholder.email = "必填";
    // add user
    $scope.addUserModal = function() {
      $scope.Modal = {}; // Clean scope of modal
      $scope.sysUser = {}; // Clean scope of modal
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
      $scope.departmentID = {quota_dep_id: param};
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
          return result.data.body[0].follow_dep_id;
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
        path + '/sys_dep'
      )
    };
    function getDataquotaSummary(){
      return $http.get(
        path + '/data_quota/summary'
      )
    };
    function getDataRequirementSummary(){
      return $http.get(
        path + '/data_requiement/summary'
      )
    };
    function getUserDep(params){
      return $http.get(
        path + '/user_dep',{params: params}
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
                name: '指标提供部门',
                type: 'pie',
                // selectedMode: 'single',
                radius: [0, '60%'],
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
                  name: '指标提供部门'
                }, {
                  value: summary.department_number_inc,
                  name: '本月新增',
                  selected: true
                }]
              }, {
                name: '指标总数',
                type: 'pie',
                radius: ['70%', '85%'],
                data: [{
                  value: summary.data_quota_number,
                  name: '指标总数'
                }, {
                  value: summary.data_quota_number_inc,
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
                radius: [0, '60%'],
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
                radius: ['70%', '85%'],
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
              data: ['指标', '需求']
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
              name: '指标',
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
      {dataquotaid: $stateParams.data_quota_id}
    ).then(function(result) {
      $scope.DataQuotaExample = result.data.body[0];
    });

  }
]);


/* HTTP Factory */
DataQuotaDetail.factory('DataQuotaDetail.Service.Http', ['$http', 'API',
  function($http, API) {
    var path = API.path;
    function getDataQuotaDetailByDepID(params){
      return $http.get(
        path + '/data_quota_detail', { params: params }
      )
    };
    function getDataQuotaExampleByDepID(params){
      return $http.get(
        path + '/examples_detail', { params: params }
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
    var currentDepID = {quota_dep_id:StateParams.quota_dep_id};
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
        $scope.ShareLevelActiveAll = $scope.ShareFrequencyActiveAll = $scope.DataLevelActiveAll = 'active';
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
      var searchTarget = {quotaname: $scope.TargetDataQuotaName};
      (currentDepID==='') ? (_.assign(httpParams, initPaging, searchTarget)) : (_.assign(httpParams, currentDepID, initPaging, searchTarget));
      getDataQuotaList(httpParams);
    };
    // Data quota apply info
    $scope.DataQuotaApplyInfo = function(data_quota_id) {
      Http.getDataQuotaApplyInfo({data_quota_id: data_quota_id}).then(function() {
        alert('申请查看成功');
        var httpParams = {};
        _.assign(httpParams, {limit:10, skip: ($scope.Paging.currentPage-1) * 10});
        getDataQuotaList(httpParams);
      });
    };
    // Filter generator
    var SHARE_FREQUENCY = 1,
        DATA_LEVEL = 2,
        SHARE_LEVEL = 3;
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
    /* 共享频率 */
    $scope.ShareFrequencyFilter = function(id, index){
      $scope.ShareFrequencyActive = [];
      $scope.ShareFrequencyActiveAll = '';
      $scope.ShareFrequencyActive[index] = 'active';
      filterParams.share_frequency = id;
      if('ALL'===id){
        delete filterParams.share_frequency;
        $scope.ShareFrequencyActiveAll = 'active';
        getDataQuotaListByFilter(filterParams);
      }else{
        getDataQuotaListByFilter(filterParams);
      }
    };
    /* 分地区数据级别 */
    filterParams.sys_dict_id = [];
    $scope.DataLevelActive = [];
    $scope.DataLevelFilter = function(id, index){
      if('ALL'===id){
        filterParams.sys_dict_id = [];
        $scope.DataLevelActiveAll = 'active';
        $scope.DataLevelActive=[];
        getDataQuotaListByFilter(filterParams);
      }else{
        $scope.DataLevelActiveAll = '';
        ($scope.DataLevelActive[index]==='active')?($scope.DataLevelActive[index]=''):($scope.DataLevelActive[index]='active');
        filterParams.sys_dict_id.push(id);
        getDataQuotaListByFilter(filterParams);
      };
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
        path + '/data_quota/sys_dict', { params: params }
      )
    };
    function getDataQuotaApplyInfo(data){
      return $http.post(
        path + '/data_quota_apply_info', { data: data }
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
    $scope.DeptAudit = {};

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

    $scope.searchDeptAuditByName = function() {
      _httpParams.quota_name = $scope.DeptAudit.quota_name_filter;
      _httpParams.limit = 10;
      _httpParams.skip = 0;
      getAuditList();
    }


  }
])


Audit.controller('Department.Audit.Controller.info', ['$scope', '$state', '$q', 'Department.Audit.Service.Http', '$stateParams',
  function( $scope, $state, $q, Http, $stateParams) {
    $scope.TabExampShow = true;
    $scope.TabRequireShow = true;
    $scope.Tab = {};
    $scope.Tab.show = {};
    $scope.Tab.show.auditInfo = true;
    $scope.AuditInfo = {};
    $scope.AuditInfo.audit_opinion = '';

    // get audit detail by id
    Http.getQuotaDetail({
      data_quota_id: $stateParams.DATAQUOTAID
    }).then(function(result) {
      $scope.AuditDetail = result.data.body[0];
      $scope.AuditDetail.applydepname = $stateParams.APPLYDEPNAME;
      $scope.AuditDetail.applytime = $stateParams.APPLYTIME;
      console.log($scope.AuditDetail);
      Http.getQuotaExamples({
        dataquotaid: $stateParams.DATAQUOTAID
      }).then(function(res) {
        $scope.DataQuotaExamples = res.data.body[0];
        if (res.data.head.total == 0) {
          $scope.TabExampShow = false;
        }
        else{
          $scope.DataTitle = $scope.DataQuotaExamples.file_content.title;
          $scope.DataColumn = $scope.DataQuotaExamples.file_content.column;
        }
        Http.getQuotaRequirement({
          dataquotaid: $stateParams.DATAQUOTAID
        }).then(function(reqRes) {

          if(reqRes.data.body.length == 0) {
            $scope.TabRequireShow = false;
          }
          else {
            $scope.QuotaReqDetailList = reqRes.data.body;
          }

        })

      })
    })


    $scope.tabSwitcher = function(num) {
      switch (num) {
        case 'auditInfo':
          $scope.Tab.show = {};
          $scope.Tab.show.auditInfo = true;
          break;
        case 'auditExampData':
          $scope.Tab.show = {};
          $scope.Tab.show.auditExampData = true;
          break;
        case 'requirementInfo':
          $scope.Tab.show = {};
          $scope.Tab.show.requirementInfo = true;
          break;
        default:
        case 2:
          $scope.Tab = {};
          $scope.Tab.auditInfo.show = true;
          break;

      }
    }



    $scope.submitAudit = function() {
      console.log($scope.AuditInfo.audit_status);
      if(!$scope.AuditInfo.audit_status) {
        $scope.auditError = true;
        return;
      }
      $scope.AuditInfo.ID = $stateParams.AUDITID;
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
        path + '/opendata_quotalist', {
          params: params
        }
      )
    }

    function getQuotaDetail(params) {
      return $http.get(
        path + '/data_quota_detail', {
          params: params
        }
      )
    }

    function updateAuditDetail(data) {
      return $http.put(
        path + '/data_quota_apply_info', {
          data: data
        }
      )
    }

    function getQuotaExamples(params) {
      return $http.get(
        path + '/examples_detail', {
          params: params
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
    return {
      getAuditList: getAuditList,
      getQuotaDetail: getQuotaDetail,
      updateAuditDetail: updateAuditDetail,
      getQuotaExamples: getQuotaExamples,
      getQuotaRequirement: getQuotaRequirement
    }
  }
]);

'use strict';
var DInventory = angular.module('Department.Inventory', ['ui.router', 'ngCookies', 'cgBusy']);

/** Inventory Controller */
DInventory.controller('Department.Inventory.Controller.Main', ['$cookies', '$scope', '$q', 'Department.Inventory.Service.Http',
  function($cookies, $scope, $q, Http) {
    var LoginUser = JSON.parse($cookies.get('User'));
    var DEP_NAME = LoginUser.dep_id;
    $scope.DepartDataQuota = {};

    $scope.Paging = {};
    $scope.Paging.maxSize = 5;
    $scope.Paging.itemsPerPage = 10;

    var _httpParams = {};
    _httpParams.limit = 10;
    _httpParams.skip = 0;

    $scope.Paging.pageChanged = function() {
      _httpParams.skip = ($scope.Paging.currentPage - 1)*_httpParams.limit;
      getDepartmentQuotaList(_httpParams);
    }

    $scope.delay = 0;
    $scope.minDuration = 0;
    $scope.message = '加载中...';
    $scope.backdrop = true;
    $scope.promise = null;

    function getDepartmentQuotaList(_httpParams) {
      _httpParams.dep_name = DEP_NAME;
      $scope.promise = Http.getDepartQuotaList(_httpParams).then(function(result) {
        console.log(result);
        var temp = _.replace('  Hi', ' ', '0');
        console.log(temp);
        $scope.depQuotaList = result.data.body[0].results;
        $scope.Paging.totalItems = result.data.body[0].count;
      });
    }


    //init
    getDepartmentQuotaList(_httpParams);

    // share level all
    $scope.getShareLevelAll = function() {
      $scope.shareLvMainSelection = [];
      _httpParams.share_level = null;
      _httpParams.limit = 10;
      _httpParams.skip = 0;
      getDepartmentQuotaList(_httpParams);
    }

    // filter by share level
    $scope.shareLvMainSelection = [];
    $scope.getDataQuotaListBySl = function(item) {
      var idx = $scope.shareLvMainSelection.indexOf(item.id);
      if (idx > -1) {
        $scope.shareLvMainSelection = [];
      } else {
        $scope.shareLvMainSelection = item.id;
      }
      _httpParams.share_level = $scope.shareLvMainSelection;
      _httpParams.limit = 10;
      _httpParams.skip = 0;
      getDepartmentQuotaList(_httpParams);
    }

    // share frequency all
    $scope.getShareFreqAll = function() {
      $scope.shareFreqSelection = [];
      _httpParams.share_frequency = null;
      _httpParams.limit = 10;
      _httpParams.skip = 0;
      getDepartmentQuotaList(_httpParams);
    }

    // filter by share frequency
    $scope.shareFreqSelection = [];
    $scope.getDataQuotaListBySF = function(item) {
      var idx = $scope.shareFreqSelection.indexOf(item.id);
      if (idx > -1) {
        $scope.shareFreqSelection = [];
      } else {
        $scope.shareFreqSelection = item.id;
      }
      _httpParams.share_frequency = $scope.shareFreqSelection;
      _httpParams.limit = 10;
      _httpParams.skip = 0;
      getDepartmentQuotaList(_httpParams);
    }


    // get spatial all
    $scope.getSpatialAll = function() {
      $scope.areaMainSelection = [];
      _httpParams.sys_dict_id = null;
      _httpParams.limit = 10;
      _httpParams.skip = 0;
      getDepartmentQuotaList(_httpParams);
    }

    // filter by partial
    $scope.areaMainSelection = [];
    $scope.getDataQuotaListByAP = function(item) {
      var idx = $scope.areaMainSelection.indexOf(item.id);
      // is currently selected
      if (idx > -1) {
        $scope.areaMainSelection.splice(idx, 1);
      }
      // is newly selected
      else {
        $scope.areaMainSelection.push(item.id);
      }

      _httpParams.sys_dict_id = $scope.areaMainSelection;
      _httpParams.limit = 10;
      _httpParams.skip = 0;
      getDepartmentQuotaList(_httpParams);
    }

    // search by name
    $scope.searchDeptDataQuotaByName = function() {
      _httpParams.quota_name = $scope.DepartDataQuota.quota_name_filter;
      _httpParams.limit = 10;
      _httpParams.skip = 0;
      getDepartmentQuotaList(_httpParams);
    }

    // delete data quota
    $scope.deleteQuota = function(event, quotaId) {
      var deleteFlag = event.target.checked;
      Http.deleteDataQuota({
        id: quotaId,
        delete_flag: deleteFlag ? 'true' : 'false'
      }).then(function(result) {
        if (200 == result.data.head.status) {

        }
      })
    }
  }
])

/** Inventory Controller */
DInventory.controller('Department.Inventory.Controller.detail', ['$scope', '$q', 'Department.Inventory.Service.Http', '$stateParams', '$state',
  function($scope, $q, Http, $stateParams, $state) {
    console.log($stateParams.ID);
    Http.getQuotaDetail({
      data_quota_id: $stateParams.ID
    }).then(function(result) {
      $scope.DataQuotaDetail = result.data.body[0];
      Http.getQuotaExamples({
        dataquotaid: $stateParams.ID
      }).then(function(res) {
        $scope.DataQuotaExamples = res.data.body[0];
        $scope.DataTitle = $scope.DataQuotaExamples.file_content.title;
        $scope.DataColumn = $scope.DataQuotaExamples.file_content.column;
        console.log($scope.DataTitle);
        console.log($scope.DataColumn);
      })
    })
  }
])

DInventory.controller('Department.Inventory.Controller.publish', ['$cookies', '$scope', '$state', '$q', '$uibModal', 'Department.Inventory.Service.Component', 'Department.Inventory.Service.Http',
  function($cookies, $scope, $state, $q, $uibModal, Component, Http) {
    var DATA_STORE_TYPE = 4;
    var DATA_SHOW_FORMAT = 6;
    var SECRET_FLAG = 5;
    var LEVEL_AUTH = '250375bd-02f0-11e6-a52a-5cf9dd40ad7e';
    var STORE_TYPE_OTHER = '25098ff3-02f0-11e6-a52a-5cf9dd40ad7e';
    var DATA_SHOW_OTHER = '2515e9b5-02f0-11e6-a52a-5cf9dd40ad7e';

    var LoginUser = JSON.parse($cookies.get('User'));
    var DEP_ID = LoginUser.dep_id;
    $scope.DEP_NAME = LoginUser.dep_name;
    $scope.DataQuota = {};
    $scope.DataQuota.data_show_format_add = '';
    $scope.DataQuota.data_store_type_add = '';
    $scope.DataQuota.calculate_method = '';
    $scope.DataQuota.file_name = '';
    $scope.DataQuota.linkman = '';
    $scope.DataQuota.contact_phone = '';


    Http.getDepartmentList().then(function(result) {
      $scope.deptList = result.data.body;
      var evens = _.remove($scope.deptList, function(item) {
        return item.id == DEP_ID;
      });
    });

    Http.getSystemDictByCatagory({
      'dict_category': DATA_STORE_TYPE
    }).then(function(result) {
      $scope.quotaTypeList = result.data.body;
    });

    Http.getSystemDictByCatagory({
      'dict_category': DATA_SHOW_FORMAT
    }).then(function(result) {
      $scope.dataShowFormatList = result.data.body;
    });

    Http.getSystemDictByCatagory({
      'dict_category': SECRET_FLAG
    }).then(function(result) {
      $scope.secretFlagList = result.data.body;
    });

    $scope.close = function(isValid) {
      $state.go("main.department.inventory", {}, {
        reload: true
      });
    }

    // submit add
    $scope.addQuota = function(isValid) {
      $scope.submitted = false;
      var DataQuotaAddObj = {};
      var dataRelationConfig = [];
      var dataQuotaApplyInfo = [];
      if (isValid) {

        console.log($scope.dataLevelSelection);
        DataQuotaAddObj.dataQuota = $scope.DataQuota;

        _($scope.dataLevelSelection).forEach(function(value) {
          var sys_dict = {};
          sys_dict.dataQuotaId = $scope.DataQuota.quota_name;
          sys_dict.sys_dict_id = value;
          sys_dict.obj_type = 1;
          dataRelationConfig.push(sys_dict);
        });

        var shareDeps = _.map($scope.outputDeptList, 'id');
        _(shareDeps).forEach(function(value) {
          var share_dep = {};
          share_dep.dataQuotaId = $scope.DataQuota.quota_name;
          share_dep.apply_dep = value;
          dataQuotaApplyInfo.push(share_dep);
        });

        DataQuotaAddObj.dataRelationConfig = dataRelationConfig;
        DataQuotaAddObj.dataQuotaApplyInfo = dataQuotaApplyInfo;

        console.log(DataQuotaAddObj);
        Http.saveDataQuota(DataQuotaAddObj).then(function(result) {
            console.log(result.data);
            if (200 == result.data.head.status) {
              $scope.Modal = {};

              var modalInstance = Component.popModal($scope, 'Department.Inventory.Controller.publish', '', 'import-example-modal').result.then(function(res) {
                $state.go("main.department.inventory.upload", {
                  ID: result.data.body[0].id
                }, {
                  reload: true
                });

              })

            }
            else{
              alert('保存失败');
              // $state.go("main.department.inventory", {}, {
              //   reload: true
              // });
            }
          })
          // .then(function() {
          //   $state.go("main.department.inventory", {}, {
          //     reload: true
          //   });
          // })
      }
      else{
        $scope.submitted = true;
      }
    }


    // show or hide department
    $scope.depShow = false;
    $scope.showHideDeps = function(ev) {
      if (LEVEL_AUTH == $scope.DataQuota.share_level) {
        $scope.depShow = true;
      } else {
        $scope.depShow = false;
      }
    }

    $scope.storeTypeOther = false;
    $scope.storeTypeChange = function() {
      if (STORE_TYPE_OTHER == $scope.DataQuota.data_store_type) {
        $scope.storeTypeOther = true;
      } else {
        $scope.storeTypeOther = false;
      }
    }

    $scope.dataShowOther = false;
    $scope.dataShowChange = function() {
      if (DATA_SHOW_OTHER == $scope.DataQuota.data_show_format) {
        $scope.dataShowOther = true;
      } else {
        $scope.dataShowOther = false;
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
  }

])

// upload file
DInventory.controller('Department.Inventory.Controller.upload', ['$scope', '$q', 'Department.Inventory.Service.Http', '$stateParams', '$state', '$sce',
    function($scope, $q, Http, $stateParams, $state ,$sce) {
      $scope.uploadPromise = null;

      $scope.htmlPopover = $sce.trustAsHtml("<table class='table table-hover table-striped '>"+
        "<thead><tr><th>序号</th><th>城市</th><th>GDP(亿元)</th><th>增长</th>"+
        "<th>地方公共财政收入(亿元)</th><th>增长</th><th>城镇登记失业率</th>"+
        "<th>农村居民人均纯收入(元)</th><th>增长</th></tr></thead>"+
        "<tbody><tr><td>1</td><td>成都</td><td>9000</td><td>8.54%</td><td>8000</td><td>7.51%</td>"+
        "<td>1.39</td><td>5678</td><td>3.40%</td></tr>"+
        "</tbody></table>");

      $scope.uploadFile = function() {
        var file = $scope.myFile;
        console.log('file is ');
        console.dir(file);
        if (!file) {
          alert('您还未选择文件');
          return;
        }
        $scope.uploadPromise = Http.uploadFile(file, $stateParams.ID).then(function(result) {
          if (200 == result.data.head.status) {
            alert('上传成功!');
            $state.go("main.department.inventory", {}, {
              reload: true
            });
          }
        });
      }

      $scope.toIndex = function() {
        $state.go("main.department.inventory", {}, {
          reload: true
        });
      }
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

    function getDepartQuotaList(params) {
      return $http.get(
        path + '/data_quota', {
          params: params
        }
      )
    }

    function getQuotaDetail(params) {
      return $http.get(
        path + '/data_quota_detail', {
          params: params
        }
      )
    }

    function saveDataQuota(data) {
      return $http.post(
        path + '/data_quota', {
          data: data
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

    function getQuotaExamples(params) {
      return $http.get(
        path + '/examples_detail', {
          params: params
        }
      )
    }

    function uploadFile(file, id) {
      var fd = new FormData();
      var uploadUrl = path + '/upload/excel?data_quota_id=' + id;
      fd.append('file', file);
      var promise = $http.post(uploadUrl, fd, {
        transformRequest: angular.identity,
        headers: {
          'Content-Type': undefined
        }
      });
      return promise;
    }

    function deleteDataQuota(id) {
      return $http.put(
        path + '/data_quota_delete_flag', {
          data: id
        }
      )
    }
    return {
      saveDataQuota: saveDataQuota,
      getDepartmentList: getDepartmentList,
      getDepartQuotaList: getDepartQuotaList,
      getQuotaDetail: getQuotaDetail,
      getSystemDictByCatagory: getSystemDictByCatagory,
      uploadFile: uploadFile,
      getQuotaExamples: getQuotaExamples,
      deleteDataQuota: deleteDataQuota
    }
  }
]);



/* Component */
DInventory.service('Department.Inventory.Service.Component', ['$uibModal', '$state',
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
    function popModal(scope, controller, type, templateUrl) {
      //scope.Modal.type = type;
      var modalInstance = $uibModal.open({
        animation: true,
        backdrop: 'static',
        templateUrl: templateUrl + '.html',
        controller: controller,
        scope: scope
      });
      scope.Modal.confirm = function() {
        modalInstance.close(scope.Modal);
      };
      scope.Modal.cancel = function() {
        modalInstance.dismiss();
        setTimeout(function(){
          alert('保存成功！');
          $state.go("main.department.inventory", {}, {
            reload: true
          });
        },600)

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
        var rgx=/(xls|xlsx)/i;
        var fileSuffix = element[0].files[0].name;
        var ext=fileSuffix.substring(fileSuffix.lastIndexOf(".")+1);
        if(!rgx.test(ext)) {
          scope.$apply(function() {
              scope.parentIvntObj.fileNameError = true;
          })

        }
        else {
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
      _httpParams.audit_status = 0;
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
      'dict_category': DATA_LEVEL
    }).then(function(result) {
      $scope.dataLevelList = result.data.body;
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
        console.log($scope.parentObj.deptAllList);
        console.log($scope.parentObj.outputAllDeptList);
        _($scope.parentObj.deptAllList).forEach(function(allItem) {
          allItem.icon = '<img  src=styles/images/bureau/'+ allItem.dep_en_name +' />'
          _($scope.parentObj.outputAllDeptList).forEach(function(outItem) {
            if(allItem.dep_id == outItem.dep_id) {
              allItem.ticked = true;
              $scope.parentObj.outputDeptList.push(allItem);
            }
          })
        });
        console.log($scope.parentObj.outputDeptList);
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
        path + '/opendata_quotalist', {
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

    function getDeptRequirementList() {
      _httpParams.dep_id = DEP_ID;
      $scope.reqPromise = Http.getDepartmentRequirementList(_httpParams).then(function(result) {
        $scope.requirementList = result.data.body[0].results;
        $scope.Paging.totalItems = result.data.body[0].count;
      })
    }

    $scope.dataLevelReqSelection = [];
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

    Http.getDepartmentList().then(function(result) {
      $scope.deptList = result.data.body;
      var evens = _.remove($scope.deptList, function(item) {
        return item.id == DEP_ID;
      });
    });

    $scope.publishReq = function() {
      $scope.Modal = {};
      $scope.Modal.DepRequirment = {};
      var _httpPublishParams = {};
      var dataRelationConfig = [];
      $scope.reqParent = {};

      Component.popModal($scope, '发布', 'add-req-modal').result.then(function() {
        _($scope.dataLevelReqSelection).forEach(function(value) {
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
    $scope.deleteReqFlag = false;
    $scope.deleteReq = function(id) {
      $scope.deleteReqFlag = !$scope.deleteReqFlag;
      Http.deleteRequirement({
        id: id,
        delete_flag: $scope.deleteReqFlag
      }).then(function(result) {

      })
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

    Http.getDepartQuotaList({
      dep_name: DEP_ID
    }).then(function(result) {
      console.log(result);
      $scope.depQuotaReqList = result.data.body[0].results;

      //  $scope.Paging.totalItems = data.head.total;
    });

    $scope.toConfirm = function(item) {
      // get requirement detail
      $scope.Modal.ReqDetail = item;
      $scope.Modal.ReqResponse = {};
      console.log($scope.depQuotaReqList.length);
      if($scope.depQuotaReqList.length == 0) {
        $scope.Modal.ReqResponse.data_quota_id = '';
        $scope.errorMsg = '本部门还未添加任何指标';
        $scope.dataQuotaIdNull = true;
      }
      else{
        $scope.Modal.ReqResponse.data_quota_id = $scope.depQuotaReqList[0].id;
      }

      Component.popModalConfirm($scope, '', 'confirm-req-modal').result.then(function() {
        console.log($scope.Modal.ReqResponse);
        $scope.Modal.ReqResponse.id = item.id;

        Http.updateRequirement($scope.Modal.ReqResponse).then(function(result) {
          if (200 == result.data.head.status) {
            if ($scope.Modal.ReqResponse.status == 1) {
              // 保存需求响应
              Http.saveReqResponse({
                requiement_id: item.id,
                data_quota_id: $scope.Modal.ReqResponse.data_quota_id
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
      Http.getReqDetail({
        data_requiement_id: $stateParams.ID
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

    function updateRequirement(data) {
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

    function getDepartQuotaList(params) {
      return $http.get(
        path + '/data_quota', {
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
      return $http.put(
        path + '/data_requiement_delete', {
          data: data
        }
      )
    }
    return {
      getDepartmentRequirementList: getDepartmentRequirementList,
      publishRequirement: publishRequirement,
      getReqDetail: getReqDetail,
      getResponseList: getResponseList,
      updateRequirement: updateRequirement,
      saveReqResponse: saveReqResponse,
      getDepartQuotaList: getDepartQuotaList,
      getDepartmentList: getDepartmentList,
      deleteRequirement: deleteRequirement
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
    $scope.DepartmentShare = {};

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
      $scope.sharePromise = Http.shareDataQuotaList(_httpParams).then(function(result) {
        $scope.depShareList = result.data.body[0].results;
        $scope.Paging.totalItems = result.data.body[0].count;
      });
    }

    //init
    getDepartmentShareList(_httpParams);

    // share level all
    $scope.getShareLevelAllForShare = function() {
      $scope.shareLvShareSelection = [];
      _httpParams.share_level = null;
      _httpParams.limit = 10;
      _httpParams.skip = 0;
      getDepartmentShareList(_httpParams);
    }

    // filter by share level
    $scope.shareLvShareSelection = [];
    $scope.getShareDataQuotaListBySl = function(item) {
      var idx = $scope.shareLvShareSelection.indexOf(item.id);
      if (idx > -1) {
        $scope.shareLvShareSelection = [];
      } else {
        $scope.shareLvShareSelection = item.id;
      }
      _httpParams.share_level = $scope.shareLvShareSelection;
      _httpParams.limit = 10;
      _httpParams.skip = 0;
      getDepartmentShareList(_httpParams);
    }

    // get data level all
    $scope.getDataLevelAllForShare = function() {
      $scope.dataLevelShareSelection = [];
      _httpParams.sys_dict_id = null;
      _httpParams.limit = 10;
      _httpParams.skip = 0;
      getDepartmentShareList(_httpParams);
    }

    // filter by partial
    $scope.dataLevelShareSelection = [];
    $scope.getShareDataQuotaListByAP = function(item) {
      var idx = $scope.dataLevelShareSelection.indexOf(item.id);
      // is currently selected
      if (idx > -1) {
        $scope.dataLevelShareSelection.splice(idx, 1);
      }
      // is newly selected
      else {
        $scope.dataLevelShareSelection.push(item.id);
      }

      _httpParams.sys_dict_id = $scope.dataLevelShareSelection;
      _httpParams.limit = 10;
      _httpParams.skip = 0;
      getDepartmentShareList(_httpParams);
    }

    // search by name
    $scope.searchShareDataQuotaByName = function() {
      _httpParams.quota_name = $scope.DepartmentShare.quota_name_filter;
      _httpParams.limit = 10;
      _httpParams.skip = 0;
      getDepartmentShareList(_httpParams);
    }

    // follow department
    $scope.followChange = function(event,depId) {
      var value = event.target.checked;
      console.log(value);
      if(value) {// follow
        Http.followDepartment({
          follow_dep_id: depId
        }).then(function(result) {
          if (200 == result.data.head.status) {

          }
          else {

          }
        })
      }
      else{// cancel follow
        Http.cancelFollowDepartment({
          follow_dep_id: depId
        }).then(function(result) {
          if (200 == result.data.head.status) {

          }
          else {

          }
        })
      }

    }
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

    function shareDataQuotaList(params) {
      return $http.get(
        path + '/sharedata_quotalist', {
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
    }

    function followDepartment(id) {
      return $http.post(
        path + '/user_dep', {
          data: id
        }
      )
    }

    function cancelFollowDepartment(id) {
      return $http.delete(
        path + '/user_dep', {
          data: id
        }
      )
    }
    return {
      shareDataQuotaList: shareDataQuotaList,
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
