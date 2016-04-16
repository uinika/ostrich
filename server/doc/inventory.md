## /inventory/getDepWithInventoryNum

### Type: GET

#### Parameter:

#### Result:
* ID                   VARCHAR(36) NOT NULL COMMENT 'ID',
* PARENT_ID            VARCHAR(36) COMMENT '上级部门ID',
* DEP_NAME             VARCHAR(256) COMMENT '部门名称',
* DEP_SHORT_NAME       VARCHAR(36) COMMENT '部门短名称',
* DEP_EN_NAME          VARCHAR(256) COMMENT '部门英文名称',
* ICON_PATH            VARCHAR(256) COMMENT '部门图标路径',
* CONTACTS             VARCHAR(64) COMMENT '部门联系人',
* CONTACT_PHONE        VARCHAR(64) COMMENT '部门联系人电话',
* ADDRESS              VARCHAR(256) COMMENT '部门联系地址',
* DEP_DESC             VARCHAR(1000) COMMENT '部门描述',
* INVENTORY_NUM        各个部门包含的清单数量

-------------

## /inventory/getDictWithInventoryNum

### Type: GET

#### Parameter:
* DICT_CATEGORY
>3:共享级别
>2：地区数据级别

#### Result:
* SYS_DICT_ID      属性的ID值
* DICT_NAME        属性的名称
* INVENTORY_NUM    属性包含的清单数量

-------------

## /inventory/inventoryList

### Type: GET

#### Parameter:
* skip & limit
* DEP_ID         部门的ID值
* SYS_DICT_ID    属性的ID值

#### Result:
* ID                   VARCHAR(36) NOT NULL COMMENT 'ID',
* PARENT_ID            VARCHAR(36) COMMENT '上级部门ID',
* DEP_NAME             VARCHAR(256) COMMENT '部门名称',
* DEP_SHORT_NAME       VARCHAR(36) COMMENT '部门短名称',
* DEP_EN_NAME          VARCHAR(256) COMMENT '部门英文名称',
* ICON_PATH            VARCHAR(256) COMMENT '部门图标路径',
* CONTACTS             VARCHAR(64) COMMENT '部门联系人',
* CONTACT_PHONE        VARCHAR(64) COMMENT '部门联系人电话',
* ADDRESS              VARCHAR(256) COMMENT '部门联系地址',
* DEP_DESC             VARCHAR(1000) COMMENT '部门描述',
* SHOW_BUTTON          是否显示“申请查看”按钮(true:显示、false:不显示)
* DICT_NAME            共享级别的名称

-------------
