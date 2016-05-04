# 通用接口

-----

## 一级通用接口
### /api/*
    data_quota 数据指标表
    data_quota_share_dep 数据指标共享部门表
    data_quota_apply_info 数据指标申请审核表
    data_quota_examples 数据清单示例数据
    data_relation_config 数据关联设置
    data_requiement 数据需求表
    data_requiement_response 数据需求响应表
    sys_dep 部门表
    sys_dict 系统字典表
    sys_setting 系统配置表
    sys_user 系统用户表
    user_dep 用户关注部门表


> 关联有其它表ID的字段，请将对应字段的name加入到查询结果。

> 以上共用接口会成为所有URL接口的第1级，即api/1级公用接口。

-----

## 二级通用接口

### /api/data_quota_share_dep-data_quota
#### 根据共享需求部门，列出相应指标，并包含共享需求部门的信息
### /api/data_quota-data_quota_share_dep
#### 根据指标，列出共享需求部门，并包含2张表全部字段

### /api/data_requiement-data_quota
#### 根据数据需求，列出相应指标，并包含需求相关的字段信息
### /api/data_quota-data_requiement
#### 获取指标对应的需求信息，包含2张表全部字段

### /api/data_quota_apply_info-data_quota
#### 根据数据指标申请审核信息，列出相应指标，并包含申请审核的字段信息
### /api/data_quota-data_quota_apply_info
#### 根据指标，获取数据指标申请审核信息，包含2张表全部字段

### /api/data_quota_examples-data_quota
#### 根据数据清单示例数据，列出相应指标，并包含示例数据相关信息
### /api/data_quota-data_quota_examples
#### 根据指标数据，获取指标样例，包含2张表全部字段

### /api/sys_dep-data_quota
#### 根据部门表信息，获取相应指标
### /api/data_quota-sys_dep
#### 根据指标信息，获取部门及对应的指标数据
