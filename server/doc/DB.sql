/*==============================================================*/
/* dbms name:      mysql 5.0                                    */
/* created on:     2016/4/26 20:45:02                           */
/*==============================================================*/


drop table if exists data_quota;

drop table if exists data_quota_apply_info;

drop table if exists data_quota_examples;

drop table if exists data_relation_config;

drop table if exists data_requiement;

drop table if exists data_requiement_response;

drop table if exists sys_dep;

drop table if exists sys_dict;

drop table if exists sys_setting;

drop table if exists sys_user;

drop table if exists user_dep;

/*==============================================================*/
/* table: data_quota                                            */
/*==============================================================*/
create table data_quota
(
   id                   varchar(36) not null comment 'id',
   quota_sn             varchar(64) comment '指标编号',
   quota_name           varchar(64) comment '指标名称',
   alias                varchar(64) comment '指标别名',
   meter_unit           varchar(36) comment '计量单位',
   area_range           varchar(36) comment '空间范围',
   data_length          varchar(36) comment '数据长度',
   quota_detail         varchar(1000) comment '指标详细解释',
   calculate_method     varchar(36) comment '计算方法',
   data_store_type      varchar(36) comment '数据存储类型',
   dep_name             varchar(36) comment '来源部门',
   share_frequency      varchar(36) comment '共享频率',
   share_level          varchar(36) comment '共享级别',
   data_store_type_add  varchar(256) comment '数据存储类型备注',
   data_precision       varchar(36) comment '数据精度',
   data_show_format     varchar(36) comment '数据表示格式',
   data_show_format_add varchar(256) comment '数据表示格式补充说明',
   secret_flag          varchar(36) comment '是否涉密',
   create_time          datetime comment '创建时间',
   linkman              varchar(36) comment '联系人',
   contact_phone        varchar(36) comment '联系电话',
   show_order           numeric(4) comment '显示顺序',
   file_name            varchar(36) comment '文件标识',
   delete_flag          varchar(4) comment '删除标志',
   primary key (id)
);

alter table data_quota comment '数据指标表';

/*==============================================================*/
/* table: data_quota_apply_info                                 */
/*==============================================================*/
create table data_quota_share_dep
(
   id                   varchar(36) not null comment 'id',
   data_quota_id        varchar(36) comment '数据指标表id',
   dep_id               varchar(36) comment '共享部门的id',
   primary key (id)
);

alter table data_quota_share_dep comment '数据指标共享部门表';

/*==============================================================*/
/* table: data_quota_apply_info                                 */
/*==============================================================*/
create table data_quota_apply_info
(
   data_quota_id        varchar(36) comment '数据指标表id',
   id                   varchar(36) not null comment 'id',
   applicant            varchar(36) comment '申请人',
   apply_dep            varchar(36) comment '申请部门',
   apply_time           datetime comment '申请时间',
   audit_opinion        varchar(1000) comment '审核意见',
   auditor              varchar(36) comment '审核人',
   audit_status         varchar(4) comment '审核状态',
   audite_time          datetime comment '审核时间',
   primary key (id)
);

alter table data_quota_apply_info comment '数据指标申请审核表';

/*==============================================================*/
/* table: data_quota_examples                                   */
/*==============================================================*/
create table data_quota_examples
(
   id                   varchar(36) not null comment 'id',
   data_quota_id        varchar(36) comment '数据指标表id',
   file_name            varchar(64) comment '文件名',
   file_path            varchar(256) comment '文件路径',
   file_content         text comment '文件内容',
   primary key (id)
);

alter table data_quota_examples comment '数据清单示例数据';

/*==============================================================*/
/* table: data_relation_config                                  */
/*==============================================================*/
create table data_relation_config
(
   id                   varchar(36) not null comment 'id',
   obj_type             varchar(36) comment '设置对象类型',
   obj_id               varchar(36) comment '设置对象id',
   sys_dict_id          varchar(36) comment '数据字典id',
   primary key (id)
);

alter table data_relation_config comment '数据关联设置';

/*==============================================================*/
/* table: data_requiement                                       */
/*==============================================================*/
create table data_requiement
(
   id                   varchar(36) not null comment 'id',
   dep_id               varchar(36) comment '创建部门',
   requiement_name      varchar(64) comment '需求名称',
   requiement_desc      varchar(1000) comment '需求说明',
   area_range           varchar(1000) comment '空间范围',
   linkman              varchar(64) comment '联系人',
   phone                varchar(64) comment '联系人电话',
   email                varchar(64) comment '联系人邮箱',
   create_user          varchar(36) comment '创建人',
   create_time          datetime comment '创建时间',
   response_dep_id      varchar(36) comment '需求响应部门',
   responser            varchar(36) comment '响应人',
   status               varchar(36) comment '响应状态',
   response_time        datetime comment '响应时间',
   response_content     varchar(1000) comment '响应内容',
   primary key (id)
);

alter table data_requiement comment '数据需求表';

/*==============================================================*/
/* table: data_requiement_response                              */
/*==============================================================*/
create table data_requiement_response
(
   id                   varchar(36) not null comment 'id',
   requiement_id        varchar(36) comment '数据需求清单id',
   data_quota_id        varchar(36) comment '关联指标id',
   primary key (id)
);

alter table data_requiement_response comment '数据需求响应表';

/*==============================================================*/
/* table: sys_dep                                               */
/*==============================================================*/
create table sys_dep
(
   id                   varchar(36) not null comment 'id',
   dep_sn               varchar(36) not null comment '部门编号',
   parent_id            varchar(36) comment '上级部门',
   dep_short_name       varchar(36) comment '部门短名称',
   order_by             varchar(36) comment '排序号',
   dep_name             varchar(256) comment '部门名称',
   dep_type             varchar(36) comment '机构类型',
   role_type            varchar(36) comment '职能类型',
   area_code            varchar(36) comment '区域名称编号',
   dep_en_name          varchar(256) comment '部门英文名称',
   icon_path            varchar(256) comment '部门图标路径',
   contacts             varchar(64) comment '部门联系人',
   contact_phone        varchar(64) comment '部门联系人电话',
   address              varchar(256) comment '部门联系地址',
   dep_desc             varchar(1000) comment '部门描述',
   dep_chars            varchar(36) comment '部门首字母简拼',
   primary key (id)
);

alter table sys_dep comment '部门表';

/*==============================================================*/
/* table: sys_dict                                              */
/*==============================================================*/
create table sys_dict
(
   id                   varchar(36) not null comment 'id',
   dict_category        varchar(36) comment '字典类别',
   dict_code            varchar(36) comment '字典编码',
   dict_name            varchar(36) comment '字典名称',
   parent_code          varchar(36) comment '字典上级编码',
   dict_desc            varchar(256) comment '字典描述',
   dict_ord             numeric(4) comment '显示顺序',
   active_flag          varchar(4) default '1' comment '启用标志',
   primary key (id)
);

alter table sys_dict comment '系统字典表';

/*==============================================================*/
/* table: sys_setting                                           */
/*==============================================================*/
create table sys_setting
(
   id                   varchar(36) not null comment 'id',
   setting_category     varchar(36) comment '配置类型',
   setting_name         varchar(36) comment '配置名称',
   setting_code         varchar(36) comment '配置编码',
   setting_value        varchar(256) comment '配置值',
   setting_desc         varchar(256) comment '配置描述',
   setting_ord          numeric(4) comment '配置顺序',
   primary key (id)
);

alter table sys_setting comment '系统配置表';

/*==============================================================*/
/* table: sys_user                                              */
/*==============================================================*/
create table sys_user
(
   id                   varchar(36) not null comment 'id',
   username             varchar(64) comment '用户名',
   password             varchar(64) comment '密码',
   dep_id               varchar(36) comment '所属部门',
   person_name          varchar(64) comment '姓名',
   phone                varchar(36) comment '联系电话',
   email                varchar(128) comment '邮箱',
   primary key (id)
);

alter table sys_user comment '系统用户表';

/*==============================================================*/
/* table: user_dep                                              */
/*==============================================================*/
create table user_dep
(
   id                   varchar(36) not null comment 'id',
   dep_id               varchar(36) comment '原部门id',
   follow_dep_id        varchar(36) comment '关注部门id',
   primary key (id)
);

alter table user_dep comment '用户关注部门表';

alter table data_quota_apply_info add constraint fk_reference_4 foreign key (data_quota_id)
      references data_quota (id) on delete restrict on update restrict;

alter table data_quota_examples add constraint fk_reference_3 foreign key (data_quota_id)
      references data_quota (id) on delete restrict on update restrict;

alter table data_requiement_response add constraint fk_reference_6 foreign key (requiement_id)
      references data_requiement (id) on delete restrict on update restrict;
