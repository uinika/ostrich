# #/main/dashboard

-------------

## /inventory

### Type: GET

#### Parameter:
* skip & limit

#### Result:
* ID                   varchar(36) not null comment 'ID',
* DATA_NAME            varchar(256) comment '数据名称',
* DATA_SUMMARY         varchar(1000) comment '数据摘要',
* DEP_ID               varchar(36) comment '所属部门',
* LINKMAN              varchar(64) comment '联系人',
* CONTACT_PHONE        varchar(64) comment '联系电话',
* CREATE_USER          varchar(36) comment '发布人',
* CREATE_TIME          datetime comment '发布时间',
* UPDATE_USER          varchar(36) comment '更新人',
* UPDATE_TIME          datetime comment '更新时间',
* DEP_Name               varchar(36) comment '所属部门',

-------------

## /inventory/overview

### Type: GET

#### Parameter:
* startTime
* endTime
>（2016-04-01 00:00:00）

#### Result:
* allDataNum清单总数
* allDepNum清单部门总数
* thisMonthDataNum本月新增清单数量
* thisMonthDepNum本月新增清单部门数量

-------------

## /requirement
### Type: GET
#### Parameter:
skip & limit
#### Result:
* ID                   varchar(36) not null comment 'ID',
* REQUIEMENT_NAME      varchar(63) comment '需求名称',
* REQUIEMENT_DESC      varchar(1000) comment '需求简介',
* LINKMAN              varchar(64) comment '联系人',
* EMAIL                varchar(64) comment '邮箱',
* CREATE_USER          varchar(36) comment '创建人',
* CREATE_TIME          datetime comment '创建时间',
* UPDATE_USER          varchar(36) comment '更新人',
* UPDATE_TIME          datetime comment '更新时间',
* DEP_Name             varchar(36) comment '所属部门'

-------------

## /requirement/overview

### Type: GET

#### Parameter:
* startTime
* endTime
> (2016-04-01 00:00:00)

#### Result:
* allDataNum需求总数
* allDepNum需求部门总数
* thisMonthDataNum本月新增需求数量
* thisMonthDepNum本月新增需求部门数量

-------------

## /inventory/statistic

### Type: GET

#### Parameter: skip(0) & limit(10)

#### Result:
    {
      departmen: [],
      inventory: [],
      requirement: []
    }
