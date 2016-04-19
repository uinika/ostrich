## /requirement/requirementList

### Type: GET

#### Parameter:
* skip & limit

#### Result:
* ID                   varchar(36) not null comment 'ID',
* REQUIREMENT_NAME      varchar(63) comment '需求名称',
* REQUIREMENT_DESC      varchar(1000) comment '需求简介',
* LINKMAN              varchar(64) comment '联系人',
* EMAIL                varchar(64) comment '邮箱',
* DEP_ID               varchar(36) comment '所属部门',
* CREATE_USER          varchar(36) comment '创建人',
* CREATE_TIME          datetime comment '创建时间',
* UPDATE_USER          varchar(36) comment '更新人',
* UPDATE_TIME          datetime comment '更新时间',
* VISIT_COUNT          decimal default 0 comment '浏览次数',
* SHOW_BUTTON          是否显示“需求响应”图片(true:显示、false:不显示)
* DEP_NAME             部门名称

-------------

## /requirement/statistic

### Type: GET

#### Parameter:

#### Result:
* REQUIREMENT_NUM       需求清单总计
* DEP_NUM      			需求部门
* RESPONSE_NUM			需求已响应

-------------

## /requirement/requireDetail

### Type: GET

#### Parameter:
* ID		需求ID

#### Result:
* ID                   varchar(36) not null comment 'ID',
* REQUIREMENT_NAME      varchar(63) comment '需求名称',
* REQUIREMENT_DESC      varchar(1000) comment '需求简介',
* LINKMAN              varchar(64) comment '联系人',
* EMAIL                varchar(64) comment '邮箱',
* DEP_ID               varchar(36) comment '所属部门',
* CREATE_USER          varchar(36) comment '创建人',
* CREATE_TIME          datetime comment '创建时间',
* UPDATE_USER          varchar(36) comment '更新人',
* UPDATE_TIME          datetime comment '更新时间',
* VISIT_COUNT          decimal default 0 comment '浏览次数',
* DEP_NAME             部门名称

-------------

## /requirement/requireResponseList

### Type: GET

#### Parameter:
* REQUIREMENT_ID		需求ID

#### Result:
* ID					varchar(36) not null comment 'ID',
* REQUIREMENT_ID		varchar(36) comment '数据需求清单ID',
* RESPONSER				varchar(36) comment '响应人',
* RESPONSE_TIME			datetime comment '响应时间',
* RESPONSE_CONTENT		varchar(1000) comment '响应内容',
* PERSON_NAME			联系人名称
* PHONE					联系电话
* EMAIL					邮箱
* DEP_NAME				部门名称

-------------

## /requirement/addRequireResponse

### Type: POST

#### Parameter:
* REQUIREMENT_ID		需求ID
* RESPONSE_CONTENT		需求响应内容

#### Result:


-------------
