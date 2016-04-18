# #/main/department

--------------------------------------------------------------------------------

## /inventory
### Type: GET
#### Parameter:
#### Result:

--------------------------------------------------------------------------------

## /inventoryTotal/department
### Type: GET
#### Parameter:
- startTime
- endTime
  > （2016-04-01 00:00:00）

#### Result:
- total 清单总数

--------------------------------------------------------------------------------

## /inventory/department
### Type: GET
#### Parameter:
skip & limit & status:0

#### Result:
- ID             varchar(36) not null comment 'ID',
- APPLY_TIME     varchar(63) comment '申请日期',
- DATA_NAME      varchar(1000) comment '指标名称',
- DEP_NAME       varchar(64) comment '申请部门',

--------------------------------------------------------------------------------

## /response/department
### Type: GET
#### Parameter:
skip & limit

#### Result:
- ID                ID
- RESPONSE_TIME     响应日期
- CREATE_TIME       需求发布日期
- REQUIEMENT_NAME   需求名称
- DEP_NAME          响应单位

--------------------------------------------------------------------------------
## /dict
### Type: GET
#### Parameter:
DICT_CATEGORY : 字典分类ID

#### Result:
   ID                   varchar(36) not null comment 'ID',
   DICT_CATEGORY        varchar(36) comment '字典类别',
   DICT_CODE            varchar(36) comment '字典编码',
   DICT_NAME            varchar(36) comment '字典名称',
   PARENT_CODE          varchar(36) comment '字典上级编码',
   DICT_DESC            varchar(256) comment '字典描述',
   DICT_ORD             numeric(4) comment '显示顺序',
   ACTIVE_FLAG          varchar(4) default '1' comment '启用标志',

--------------------------------------------------------------------------------
## /dep
### Type: GET
#### Parameter:

#### Result:
"DEP_NAME":   部门名称,
"ID":         ID
--------------------------------------------------------------------------------
## /user
### Type: GET
#### Parameter:

#### Result:
"USERNAME": "Henry",
"DEP_NAME": "城管局",
"PERSON_NAME":"张2",
"PHONE":"13894049848",
"EMAIL":"sdfhisdfi@dd.com"

--------------------------------------------------------------------------------
## /user
### Type: POST
#### Parameter:
"USERNAME": "Henry",
"DEP_ID": 15,
"PERSON_NAME":"张2",
"PASSWORD": "sfsdfs"
"PHONE":"13894049848",
"EMAIL":"sdfhisdfi@dd.com"
#### Result:
--------------------------------------------------------------------------------


## /saveInventory
### Type: POST
#### Parameter:
{ "dataInfo":
      {"dataName":"数据一","dataSummary":"数据","depId":"3","linkman":"大大", "contactPhone":"","createUser":"shengjingxinwei","createTime":"2016-04-11 10:12:16", "shareLevel":"","shareDeps":"","areaPeriod":"" },

  "dataInfoAddConfigs":
    [     
      {"dataInfoId":"数据一","sysDictId":"24f8deaf-02f0-11e6-a52a-5cf9dd40ad7e"} ,      {"dataInfoId":"数据一","sysDictId":"24faa6ce-02f0-11e6-a52a-5cf9dd40ad7e"},     {"dataInfoId":"数据一","sysDictId":"24fd700d-02f0-11e6-a52a-5cf9dd40ad7e"},     {"dataInfoId":"数据一","sysDictId":"24fee32b-02f0-11e6-a52a-5cf9dd40ad7e"} ],

"dataQuota":
  [      
    {"dataInfoId":"数据一","quotaName":"一号","alias":"","quotaType":"1","quotaTypeAdd":"文本","meterUnit":"","quotaDetail":"","calculateMethod":"","depId":"3","dataPrecision":"","dataLength":"","dataShowFormat":"","dataShowFormatAdd":"","secretFlag":"","createTime":"2016-04-11 10:13:16","linkman":"","contactPhone":"","showOrder":"1"},     {"dataInfoId":"数据一","quotaName":"二号","alias":"","quotaType":"1","quotaTypeAdd":"文本","meterUnit":"","quotaDetail":"","calculateMethod":"","depId":"3","dataPrecision":"","dataLength":"","dataShowFormat":"","dataShowFormatAdd":"","secretFlag":"","createTime":"2016-04-11 10:13:16","linkman":"","contactPhone":"","showOrder":"2"},     {"dataInfoId":"数据一","quotaName":"三号","alias":"","quotaType":"1","quotaTypeAdd":"文本","meterUnit":"","quotaDetail":"","calculateMethod":"","depId":"3","dataPrecision":"","dataLength":"","dataShowFormat":"","dataShowFormatAdd":"","secretFlag":"","createTime":"2016-04-11 10:13:16","linkman":"","contactPhone":"","showOrder":"3"} ],

"dataExamples":[    
    {dataQuotaId":"一号","dataQuotaValue":"一1","rowKey":"1"},{"dataQuotaId":"二号","dataQuotaValue":"二1","rowKey":"1"},{"dataQuotaId":"三号","dataQuotaValue":"三1","rowKey":"1"},     {"dataQuotaId":"一号","dataQuotaValue":"xxx","rowKey":"2"},{"dataQuotaId":"二号","dataQuotaValue":"yyy","rowKey":"2"},{"dataQuotaId":"三号","dataQuotaValue":"zzz","rowKey":"2"},     {"dataQuotaId":"一号","dataQuotaValue":"aaa","rowKey":"3"},{"dataQuotaId":"二号","dataQuotaValue":"bbb","rowKey":"3"},{"dataQuotaId":"三号","dataQuotaValue":"ccc","rowKey":"3"} ],

"dataOtherInfo":
  {"dataInfoId":"数据一" ,"accessType":"10","techSupport":"本部","linkman":"渣画","contactPhone":"1234566","email":"faasda"} }

#### Result:
