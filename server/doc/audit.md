## /openInventory/countAll

### Type: GET

#### Parameter: DEP_ID(部门ID)


#### Result:
  NUMBER	部门开放清单审核总统计

-------------


## /openInventory/countByShareLevel

### Type: GET

#### Parameter: DEP_ID(部门ID)


#### Result:
   DICTID               属性的ID值
   DICT_NAME			属性的名称
   NUMBER				属性包含的开放清单数量

-------------

## /openInventory/countBySpatial

### Type: GET

#### Parameter: DEP_ID(部门ID)


#### Result:
   DICTID               属性的ID值
   DICT_NAME			属性的名称
   NUMBER				属性包含的开放清单数量

-------------

## openInventory/countByAuditStatus

### Type: GET

#### Parameter: DEP_ID(部门ID)


#### Result:
   AUDIT_STATUS         审核状态值
   AUDIT_NAME			审核状态名称
   NUMBER				审核状态包含的开放清单数量

-------------

## openInventory/inventoryList

### Type: GET

#### Parameter:
skip
limit
DEP_ID			部门的ID值
SHARE_LEVEL		共享级别ID
AREA_DATA_LEVEL : [ID,ID]	分地区级别ID
AUDIT_STATUS:		审核状态

#### Result:
ID    			   	清单ID
DATA_NAME     		数据名称
DATA_SUMMARY     	数据摘要
DEP_ID     			所属部门ID
LINKMAN     		联系人
CONTACT_PHONE     	联系电话
CREATE_USER     	发布人
CREATE_TIME     	发布时间
UPDATE_USER     	更新人
UPDATE_TIME     	更新时间
VISIT_COUNT    		浏览次数
SHARE_LEVEL     	共享级别ID
SHARE_DEPS     		共享指定部门
AREA_PERIOD     	空间范围
DICT_NAME			共享级别
SHOW_BUTTON			是否显示
DEPNAME				所属部门名称
APPLY_DEP			申请部门ID
APPLY_DEPNAME		申请部门名称
AUDITID				审核表ID

-------------
-------------

## /openInventory/openInventoryInfo

### Type: GET

#### Parameter:
AUDITID					审核表ID

#### Result:
DATA_NAME     		数据名称
DATA_SUMMARY     	数据摘要
LINKMAN     		联系人
CONTACT_PHONE     	联系电话
CREATE_TIME     	发布时间
APPLYDEP			申请部门
DEP					所属部门
SHARELAVEL			共享级别
-------------

-------------
## /openInventory/updateAuditStatus

### Type: PUT

#### Parameter:
	ID					审核表ID
	AUDIT_STATUS		审核状态（1：审核通过，2：审核不通过）
	AUDIT_OPINION		审核意见
	AUDITOR				审核人

#### Result:


-------------
