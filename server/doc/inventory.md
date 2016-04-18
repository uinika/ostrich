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

## /inventory/getShareDictWithInventoryNum

### Type: GET

#### Parameter:
* DEP_ID  部门ID

#### Result:
* SYS_DICT_ID      属性的ID值
* DICT_NAME        属性的名称
* INVENTORY_NUM    属性包含的清单数量

-------------

-------------

## /inventory/getAreaDictWithInventoryNum

### Type: GET

#### Parameter:
* DEP_ID  部门ID

#### Result:
* SYS_DICT_ID      属性的ID值
* DICT_NAME        属性的名称
* INVENTORY_NUM    属性包含的清单数量

-------------

## /inventory/inventoryList

### Type: GET

#### Parameter:
* skip & limit
* DEP_ID            部门的ID值
* SHARE_LEVEL       共享级别的ID
* AREA_DATA_LEVEL   地区数据级别的ID

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

## /inventory/updateVisitCount

### Type: PUT

#### Parameter:
* ID            清单的ID值

#### Result:

-------------

## /inventory/getDataOtherInfo

### Type: GET

#### Parameter:
* DATA_ID			清单ID

#### Result:
* ID                   varchar(36) not null comment 'ID',
* DATA_ID              varchar(36) comment '数据清单ID',
* ACCESS_TYPE          varchar(4) comment '数据接入方式',
* TECH_SUPPORT         varchar(1000) comment '技术支持',
* LINKMAN              varchar(64) comment '联系人',
* CONTACT_PHONE        varchar(64) comment '联系电话',
* EMAIL                varchar(64) comment '联系邮箱',

-------------

## /indicator/indicatorList

### Type: GET

#### Parameter:
* dataId		数据清单ID

#### Result:
* ID                   varchar(36) not null comment 'ID',
* DATA_ID              varchar(36) comment '数据清单ID',
* QUOTA_NAME           varchar(64) comment '指标名称',
* ALIAS                varchar(64) comment '别名',
* QUOTA_TYPE           varchar(36) comment '指标类型',
* QUOTA_TYPE_ADD       varchar(256) comment '指标类型补充说明',
* METER_UNIT           varchar(36) comment '计量单位',
* QUOTA_DETAIL         varchar(1000) comment '指标详细解释',
* CALCULATE_METHOD     varchar(36) comment '计算方法',
* DEP_ID               varchar(36) comment '来源部门',
* DATA_PRECISION       varchar(36) comment '数据精度',
* DATA_LENGTH          varchar(36) comment '数据长度',
* DATA_SHOW_FORMAT     varchar(36) comment '数据表示格式',
* DATA_SHOW_FORMAT_ADD varchar(256) comment '数据表示格式补充说明',
* SECRET_FLAG          varchar(36) comment '是否涉密',
* CREATE_TIME          datetime comment '创建时间',
* LINKMAN              varchar(36) comment '联系人',
* CONTACT_PHONE        varchar(36) comment '联系电话',
* SHOW_ORDER           numeric(4) comment '显示顺序',
* AREA_DATA_LEVEL      varchar(36) comment '分地区数据级别',
* SHARE_LEVEL          varchar(36) comment '共享级别',
* SHARE_DEPS           varchar(256) comment '共享指定部门'

-------------

## /examples/examplesList

### Type: GET

#### Parameter:
* dataId		数据清单ID

#### Result:
* ID                   varchar(36) not null comment 'ID',
* DATA_QUOTA_ID        varchar(36) comment '数据指标表ID',
* ROW_KEY              varchar(36) comment '同行标识',
* DATA_QUOTA_VALUE     varchar(256) comment '数据指标值',
* QUOTA_NAME           varchar(64) comment '指标名称'
