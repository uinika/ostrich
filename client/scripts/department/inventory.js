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
    $scope.Paging.currentPage = 1;
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
        $scope.resourceCount = result.data.body[0].count[0].resource_count;
        $scope.Paging.totalItems = result.data.body[0].count[0].item_count;
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
        $scope.shareFreqSelection.splice(idx, 1);
      } else {
        $scope.shareFreqSelection.push(item.id);
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
    $scope.InfoItemShow = false;
    Http.getDepartInfoResList({
      resource_id: $stateParams.item
    }).then(function(ResourceRes) {
      $scope.InfoResourceDetail = ResourceRes.data.body[0].results[0];
      Http.getInfoItemList({
        resource_id: $scope.InfoResourceDetail.id
      }).then(function(result) {
        if (result.data.body.length == 0) {
          $scope.InfoItemShow = false;
        } else {
          $scope.InfoItemShow = true;
          $scope.InfoItems = result.data.body;

          _($scope.InfoItems).forEach(function(item) {
            var shareFreqDictName = [];
            _(item.config).forEach(function(config) {
              shareFreqDictName.push(config.dict_name);
            })
            item.update_period_name = shareFreqDictName.toString();
          })
        }


      })
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
      if ($scope.InfoResource.resource_name && $scope.InfoResource.resource_name != '') {
        Http.checkResName({
          resource_name: $scope.InfoResource.resource_name
        }).then(function(res) {
          if (res.data.body[0].isexists == 'true') {
            $scope.resNameExist = true;
          } else {
            $scope.resNameExist = false;
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
      $scope.resourceCategoryRelList = result.data.body;
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
      if ($scope.resNameExist) {
        isValid = false;
      }
      if ($scope.shareFreqSelection.length == 0 && !$scope.resItemAddBtn) { // 未选择更新周期
        isValid = false;
      }
      if ($scope.resItemAddBtn && ($scope.ResourceItemList.length == 0)) { // 未添加信息项
        isValid = false;
      }
      if ($scope.InfoResource.category == $scope.InfoResource.rel_category) { // 信息资源分类和关联及类目名称相同
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
        $scope.savePromise = Http.saveInfoResource(InfoResourceAddObj).then(function(result) {
          console.log(result.data);
          if (200 == result.data.head.status) {
            alert('保存成功！');
            $scope.Modal = {};
            $state.go("main.department.inventory", {}, {
              reload: true
            });

          } else {
            alert('保存失败！');
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
      // 根据id查询信息资源详情
      Http.getDepartInfoResList({
        resource_id: $stateParams.item
      }).then(function(ResourceRes) {
        $scope.InfoResource = ResourceRes.data.body[0].results[0];

        if (RESOURCE_FORMAT_DATA == $scope.InfoResource.resource_format) {
          $scope.resItemUpdateBtn = true;
        }

        $scope.ResourceItemConfigList = [];
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


        // 获取所有信息项
        Http.getInfoItemList({
          resource_id: $scope.InfoResource.id
        }).then(function(result) {
          $scope.ResourceItemList = result.data.body;
          // 拼接信息资源所有信息项的多选项
          _($scope.ResourceItemList).forEach(function(item) {
            var shareFreqDictName = [];
            _(item.config).forEach(function(config) {
              var itemConfig = {};
              itemConfig.InfoItemId = item.item_name;
              itemConfig.sys_dict_id = config.id;
              shareFreqDictName.push(config.dict_name);
              $scope.ResourceItemConfigList.push(itemConfig);
            })
            item.update_period_name = shareFreqDictName.toString();
          })
          console.log($scope.ResourceItemConfigList);
        })
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


      if ($scope.resNameExist) {
        isValid = false;
      }
      if ($scope.shareFreqSelection.length == 0 && !$scope.resItemUpdateBtn) { // 未选择更新周期
        isValid = false;
      }
      if ($scope.resItemAddBtn && ($scope.ResourceItemList.length == 0) || $scope.resItemUpdateBtn && ($scope.ResourceItemList.length == 0)) { // 未添加信息项
        isValid = false;
      }
      if ($scope.InfoResource.category == $scope.InfoResource.rel_category) { // 信息资源分类和关联及类目名称相同
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
        $scope.updatePromise = Http.updateInfoResource(InfoResourceAddObj).then(function(result) {
          console.log(result.data);
          if (200 == result.data.head.status) {
            alert('保存成功！');
            $scope.Modal = {};
            // 清空多选项
            $scope.dataLevelSelection = [];
            $scope.shareFreqSelection = [];
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

    $scope.editItems = function(id) {
      $scope.ResourceItemConfigList = [];
      Http.getInfoItemList({
        resource_id: id
      }).then(function(result) {
        $scope.ResourceItemList = result.data.body;
        // 拼接信息资源所有信息项的多选项
        _($scope.ResourceItemList).forEach(function(item) {
          var shareFreqDictName = [];
          _(item.config).forEach(function(config) {
            var itemConfig = {};
            itemConfig.InfoItemId = item.item_name;
            itemConfig.sys_dict_id = config.id;
            shareFreqDictName.push(config.dict_name);
            $scope.ResourceItemConfigList.push(itemConfig);
          })
          item.update_period_name = shareFreqDictName.toString();
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
      $scope.parent = {};
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

      $scope.checkItemName = function() {
        if ($scope.ResourceItem.item_name && $scope.ResourceItem.item_name != '') {
          console.log($scope.ResourceItem);
          console.log($scope.ResourceItemList);
          $scope.parent.itemNameExist = false;
          _($scope.ResourceItemList).forEach(function(item) {
            if (($scope.ResourceItem.item_name == item.item_name) && $scope.ResourceItem !== item) {
              $scope.parent.itemNameExist = true;
            }
          })
          if (!$scope.parent.itemNameExist) {
            Http.checkItemName({
              item_name: $scope.ResourceItem.item_name
            }).then(function(res) {
              if (res.data.body[0].isexists == 'true') {
                $scope.parent.itemNameExist = true;
              } else {
                $scope.parent.itemNameExist = false;
              }
            })
          }

        }

      }

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
        $scope.ResourceItem.update_period_name = shareFreqDictName.toString();
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
      $scope.ResourceItem.shareFreqItemSelection = _.map(InfoItem.config, 'id');
      $scope.ResourceItem.shareFreqItemObjSelection = InfoItem.config;
      $scope.shareFreqEmpty = false;
      $scope.parent = {};
      $scope.parent.itemNameExist = false;

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

      $scope.checkItemName = function() {
        if ($scope.ResourceItem.item_name && $scope.ResourceItem.item_name != '') {
          console.log($scope.ResourceItem);
          console.log($scope.ResourceItemList);
          $scope.parent.itemNameExist = false;
          _($scope.ResourceItemList).forEach(function(item) {
            if (($scope.ResourceItem.item_name == item.item_name) && $scope.ResourceItem !== item) {
              $scope.parent.itemNameExist = true;
            }
          })
          if (!$scope.parent.itemNameExist) {
            Http.checkItemName({
              item_name: $scope.ResourceItem.item_name
            }).then(function(res) {
              if (res.data.body[0].isexists == 'true') {
                $scope.parent.itemNameExist = true;
              } else {
                $scope.parent.itemNameExist = false;
              }
            })
          }

        }

      }

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
        $scope.ResourceItem.config = $scope.ResourceItem.shareFreqItemObjSelection;
        $scope.ResourceItem.update_period_name = shareFreqDictName.toString();
        console.log($scope.ResourceItemList);
      })
    }

    // delete info item
    $scope.deleteItem = function(index) {
      var deleteFlag = confirm('确定删除本条信息项？');
      console.log(index);
      if (deleteFlag && index > -1) {
        $scope.ResourceItemList.splice(index, 1);
      }
    }



    // show or hide department
    $scope.depShow = false;
    $scope.showHideDeps = function(ev) {
      if (LEVEL_ALL_OPEN != $scope.InfoResource.share_level) { // 不为全开放
        if (LEVEL_AUTH == $scope.InfoResource.share_level) { // 授权开放
          $scope.depShow = true;
          $scope.socialOpenFlag = false;
        } else {
          $scope.depShow = false;
          $scope.socialOpenFlag = true;
          $scope.outputDeptList = [];
        }
        $scope.InfoResource.social_open_flag = 0;
      } else {
        $scope.InfoResource.social_open_flag = 1;
        $scope.outputDeptList = [];
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

// upload file
DInventory.controller('Department.Inventory.Controller.upload', ['$scope', '$q', 'Department.Inventory.Service.Http', '$stateParams', '$state', '$sce', 'API',
  function($scope, $q, Http, $stateParams, $state, $sce, API) {
    $scope.uploadPromise = null;

    $scope.htmlPopover = $sce.trustAsHtml("<table class='table table-hover table-striped '>" +
      "<thead><tr><th>序号</th><th>城市</th><th>GDP(亿元)</th><th>增长</th>" +
      "<th>地方公共财政收入(亿元)</th><th>增长</th><th>城镇登记失业率</th>" +
      "<th>农村居民人均纯收入(元)</th><th>增长</th></tr></thead>" +
      "<tbody><tr><td>1</td><td>成都</td><td>9000</td><td>8.54%</td><td>8000</td><td>7.51%</td>" +
      "<td>1.39</td><td>5678</td><td>3.40%</td></tr>" +
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

    $scope.downloadUrl = API.path + '/download';

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
      checkItemName: checkItemName,
      uploadFile: uploadFile
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
        if (scope.ResourceItem.shareFreqItemSelection.length == 0) {
          scope.shareFreqEmpty = true;
          return;
        }
        if (scope.parent.itemNameExist) {
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
        scope.parentIvntObj.fileName = fileSuffix;
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
