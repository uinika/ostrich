# Common Interface

-----

## 数据指标

### /api/data_quota
> Type: POST, GET, PUT, DELETE

### /api/data_quota/count
> Type: GET

### /api/data_quota/data_quota_examples
> Type: GET

### /api/data_quota/sys_dep/sys_dict
> Type: GET

#### Parameter:
- id                   varchar(36)  '指标id',
- quota_sn             varchar(64)  '指标编号',
- quota_name           varchar(64)  '指标名称',
- alias                varchar(64)  '指标别名',
- meter_unit           varchar(36)  '计量单位',
- area_range           varchar(36)  '空间范围',
- data_length          varchar(36)  '数据长度',
- quota_detail         varchar(1000)  '指标详细解释',
- calculate_method     varchar(36)  '计算方法',
- data_store_type      varchar(36)  '数据存储类型',
- dep_id               varchar(36)  '来源部门',
- share_deps           varchar(1000)  '共享指定部门',
- data_store_type_add  varchar(256)  '数据存储类型备注',
- data_precision       varchar(36)  '数据精度',
- data_show_format     varchar(36)  '数据表示格式',
- data_show_format_add varchar(256)  '数据表示格式补充说明',
- secret_flag          varchar(36)  '是否涉密',
- create_time          datetime  '创建时间',
- linkman              varchar(36)  '联系人',
- contact_phone        varchar(36)  '联系电话',
- show_order           numeric(4)  '显示顺序',
- file_name            varchar(36)  '文件标识',
- delete_flag          varchar(4)  '删除标志'

#### Result:
- Protocol

-----

## 数据指标申请审核

### /api/data_quota_apply_info
> Type: POST, GET, PUT, DELETE

### /api/data_quota_apply_info/count
> Type: GET

### /api/data_quota_apply_info/data_quota/sys_dep
> Type: GET

### /api/data_quota_apply_info/data_quota/sys_dep/sys_dict
> Type: GET

### /api/data_quota_apply_info/data_quota/data_quota_examples/sys_dep/sys_dict
> Type: GET

### /api/data_quota_apply_info/data_quota/sys_dep/count
> Type: GET

#### Parameter:
- data_quota_id        varchar(36) '数据指标表id',
- id                   varchar(36) 'id',
- applicant            varchar(36) '申请人',
- apply_dep            varchar(36) '申请部门',
- apply_time           datetime '申请时间',
- audit_opinion        varchar(1000) '审核意见',
- auditor              varchar(36) '审核人',
- audit_status         varchar(4) '审核状态',
- audite_time          datetime '审核时间',

#### Result:
- Protocol

-----

## 数据清单示例

### /api/data_quota_examples
> Type: POST , GET , PUT , DELETE

### /api/data_quota_examples/count
> Type: GET

#### Parameter:
- id                   varchar(36) 'id',
- data_quota_id        varchar(36) '数据指标表id',
- file_name            varchar(64) '文件名',
- file_path            varchar(256) '文件路径',
- file_content         text '文件内容',

#### Result:
- Protocol

-----

## 数据关联设置

### /api/data_relation_config
> Type: POST , GET , PUT , DELETE

### /api/data_relation_config/count
> Type: GET

#### Parameter:
- id                   varchar(36) 'id',
- obj_type             varchar(36) '设置对象类型',
- obj_id               varchar(36) '设置对象id',
- sys_dict_id          varchar(36) '数据字典id',

#### Result:
- Protocol

-----

## 数据需求

### /api/data_requiement
> Type: POST , PUT

### /api/data_requiement/sys_dict/sys_dep
> Type: GET

### /api/data_requiement/count
> Type: GET

#### Parameter:
- id                   varchar(36) 'id',
- dep_id               varchar(36) '创建部门',
- requiement_name      varchar(64) '需求名称',
- requiement_desc      varchar(1000) '需求说明',
- area_range           varchar(1000) '空间范围',
- linkman              varchar(64) '联系人',
- phone                varchar(64) '联系人电话',
- email                varchar(64) '联系人邮箱',
- create_user          varchar(36) '创建人',
- create_time          datetime '创建时间',
- response_dep_id      varchar(36) '需求响应部门',
- responser            varchar(36) '响应人',
- status               varchar(36) '响应状态',
- response_time        datetime '响应时间',
- response_content     varchar(1000) '响应内容',

#### Result:
- Protocol

-----

## 数据需求响应

### /api/data_requiement_response
> Type: POST , GET , PUT , DELETE

### /api/data_requiement_response/count
> Type: GET

#### Parameter:
- id                   varchar(36) 'id',
- requiement_id        varchar(36) '数据需求清单id',
- data_quota_id        varchar(36) '关联指标id',

#### Result:
- Protocol

-----

## 部门

### /api/sys_dep
> Type: POST , GET , PUT , DELETE

### /api/sys_dep/count
> Type: GET

#### Parameter:
- id                   varchar(36) 'id',
- dep_sn               varchar(36) '部门编号',
- parent_id            varchar(36) '上级部门',
- dep_short_name       varchar(36) '部门短名称',
- order_by             varchar(36) '排序号',
- dep_name             varchar(256) '部门名称',
- dep_type             varchar(36) '机构类型',
- role_type            varchar(36) '职能类型',
- area_code            varchar(36) '区域名称编号',
- dep_en_name          varchar(256) '部门英文名称',
- icon_path            varchar(256) '部门图标路径',
- contacts             varchar(64) '部门联系人',
- contact_phone        varchar(64) '部门联系人电话',
- address              varchar(256) '部门联系地址',
- dep_desc             varchar(1000) '部门描述',
- dep_chars            varchar(36) '部门首字母简拼',

#### Result:
- Protocol

-----

## 系统字典

### /api/sys_dict
> Type: POST , GET , PUT , DELETE

### /api/sys_dict/count
> Type: GET

#### Parameter:
- id                   varchar(36) 'id',
- dict_category        varchar(36) '字典类别',
- dict_code            varchar(36) '字典编码',
- dict_name            varchar(36) '字典名称',
- parent_code          varchar(36) '字典上级编码',
- dict_desc            varchar(256) '字典描述',
- dict_ord             numeric(4) '显示顺序',
- active_flag          varchar(4) default '1' '启用标志',

#### Result:
- Protocol

-----

## 系统配置

### /api/sys_setting
> Type: POST , GET , PUT , DELETE

### /api/sys_setting/count
> Type: GET

#### Parameter:
- id                   varchar(36) 'id',
- setting_category     varchar(36) '配置类型',
- setting_name         varchar(36) '配置名称',
- setting_code         varchar(36) '配置编码',
- setting_value        varchar(256) '配置值',
- setting_desc         varchar(256) '配置描述',
- setting_ord          numeric(4) '配置顺序',

#### Result:
- Protocol

-----

## 系统用户

### /api/sys_user
> Type: POST , GET , PUT , DELETE

### /api/sys_user/count
> Type: GET

#### Parameter:
- id                   varchar(36) 'id',
- username             varchar(64) '用户名',
- password             varchar(64) '密码',
- dep_id               varchar(36) '所属部门',
- person_name          varchar(64) '姓名',
- phone                varchar(36) '联系电话',
- email                varchar(128) '邮箱',

#### Result:
- Protocol

-----

## 用户关注部门

### /api/user_dep
> Type: POST , GET , PUT , DELETE

### /api/user_dep/count
> Type: GET

### /api/user_dep/sys_dep
> Type: GET

#### Parameter:
- id                   varchar(36) 'id',
- dep_id               varchar(36) '原部门id',
- follow_dep_id        varchar(36) '关注部门id',

#### Result:
- Protocol

-----
