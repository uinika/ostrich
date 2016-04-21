'use strict';
/* Bootstrap Application */
var app = angular.module('app', [
  'Config',
  'ui.router',
  'ui.bootstrap',
  'isteven-multi-select',
  'Login',
  'Main',
  'Dashboard',
  'Department',
  'Inventory',
  'InventoryDetail',
  'Department.Inventory',
  'Department.Audit',
  'Department.SystemUser',
  'Department.Requirement',
  'RequirementMain',
  'RequirementDetail',
  'DepartmentShare'
]);

app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider', '$provide',
  function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, $provide) {
    /** URL Location Mode */
    $locationProvider.html5Mode(false);
    /** HTTP Interceptor */
    $httpProvider.interceptors.push(['$q',
      function($q) {
        return {
          'request': function(config) {
            config.withCredentials = true;
            return config;
          },
          'requestError': function(rejection) {
            return response;
          },
          'response': function(response) {
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
      .state('main.inventory', {
        url: '/inventory',
        templateUrl: 'views/inventory/main.html',
        controller: 'Inventory.Controller.Main'
      })
      .state('main.inventory.list', {
        url: '/list',
        templateUrl: 'views/inventory/list.html',
        controller: 'Inventory.Controller.Main'
      })
      .state('main.inventory.detail', {
        url: '/detail/:inventoryID',
        templateUrl: 'views/inventory/detail.html',
        controller: 'InventoryDetail.Controller.Main'
      })
      .state('main.requirement', {
        url: '/requirement',
        templateUrl: 'views/requirement/main.html',
        controller: 'RequirementMain.Controller.Main'
      })
      .state('main.requirement.detail', {
        url: '/detail/:requirementID',
        templateUrl: 'views/requirement/detail.html',
        controller: 'RequirementDetail.Controller.Main'
      })
      .state('main.department', {
        url: '/department',
        templateUrl: 'views/department/main.html',
        controller: 'Department.Controller.Main'
      })
      .state('main.department.inventory', {
        url: '/inventory',
        templateUrl: 'views/department/inventory.html',
        controller: 'Department.Inventory.Controller.Main'
      })
      .state('main.department.inventory.publish', {
        url: '/publish',
        templateUrl: 'views/department/inventory-publish.html',
        controller: 'Department.Inventory.Controller.publish'
      })
      .state('main.department.share', {
        url: '/share',
        templateUrl: 'views/department/share.html',
        controller: 'DepartmentShare.Controller.Main'
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
        url: '/info?AUDITID',
        templateUrl: 'views/department/audit-info.html',
        controller: 'Department.Audit.Controller.info'
      })
      .state('main.department.user', {
        url: '/user',
        templateUrl: 'views/department/user.html',
        controller: 'Department.SystemUser.Controller.Main'
      })
  }
]);

'use strict';
/* Application Configration */
var Config = angular.module('Config', []);

Config.constant('API', {
  path: 'http://192.168.13.224:8080/drrp/api' //测试组
  // path:'http://localhost:5001/api' //本机测试
  // path: 'http://172.16.1.81:8080/api' //周爽
  // path: 'http://172.16.1.77:8080/api' //吴陶冶
  //   path: 'http://172.16.1.78:8080/api' //米兵

});

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
      endTime: 0,
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

'use strict';
var Login = angular.module('Login', ['ui.router']);

/** Main Controller */
Login.controller('Login.Controller.Main', ['$rootScope', '$scope', '$state', 'Login.Service.Http',
  function($rootScope, $scope, $state, Http) {
    $scope.Login = {};

    $scope.Login.submit = function() {
      var username = $scope.Login.username;
      var password = $scope.Login.password;
      Http.login({
        USERNAME: username,
        PASSWORD: password
      }).then(function(result) {
        $rootScope.User = result.data.body[0];
        console.log(result.data.body[0]);
        if(200 == result.data.head.status){
          $state.go("main.dashboard");
        }
        else{
          $state.go("login");
        }
      });
    }
  }


])


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
var Main = angular.module('Main', ['ui.router']);

/** Main Controller */
Main.controller('Main.Controller.Main', ['$scope',
  function($scope) {
    $scope.Tab = {};
    $scope.Tab.switcher = function(target){
      switch (target) {
        case 'dashboard': $scope.Tab.Actived = {};
          $scope.Tab.Actived.dashboard = 'active'; break;
        case 'inventory': $scope.Tab.Actived = {};
          $scope.Tab.Actived.inventory = 'active'; break;
        case 'requirement': $scope.Tab.Actived = {};
          $scope.Tab.Actived.requirement = 'active'; break;
        case 'department': $scope.Tab.Actived = {};
          $scope.Tab.Actived.department = 'active'; break;
      }
    };
    $scope.Tab.active = 'active';
  }
]);

'use strict';
var Audit = angular.module('Department.Audit', ['ui.router']);

/** Main Controller */
Audit.controller('Department.Audit.Controller.Main', ['$rootScope', '$scope', '$q','Department.Audit.Service.Http',
  function($rootScope, $scope, $q ,Http) {
    var _httpParams = {};
    console.log($rootScope.User);

    // init
    getAuditList(_httpParams);

    Http.getAuditTotal().then(function(result) {
      $scope.auditTotal = result.data.body[0].INVENTORY_NUM;
    });

    Http.getShareLevelFilter().then(function(result) {
      $scope.shareLevelList = result.data.body;
    });

    Http.getSpatialFilter().then(function(result) {
      $scope.areaPeriodList = result.data.body;
    });

    Http.getAuditStatusFilter().then(function(result) {
      $scope.auditStatusList = result.data.body;
    });

    function getAuditList(_httpParams) {
      Http.getAuditList(_httpParams).then(function(result){
        $scope.auditList = result.data.body;
      //  $scope.Paging.totalItems = data.head.total;
      });
    }

    // filter by share level
    $scope.shareLvSelection = [];
    $scope.getAuListBySl = function(item) {
      var idx = $scope.shareLvSelection.indexOf(item.SYS_DICT_ID);
      if (idx > -1) {
        $scope.shareLvSelection = [];
      }
      else {
        $scope.shareLvSelection = item.SYS_DICT_ID;
      }
      _httpParams.SHARE_LEVEL = $scope.shareLvSelection;
      _httpParams.limit = 10;
      _httpParams.skip = 0;
      getAuditList(_httpParams);
    }

    // filter by partial
    $scope.areaSelection = [];
    $scope.getAuListByAP = function(item) {
      var idx = $scope.areaSelection.indexOf(item.SYS_DICT_ID);
      // is currently selected
      if (idx > -1) {
        $scope.areaSelection.splice(idx, 1);
      }
      // is newly selected
      else {
        $scope.areaSelection.push(item.SYS_DICT_ID);
      }
      console.log($scope.areaSelection);

      _httpParams.AREA_DATA_LEVEL = $scope.areaSelection;
      _httpParams.limit = 10;
      _httpParams.skip = 0;
        getAuditList(_httpParams);
    }

    // filter by audit status
    $scope.statusSelection = [];
    $scope.getAuListBySta = function(item) {
      var idx = $scope.statusSelection.indexOf(item.AUDITNAME);
      if (idx > -1) {
        $scope.statusSelection = [];
      }
      else {
        $scope.statusSelection = item.AUDITNAME;
      }
      _httpParams.AUDIT_STATUS = item.AUDIT_STATUS;
      _httpParams.limit = 10;
      _httpParams.skip = 0;
      getAuditList(_httpParams);
    }

    // share level all
    $scope.getShareLevelAll = function() {
      $scope.shareLvSelection = [];
      _httpParams.SHARE_LEVEL = null;
      _httpParams.limit = 10;
      _httpParams.skip = 0;
      getAuditList(_httpParams);
    }

    // get spatial all
    $scope.getSpatialAll = function() {
      $scope.areaSelection = [];
      _httpParams.AREA_DATA_LEVEL = null;
      _httpParams.limit = 10;
      _httpParams.skip = 0;
      getAuditList(_httpParams);
    }

    // get status all
    $scope.getStatusAll = function() {
      $scope.statusSelection = [];
      _httpParams.AUDIT_STATUS = null;
      _httpParams.limit = 10;
      _httpParams.skip = 0;
      getAuditList(_httpParams);
    }
  }
])


Audit.controller('Department.Audit.Controller.info', ['$rootScope' ,'$scope', '$state', '$q','Department.Audit.Service.Http', '$stateParams',
  function($rootScope, $scope, $state, $q ,Http ,$stateParams) {
    // login Department
    $scope.depName = $rootScope.User.DEP_NAME;
    var auditId = $stateParams.AUDITID;
    Http.getAuditDetail({
      "AUDITID": auditId
    }).then(function(result) {
      $scope.AuditDetail = result.data.body[0];
    });

    $scope.submitAudit = function() {
      var AUDITOR = $rootScope.User.PERSON_NAME;
      var auditInfo = _.assign($scope.AuditInfo, {"AUDITOR": AUDITOR}, {"ID": auditId});
      console.log(auditInfo);
      Http.updateAuditDetail(auditInfo).then(function(result) {
        if (200 == result.data.head.status) {
          alert('审核成功');
          var idx = $scope.auditList.indexOf(auditId);
          $state.go("main.department.audit",{}, { reload: true });
        }
        else{
          alert('审核失败');
        }
      });
    }
  }])

/* HTTP */
Audit.factory('Department.Audit.Service.Http', ['$http', '$q', 'API',
  function($http, $q, API) {
    var path = API.path;

    function getAuditTotal(params) {
      return $http.get(
        path + '/openInventory/countAll',
        {
          params:params
        }
      )
    };

    function getShareLevelFilter(params) {
      return $http.get(
        path + '/openInventory/countByShareLevel',
        {
          params:params
        }
      )
    }

    function getSpatialFilter(params) {
      return $http.get(
        path + '/openInventory/countBySpatial',
        {
          params:params
        }
      )
    }

    function getAuditStatusFilter(params) {
      return $http.get(
        path + '/openInventory/countByAuditStatus',{
          params:params
        }
      )
    }

    function getAuditList(params) {
      return $http.get(
        path + '/openInventory/inventoryList', {
          params:params
        }
      )
    }

    function getAuditDetail(params) {
      return $http.get(
        path + '/openInventory/openInventoryInfo', {
          params:params
        }
      )
    }

    function updateAuditDetail(data) {
      return $http.put(
        path + '/openInventory/updateAuditStatus', {
          data:data
        }
      )
    }
    return {
      getAuditTotal: getAuditTotal,
      getShareLevelFilter: getShareLevelFilter,
      getSpatialFilter: getSpatialFilter,
      getAuditStatusFilter: getAuditStatusFilter,
      getAuditList: getAuditList,
      getAuditDetail: getAuditDetail,
      updateAuditDetail: updateAuditDetail
    }
  }
]);

'use strict';
var DInventory = angular.module('Department.Inventory', ['ui.router']);

/** Inventory Controller */
DInventory.controller('Department.Inventory.Controller.Main', ['$scope', '$q', 'Department.Inventory.Service.Http',
  function($scope, $q, Http) {
    var _httpParams = {};
    _httpParams.limit = 10;
    _httpParams.skip = 0;

    // init
    getDepartmentInvntList(_httpParams);

    Http.getInventoryDepTotal().then(function(result) {
      $scope.ivntDepTotal = result.data.body[0].INVENTORY_NUM;
      $scope.depName = result.data.body[0].DEP_NAME;
    });

    Http.getShareLevelFilter().then(function(result) {
      $scope.shareLevelList = result.data.body;
    });

    Http.getSpatialFilter().then(function(result) {
      $scope.areaPeriodList = result.data.body;
    });


    function getDepartmentInvntList(_httpParams) {
      Http.getDepartInvntList(_httpParams).then(function(result) {
        $scope.depIvntList = result.data.body;
        //  $scope.Paging.totalItems = data.head.total;
      });
    }

    // filter by share level
    $scope.shareLvMainSelection = [];
    $scope.getIvntListBySl = function(item) {
      var idx = $scope.shareLvMainSelection.indexOf(item.SYS_DICT_ID);
      if (idx > -1) {
        $scope.shareLvMainSelection = [];
      } else {
        $scope.shareLvMainSelection = item.SYS_DICT_ID;
      }
      _httpParams.SHARE_LEVEL = $scope.shareLvMainSelection;
      _httpParams.limit = 10;
      _httpParams.skip = 0;
      getDepartmentInvntList(_httpParams);
    }

    // filter by partial
    $scope.areaMainSelection = [];
    $scope.getIvntListByAP = function(item) {
      var idx = $scope.areaMainSelection.indexOf(item.DICTID);
      // is currently selected
      if (idx > -1) {
        $scope.areaMainSelection.splice(idx, 1);
      }
      // is newly selected
      else {
        $scope.areaMainSelection.push(item.SYS_DICT_ID);
      }
      console.log($scope.areaMainSelection);

      _httpParams.AREA_DATA_LEVEL = $scope.areaMainSelection;
      _httpParams.limit = 10;
      _httpParams.skip = 0;
      getDepartmentInvntList(_httpParams);
    }

    // share level all
    $scope.getShareLevelAll = function() {
      $scope.shareLvMainSelection = [];
      _httpParams.SHARE_LEVEL = null;
      _httpParams.limit = 10;
      _httpParams.skip = 0;
      getDepartmentInvntList(_httpParams);
    }

    // get spatial all
    $scope.getSpatialAll = function() {
      $scope.areaMainSelection = [];
      _httpParams.AREA_DATA_LEVEL = null;
      _httpParams.limit = 10;
      _httpParams.skip = 0;
      getDepartmentInvntList(_httpParams);
    }


  }
])

DInventory.controller('Department.Inventory.Controller.publish', ['$rootScope', '$scope', '$q', '$uibModal', 'Department.Inventory.Service.Component', 'Department.Inventory.Service.Http',
  function($rootScope, $scope, $q, $uibModal, Component, Http) {
    $scope.step1 = {};
    $scope.step2 = {};
    $scope.step3 = {};
    $scope.step4 = {};
    $scope.step1.show = true;
    $scope.step2.show = false;
    $scope.step3.show = false;
    $scope.step4.show = false;
    $scope.progress = 0;
    $scope.loginUser = $rootScope.User;


    const SHARE_FREQUENCY = 1;
    const DATA_LEVEL = 2;
    const SHARE_LEVEL = 3;
    const QUOTA_TYPE = 4;
    const DATA_SHOW_FORMAT = 6;
    const SECRET_FLAG = 5;
    const LEVEL_AUTH = '250375bd-02f0-11e6-a52a-5cf9dd40ad7e';
    $scope.inventoryAttrList = [];
    $scope.DataExamps = [];

    $scope.exampTitles = [];

    $scope.submitObject = {};

    Date.prototype.format = function(fmt) { //author: meizz
      var o = {
        "%m": this.getMonth() + 1 + '', //月份
        "%d": this.getDate() + '', //日
        "%H": this.getHours() + '', //小时
        "%M": this.getMinutes() + '', //分
        "%S": this.getSeconds() + '', //秒
        //"q+" : Math.floor((this.getMonth()+3)/3), //季度
      };
      // 年份  2015
      if (/(%Y)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + ""));

      // 两位年份  15
      if (/(%y)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(2));

      //getTime返回的是以毫秒为单位的，转为秒
      if (/(%s)/.test(fmt))
      //fmt=fmt.replace(RegExp.$1, this.getTime()/1);
        fmt = fmt.replace(RegExp.$1, (this.getTime() + '').slice(0, 10));

      for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) {
          fmt = fmt.replace(RegExp.$1, (o[k].length == 2 ? o[k] : '0' + o[k]));
        }
      return fmt;
    }

    // init
    $scope.shareFreqSelection = [];
    $scope.dataLevelSelection = [];
    $scope.shareFreqArrShow = [];
    // toggle selection for a given item by name
    $scope.toggleShareFreqSelection = function toggleShareFreqSelection(itemId, itemName) {
      var idx = $scope.shareFreqSelection.indexOf(itemId);

      // is currently selected
      if (idx > -1) {
        $scope.shareFreqSelection.splice(itemId, 1);
        $scope.shareFreqArrShow.splice(itemName, 1);
      }

      // is newly selected
      else {
        $scope.shareFreqSelection.push(itemId);
        $scope.shareFreqArrShow.push(itemName);
      }
    };

    $scope.Modal = {};
    $scope.Modal.Quota = {};
    $scope.Modal.Quota.dataLevelSelection = [];

    $scope.toggleDataLevelSelection = function toggleDataLevelSelection(item) {
      var idx = $scope.dataLevelSelection.indexOf(item.ID);
      var idxModal = $scope.Modal.Quota.dataLevelSelection.indexOf(item.DICT_NAME);
      // is currently selected
      if (idx > -1) {
        $scope.dataLevelSelection.splice(idx, 1);
      }

      // is newly selected
      else {
        $scope.dataLevelSelection.push(item.ID);
      }

      if (idxModal > -1) {
        $scope.Modal.Quota.dataLevelSelection.splice(idx, 1);
      }

      // is newly selected
      else {
        $scope.Modal.Quota.dataLevelSelection.push(item.DICT_NAME);
      }
    };

    Http.getSystemDictByCatagory({
      'DICT_CATEGORY': SHARE_FREQUENCY
    }).then(function(result) {
      $scope.shareFrequencyList = result.data.body;
    });

    Http.getSystemDictByCatagory({
      'DICT_CATEGORY': DATA_LEVEL
    }).then(function(result) {
      $scope.dataLevelList = result.data.body;
    });

    Http.getSystemDictByCatagory({
      'DICT_CATEGORY': SHARE_LEVEL
    }).then(function(result) {
      $scope.shareLevelList = result.data.body;
    });

    Http.getDepartmentList().then(function(result) {
      $scope.deptList = result.data.body;
      $scope.deptListModal = result.data.body;
    });

    // show or hide department
    $scope.depShow = false;
    $scope.depShowModal = false;
    $scope.showHideDeps = function(ev) {
      if (LEVEL_AUTH == $scope.dataInfo.shareLevel) {
        $scope.depShow = true;
      } else {
        $scope.depShow = false;
      }
      if ('授权开放' == $scope.Modal.Quota.shareLevel) {
        $scope.depShowModal = true;
      } else {
        $scope.depShowModal = false;
      }
      console.log($scope.depShow);
    }


    $scope.backToStep1 = function() {
      $scope.step1.show = true;
      $scope.step2.show = false;
      $scope.progress = 0;
    }

    $scope.toStep3 = function() {
      if (!$scope.inventoryAttrList || $scope.inventoryAttrList.length == 0) {
        alert('请先添加指标属性！');
        return;
      }
      $scope.step3.show = true;
      $scope.step2.show = false;
      $scope.progress = 50;

      $scope.DataExamps = $scope.inventoryAttrList;
    }

    $scope.backToStep2 = function() {
      $scope.step2.show = true;
      $scope.step3.show = false;
      $scope.progress = 25;
    }

    $scope.toStep4 = function() {
      if (!$scope.ExampDatas || $scope.ExampDatas.length == 0) {
        alert('请先添加示例数据！');
        return;
      }
      $scope.step4.show = true;
      $scope.step3.show = false;
      $scope.progress = 75;


    }

    $scope.backToStep3 = function() {
      $scope.step3.show = true;
      $scope.step4.show = false;
      $scope.progress = 50;
    }

    $scope.toStep2 = function(isValid) {
      if (isValid) {
        $scope.step2.show = true;
        $scope.step1.show = false;
        $scope.progress = 25;

        $scope.step1_data = {};
        var data_info_add_configs = [];


        var sys_dicts = _.union($scope.shareFreqSelection, $scope.dataLevelSelection);
        _(sys_dicts).forEach(function(value) {
          var sys_dict = {};
          sys_dict.dataInfoId = $scope.dataInfo.dataName
          sys_dict.sysDictId = value;
          data_info_add_configs.push(sys_dict);
        });

        var shareDeps = [];
        if ($scope.dataInfo.shareLevel == LEVEL_AUTH) { // 指定部门开放
          shareDeps = _.map($scope.outputDeptList, 'ID');
        }
        if (shareDeps.length == 0) {
          shareDeps = "0";
        }

        $scope.dataInfo.publishTime = $scope.dataInfo.publishTime.format('%Y-%m-%d');
      //  if($scope.dataInfo.areaPeri)
        $scope.dataInfo = _.assign($scope.dataInfo, {
          'shareDeps': shareDeps
        }, {
          'depId': $rootScope.User.DEP_ID
        });

        $scope.step1_data = _.assign({
          'dataInfo': $scope.dataInfo
        }, {
          'dataInfoAddConfigs': data_info_add_configs
        });

        window.console.log($scope.step1_data);
      }
    };

    // pop add attribute modal
    $scope.popAttrAddModal = function() {
      $scope.Modal = {}; // Clean scope of modal
      $scope.Modal.Quota = {}; // Clean scope of modal
      $scope.Modal.Quota.dataLevelSelection = [];

      // Get system dict
      Http.getSystemDictByCatagory({
        'DICT_CATEGORY': QUOTA_TYPE
      }).then(function(result) {
        $scope.quotaTypeList = result.data.body;
      });
      Http.getSystemDictByCatagory({
        'DICT_CATEGORY': DATA_SHOW_FORMAT
      }).then(function(result) {
        $scope.dataShowFormatList = result.data.body;
      });
      Http.getSystemDictByCatagory({
        'DICT_CATEGORY': SECRET_FLAG
      }).then(function(result) {
        $scope.secretFlagList = result.data.body;
      });


      Component.popModal($scope, '添加', 'add-indicator-modal').result.then(function() {
        var shareDeps = [];
        if ($scope.Modal.Quota.shareLevel == LEVEL_AUTH) { // 指定部门开放
          shareDeps = _.map($scope.outputModalDeptList, 'ID');
        }
        if (shareDeps.length == 0) {
          shareDeps = "0";
        }

        // format areaDataLevel to string
        var areaDataLevelStr = '';
        _.forEach($scope.Modal.Quota.dataLevelSelection, function(value) {
          areaDataLevelStr = areaDataLevelStr + value + ",";
        })

        var invntModalData = _.assign({
          "areaDataLevel": areaDataLevelStr
        }, {
          "shareDeps": shareDeps
        }, {
          "createTime": new Date()
        },$scope.Modal.Quota);

        $scope.inventoryAttrList.push(invntModalData);

        $scope.step2_data = {};
        $scope.dataQuota = [];


        _.forEach($scope.inventoryAttrList, function(item, index) {
          item.dataLevelSelection = null;
          var step2_obj = _.assign({
            'dataInfoId': $scope.dataInfo.dataName
          }, item, {
            'showOrder': index + 1
          });
          $scope.dataQuota.push(step2_obj);
        });
        $scope.step2_data.dataQuota = $scope.dataQuota;
      });
    }

    $scope.ExampDatas = [];
    $scope.dataCells = [];
    $scope.step3_data = {};
    $scope.addExampData = function() {
      $scope.ExampModal = {}; // Clean scope of modal
      $scope.ExampModal.ExampData = {}; // Clean scope of modal

      $scope.rowDatas = [];


      Component.popModal($scope, '添加', 'add-example-modal').result.then(function() {
        window.console.log($scope.step2_data.dataQuota);
        _.forEach($scope.step2_data.dataQuota, function(item, index) {
          var dataObj = _.assign({
            'rowKey': item.showOrder
          }, {
            'dataQuotaValue': item.dataValue
          }, {
            'dataQuotaId': item.quotaName
          })
          $scope.rowDatas.push(dataObj);
          $scope.dataCells.push(dataObj);
        })
        $scope.ExampDatas.push($scope.rowDatas);

        $scope.step3_data.dataExamples = $scope.dataCells;
      });
    }

    // total submit
    $scope.addFormSubmit = function() {
      $scope.step4_data = {};
      $scope.step4_data.dataOtherInfo =
        _.assign({
          'dataInfoId': $scope.dataInfo.dataName
        }, $scope.DataOtherInfo);

      $scope.submitObject = _.assign($scope.step1_data, $scope.step2_data, $scope.step3_data, $scope.step4_data);

      console.log($scope.submitObject);
      // $scope.submitObject.dataLevelSelection = null;
      Http.saveInventory($scope.submitObject).then(function(result) {
        console.log(result.data.head);
        if (200 == result.data.head.status) {
          $scope.progress = 100;
          alert('添加成功');
        }
      })
    }

    // Datepicker
    $scope.popup2 = {
      opened: false
    };
    $scope.openDatePicker = function() {
      $scope.popup2.opened = true;
    };
  }
])

/* HTTP */
DInventory.factory('Department.Inventory.Service.Http', ['$http', '$q', 'API',
  function($http, $q, API) {
    var path = API.path;

    function saveInventory(data) {
      return $http.post(
        path + '/inventory', {
          data: data
        }
      )
    };

    function getSystemDictByCatagory(params) {
      return $http.get(
        path + '/dict', {
          params: params
        }
      )
    };

    function getDepartmentList() {
      return $http.get(
        path + '/dep/'
      )
    }

    function getInventoryDepTotal() {
      return $http.get(
        path + '/inventory/getDepWithInventoryNumByDep'
      )
    }

    function getDepartInvntList(params) {
      return $http.get(
        path + '/inventory/inventoryListByDep', {
          params: params
        }
      )
    }

    function getShareLevelFilter(params) {
      return $http.get(
        path + '/inventory/getShareDictWithInventoryNumByDep', {
          params: params
        }
      )
    }

    function getSpatialFilter(params) {
      return $http.get(
        path + '/inventory/getAreaDictWithInventoryNumByDep', {
          params: params
        }
      )
    }
    return {
      saveInventory: saveInventory,
      getSystemDictByCatagory: getSystemDictByCatagory,
      getDepartmentList: getDepartmentList,
      getDepartInvntList: getDepartInvntList,
      getShareLevelFilter: getShareLevelFilter,
      getSpatialFilter: getSpatialFilter,
      getInventoryDepTotal: getInventoryDepTotal
    }
  }
]);



/* Component */
DInventory.service('Department.Inventory.Service.Component', ['$uibModal',
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

'use strict';
var Department = angular.module('Department', ['ui.router']);

/** Main Controller */
Department.controller('Department.Controller.Main', ['$scope', '$q','Department.Service.Http',
  function($scope, $q ,Http) {
    var starTime = getFirstDayMonth();
    var endTime = getNowDate();

    // get current month
    function getFirstDayMonth() {
      var now = new Date();
      return "" + now.getFullYear() + "-" + (now.getMonth() + 1) + '-01 00:00:00';
    }
    function getNowDate() {
      var now = new Date();
      return "" + now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate() + ' 23:59:59';
    }

    Http.getInventoryTotal(null).then(function(result) {
      $scope.inventoryTotal = result.data.body[0].TOTAL;
    });
    Http.getInventoryTotal({
      startDate: starTime,
      endDate: endTime
    }).then(function(result) {
      $scope.inventoryMonthTotal = result.data.body[0].TOTAL;
    });

    Http.getShareTotal().then(function(result) {
      $scope.shareTotal = result.data.body[0].TOTAL
    });
    Http.getShareTotal({
      startDate: starTime,
      endDate: endTime
    }).then(function(result) {
      $scope.shareMonthTotal = result.data.body[0].TOTAL
    });

    Http.getRequirementTotal().then(function(result) {
      $scope.requirementTotal = result.data.body[0].TOTAL;
    });
    Http.getRequirementTotal({
      startDate: starTime,
      endDate: endTime
    }).then(function(result) {
      $scope.requirementMonthTotal = result.data.body[0].TOTAL;
    });

    Http.getUnauditTotal().then(function(result) {
      $scope.unauditTotal = result.data.body[0].TOTAL;
    });

    Http.getInventoryList({
      skip: 0,
      limit: 6
    }).then(function(result) {
      $scope.unauditInventoryList = result.data.body;
    })

    Http.getResponseList({
      skip: 0,
      limit: 6
    }).then(function(result) {
      $scope.responseList = result.data.body;
      $scope.responseTotal = result.data.head.total;
    })
  }
])


/* HTTP */
Department.factory('Department.Service.Http', ['$http', '$q', 'API',
  function($http, $q, API) {
    var path = API.path;

    function getInventoryTotal(params) {
      return $http.get(
        path + '/inventoryTotal/department',
        {params: params}
      )
    };

    function getShareTotal(params) {
      return $http.get(
        path + '/shareTotal/department',
        {params: params}
      )
    };

    function getRequirementTotal(params) {
      return $http.get(
        path + '/requirementTotal/department',
        {params: params}
      )
    }

    function getUnauditTotal(){
      return $http.get(
        path + '/dataAuditInfoTotal/department'
      )
    }

    function getInventoryList(params){
      return $http.get(
        path + '/inventory/department', {params: params}
      )
    }

    function getResponseList(params) {
      return $http.get(
        path + '/requirementResponse/department', {params: params}
      )
    }
    return {
      getInventoryTotal: getInventoryTotal,
      getShareTotal: getShareTotal,
      getRequirementTotal: getRequirementTotal,
      getUnauditTotal: getUnauditTotal,
      getInventoryList: getInventoryList,
      getResponseList: getResponseList
    }
  }
]);

'use strict';
var DepartmentReq = angular.module('Department.Requirement', ['ui.router']);

/** DepartmentReq Controller */
DepartmentReq.controller('Department.Requirement.Controller.Main', ['$rootScope', '$scope', '$stateParams', 'Department.Inventory.Service.Component', 'Department.Requirement.Service.Http',
  function($rootScope, $scope, $stateParams, Component, Http) {
    // init
    getReqList();

    function getReqList() {
      Http.getDepartmentRequirementList({
        "skip": 0,
        "limit": 10
      }).then(function(result) {
        $scope.requirementList = result.data.body;
      })
    }

    $scope.publishReq = function() {
      $scope.Modal = {};
      $scope.req = {};
      Component.popModal($scope, '发布', 'add-req-modal').result.then(function() {
        Http.publishReq($scope.req).then(function(result) {
          if (200 == result.data.head.status) {
            alert('发布成功');
            getReqList();
          } else {
            alert('发布失败');
          }
        })
      });
    }

    $scope.updateReq = function(item) {
      $scope.Modal = {};
      $scope.req = item;

      Component.popModal($scope, '修改', 'add-req-modal').result.then(function() {
        Http.updateReq({
          "ID" : $scope.req.ID,
          "REQUIREMENT_NAME" : $scope.req.REQUIREMENT_NAME,
          "REQUIREMENT_DESC" : $scope.req.REQUIREMENT_DESC,
          "LINKMAN" : $scope.req.LINKMAN,
          "EMAIL":$scope.req.EMAIL
        }).then(function(result) {
          if (200 == result.data.head.status) {
            alert('修改成功');
            getReqList();
          } else {
            alert('修改失败');
          }
        })
      });
    }

    $scope.deleteReq = function(ID) {
      Http.deleteReq(ID).then(function(result) {
        if (200 == result.data.head.status) {
          alert('删除成功');
          getReqList();
        } else {
          alert('删除失败');
        }
      })
    }

  }
])

/** DepartmentReq Controller */
DepartmentReq.controller('Department.Requirement.Controller.detail', ['$scope', '$stateParams', 'Department.Requirement.Service.Http',
  function( $scope, $stateParams, Http) {
    console.log($stateParams.ID);
    Http.getReqDetail({
      "ID": $stateParams.ID
    }).then(function(result) {
      $scope.ReqDetail = result.data.body[0];
    }).then(function(){
      Http.getResponseList({
        "REQUIREMENT_ID": $stateParams.ID
      }).then(function(result) {
        $scope.responseList = result.data.body;
      })
    })
  }])

/* HTTP Factory */
DepartmentReq.factory('Department.Requirement.Service.Http', ['$http', 'API',
  function($http, API) {
    var path = API.path;

    function getDepartmentRequirementList(params) {
      return $http.get(
        path + '/requirement/getRequirementListByDep', {
          params: params
        }
      )
    };

    function publishReq(data) {
      return $http.post(
        path + '/requirement', {
          data: data
        }
      )
    }

    function updateReq(data) {
      return $http.put(
        path + '/requirement/' , {
          data: data
        }
      )
    }

    function deleteReq(data) {
      return $http.delete(
        path + '/requirement/' , {
          data:{"ID":data}
        }
      )
    }

    function getReqDetail(params) {
      return $http.get(
        path + '/requirement/requireDetail', {
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
    return {
      getDepartmentRequirementList: getDepartmentRequirementList,
      publishReq: publishReq,
      updateReq: updateReq,
      deleteReq: deleteReq,
      getReqDetail: getReqDetail,
      getResponseList: getResponseList
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

'use strict';
var DepartmentShare = angular.module('DepartmentShare', ['ui.router']);

/** InventoryDetail Controller */
DepartmentShare.controller('DepartmentShare.Controller.Main', ['$rootScope', '$scope', '$stateParams', 'DepartmentShare.Service.Http',
  function($rootScope, $scope, $stateParams, Http) {
    $scope.DepartmentShare = {};
    var _httpParams = {};
    _httpParams.limit = 10;
    _httpParams.skip = 0;

    //init
    getDepartmentShareList(_httpParams);

    function getDepartmentShareList(_httpParams) {
      Http.inventoryList(_httpParams).then(function(result) {
        $scope.depShareList = result.data.body;
        //  $scope.Paging.totalItems = data.head.total;
      });
    }

    Http.countAll().then(function(result) {
      if(200 == result.data.head.status){
        $scope.DepartmentShare.countAll = result.data.body[0].NUMBER;
      }
    });

    Http.countByShareLevel().then(function(result) {
      $scope.shareLevelList = result.data.body;
    });

    Http.countBySpatial().then(function(result) {
      $scope.areaPeriodList = result.data.body;
    });

    // filter by share level
    $scope.shareLvShareSelection = [];
    $scope.getIvntListBySl = function(item) {
      var idx = $scope.shareLvShareSelection.indexOf(item.SYS_DICT_ID);
      if (idx > -1) {
        $scope.shareLvShareSelection = [];
      } else {
        $scope.shareLvShareSelection = item.SYS_DICT_ID;
      }
      _httpParams.SHARE_LEVEL = $scope.shareLvShareSelection;
      _httpParams.limit = 10;
      _httpParams.skip = 0;
      getDepartmentShareList(_httpParams);
    }

    // filter by partial
    $scope.areaShareSelection = [];
    $scope.getIvntListByAP = function(item) {
      var idx = $scope.areaShareSelection.indexOf(item.SYS_DICT_ID);
      // is currently selected
      if (idx > -1) {
        $scope.areaShareSelection.splice(idx, 1);
      }
      // is newly selected
      else {
        $scope.areaShareSelection.push(item.SYS_DICT_ID);
      }
      console.log($scope.areaShareSelection);

      _httpParams.AREA_DATA_LEVEL = $scope.areaShareSelection;
      _httpParams.limit = 10;
      _httpParams.skip = 0;
      getDepartmentShareList(_httpParams);
    }

    // share level all
    $scope.getShareLevelAll = function() {
      $scope.shareLvShareSelection = [];
      _httpParams.SHARE_LEVEL = null;
      _httpParams.limit = 10;
      _httpParams.skip = 0;
      getDepartmentShareList(_httpParams);
    }

    // get spatial all
    $scope.getSpatialAll = function() {
      $scope.areaShareSelection = [];
      _httpParams.AREA_DATA_LEVEL = null;
      _httpParams.limit = 10;
      _httpParams.skip = 0;
      getDepartmentShareList(_httpParams);
    }
  }
])

/* HTTP Factory */
DepartmentShare.factory('DepartmentShare.Service.Http', ['$http', 'API',
  function($http, API) {
    var path = API.path;
    function countAll(params) {
      return $http.get(
        path + '/shareInventory/countAll', {params: params}
      )
    };
    function countByShareLevel(params) {
      return $http.get(
        path + '/shareInventory/countByShareLevel', {params: params}
      )
    };
    function countBySpatial(params) {
      return $http.get(
        path + '/shareInventory/countBySpatial', {params: params}
      )
    };
    function inventoryList(params) {
      return $http.get(
        path + '/shareInventory/inventoryList', {params: params}
      )
    };
    return {
      countAll: countAll,
      countByShareLevel: countByShareLevel,
      countBySpatial: countBySpatial,
      inventoryList: inventoryList
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
      });
    }
    Http.getDepartmentList().then(function(result) {
      $scope.deptList = result.data.body;
    });

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
      deleteUser: deleteUser
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

'use strict';
var InventoryDetail = angular.module('InventoryDetail', ['ui.router']);

/** InventoryDetail Controller */
InventoryDetail.controller('InventoryDetail.Controller.Main', ['$rootScope', '$scope', '$stateParams', 'InventoryDetail.Service.Http',
  function($rootScope, $scope, $stateParams, Http) {
    $scope.InventoryDetail = {};
    var httpParams = {ID: $stateParams.inventoryID};
    var _httpParams = {dataId: $stateParams.inventoryID};
    Http.getInventoryDetail(httpParams).then(function(result) {
      if(200 == result.data.head.status){
        $scope.InventoryDetail.detail = result.data.body[0];
      }
    });
    Http.indicatorList(_httpParams).then(function(result) {
      if(200 == result.data.head.status){
        $scope.InventoryDetail.indicators = result.data.body;
      }
    });
    Http.examplesList(_httpParams).then(function(result) {
      if(200 == result.data.head.status){
        $scope.InventoryDetail.examples = result.data.body;
      }
    });
  }
])

/* HTTP Factory */
InventoryDetail.factory('InventoryDetail.Service.Http', ['$http', 'API',
  function($http, API) {
    var path = API.path;
    function getInventoryDetail(params) {
      return $http.get(
        path + '/inventory/getInventoryDetail', {params: params}
      )
    };
    function indicatorList(params) {
      return $http.get(
        path + '/indicator/indicatorList', {params: params}
      )
    };
    function examplesList(params) {
      return $http.get(
        path + '/examples/examplesList', {params: params}
      )
    };
    return {
      getInventoryDetail: getInventoryDetail,
      indicatorList: indicatorList,
      examplesList: examplesList
    }
  }
]);

'use strict';
var Inventory = angular.module('Inventory', ['ui.router']);

/** Main Controller */
Inventory.controller('Inventory.Controller.Main', ['$scope', '$state', 'Inventory.Service.Http',
  function($scope, $state, Http) {
    $scope.Inventory = {};
    // Get department list
    Http.getDepWithInventoryNum().then(function(result) {
      if(200 == result.data.head.status){
        $scope.Inventory.departments = result.data.body;
      }
    });
    // Init another datas
    getAll();
    // Switch current scope
    $scope.Inventory.switcher = function(target){
      var httpParams = {DEP_ID: target}
      getAll(httpParams);
    }

    // Promise all
    function getAll(httpParams){
      Http.getShareDictWithInventoryNum(httpParams).then(function(result) {
        if(200 == result.data.head.status){
          $scope.Inventory.shareDict = result.data.body;
        }
      });
      Http.getAreaDictWithInventoryNum(httpParams).then(function(result) {
        if(200 == result.data.head.status){
          $scope.Inventory.areaDict = result.data.body;
        }
      });
      Http.getShareDictWithInventoryNum(httpParams).then(function(result) {
        if(200 == result.data.head.status){
          $scope.Inventory.shareDict = result.data.body;
        }
      });
      Http.inventoryList(httpParams).then(function(result) {
        if(200 == result.data.head.status){
          $scope.Inventory.inventoryList = result.data.body;
        }
      });
    };

  }
])

/* HTTP Factory */
Inventory.factory('Inventory.Service.Http', ['$http', 'API',
  function($http, API) {
    var path = API.path;
    function getDepWithInventoryNum(params) {
      return $http.get(
        path + '/inventory/getDepWithInventoryNum'
      )
    };
    function getShareDictWithInventoryNum(params) {
      return $http.get(
        path + '/inventory/getShareDictWithInventoryNum', {params: params}
      )
    };
    function getAreaDictWithInventoryNum(params) {
      return $http.get(
        path + '/inventory/getAreaDictWithInventoryNum', {params: params}
      )
    };
    function inventoryList(params) {
      return $http.get(
        path + '/inventory/inventoryList', {params: params}
      )
    };
    function updateVisitCount(params) {
      return $http.put(
        path + '/inventory/updateVisitCount', {data: data}
      )
    };
    return {
      getDepWithInventoryNum: getDepWithInventoryNum,
      getShareDictWithInventoryNum: getShareDictWithInventoryNum,
      getAreaDictWithInventoryNum: getAreaDictWithInventoryNum,
      inventoryList: inventoryList,
      updateVisitCount: updateVisitCount
    }
  }
]);

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

    $scope.RequirementDetail.pushResponse = function(){
      if($scope.RequirementDetail.response){
        var postParams = {REQUIREMENT_ID: $stateParams.requirementID, RESPONSE_CONTENT: $scope.RequirementDetail.response};
        Http.addRequireResponse(postParams).then(function(result) {
          if(200 == result.data.head.status){
            Http.requireResponseList({REQUIREMENT_ID: $stateParams.requirementID}).then(function(result) {
              if(200 == result.data.head.status){
                $scope.RequirementDetail.list = result.data.body;
              }
            });
          }
        });
      }
      else{
        alert('请输入回复内容！');
      }
    }
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
]);

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
