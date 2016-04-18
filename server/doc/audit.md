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
SL :ID
AP : [ID,ID]

#### Result:



-------------
