import fetch from './fetch'

/**
 * 登陆
 */
export const login = data => fetch('/Account/Login', data, 'POST');
/**
 * 退出
 */
export const logout = data => fetch('/Account/Logout', data, 'POST');

export const editUserPwd = data => fetch('/Sys_Users/EditPwd_Web_User', data, 'POST');

/**
 * 获取所有一级菜单
 */
export const functionTreeGrid = data => fetch('/Sys_Function/GetList', data, 'POST');
/**
 * 获取所有一级菜单
 */
export const parentFunctionList = data => fetch('/Sys_Function/GetParentFunction', data, 'POST');
/**

 * 添加菜单
 */
export const addFunction = data => fetch('/Sys_Function/Add_Sys_Function', data, 'POST');
/**
 * 修改菜单
 */
export const editFunction = data => fetch('/Sys_Function/Edit_Sys_Function', data, 'POST');
/**
 * 修改菜单
 */
export const delFunction = data => fetch('/Sys_Function/Delete_Sys_Function', data, 'POST');
/**
 * 获取按钮权限list
 */
export const actionList = data => fetch('/Sys_Function/GetRbacAction', data, 'POST');
/**
 * 添加按钮
 */
export const addAction = data => fetch('/Sys_Function/Add_Rbac_Action', data, 'POST');
/**
 * 修改按钮
 */
export const editAction = data => fetch('/Rbac_Function/Update_Rbac_Action', data, 'POST');
/**
 * 获取按钮权限list
 */
export const rolePagedList = data => fetch('/Sys_Role/List_Sys_Role', data, 'POST');
/**
 * 添加角色
 */
export const addRole = data => fetch('/Sys_Role/Add_Sys_Role', data, 'POST');
/**
 * 修改角色
 */
export const editRole = data => fetch('/Sys_Role/Edit_Sys_Role', data, 'POST');
/**
 * 删除角色
 */
export const delRole = data => fetch('/Sys_Role/Delete_Sys_Role', data, 'POST');
/**
 * 获取权限树
 */
export const roleTree = data => fetch('/Sys_Role/RoleTree', data, 'POST');
/**
 * 设置权限树
 */
export const setRoleTree = data => fetch('/Sys_Role/SetRoleTree', data, 'POST');
/**
 * 角色普通下拉框
 */
export const roleComboList = data => fetch('/Sys_Role/GetComboList', data, 'POST');
/**
 * 获取操作日志list
 */
export const operationLogPagedList = data => fetch('/OperationLog/List_OperationLog', data, 'POST');
/**
 * 获取用户list
 */
export const userPagedList = data => fetch('/Sys_Users/List_Sys_Users', data, 'POST');
/**
 * 添加用户
 */
export const addUser = data => fetch('/Sys_Users/Add_Sys_Users', data, 'POST');
/**
 * 修改用户
 */
export const editUser = data => fetch('/Sys_Users/Edit_Sys_Users', data, 'POST');
/**
 * 删除用户
 */
export const delUser = data => fetch('/Sys_Users/Delete_Sys_Users', data, 'POST');
/**
 * 用户密码重置
 */
export const resetUserPwd = data => fetch('/Sys_Users/ResetPwd_Web_User', data, 'POST');

/**
 * 日志
 */
export const logPagedList = data => fetch('/Sys_Log/List_Sys_Logs', data, 'POST');


// region 设备管理

export const getDevicePagedList = data => fetch('/Smk_Devices/List_Smk_Devices', data, 'POST');
export const addDevice = data => fetch('/Smk_Devices/Add_Smk_Devices', data, 'POST');
export const editDevice = data => fetch('/Smk_Devices/Edit_Smk_Devices', data, 'POST');
export const delDevice = data => fetch('/Smk_Devices/Delete_Smk_Devices', data, 'POST');
export const getAgentList = data => fetch('/Sys_Users/List_Agent_Combo', data, 'POST');
export const distributeDeviceToAgent = data => fetch('/Smk_Devices/Distibute_Device_ToAgent', data, 'POST');
export const getDeviceListExcel = data => fetch('/Smk_Devices/ToExcel', data, 'POST');

// endregion

// region 微信用户

export const getMobileCusPagedList = data => fetch('/Mobile_Cus/List_Mobile_Cus', data, 'POST');
export const editMobileCus = data => fetch('/Mobile_Cus/Edit_Mobile_Cus', data, 'POST');

// endregion

// region 联网单位管理

// 地区
export const getAreasPagedList = data => fetch('/Smk_Areas/List_Smk_Areas', data, 'POST');
export const addAreas = data => fetch('/Smk_Areas/Add_Smk_Areas', data, 'POST');
export const editAreas = data => fetch('/Smk_Areas/Edit_Smk_Areas', data, 'POST');
export const delAreas = data => fetch('/Smk_Areas/Delete_Smk_Areas', data, 'POST');

// 联网单位
export const getGroupCompanyPagedList = data => fetch('/Smk_GroupCompany/List_Smk_GroupCompany', data, 'POST');
export const addGroupCompany = data => fetch('/Smk_GroupCompany/Add_Smk_GroupCompany', data, 'POST');
export const editGroupCompany = data => fetch('/Smk_GroupCompany/Edit_Smk_GroupCompany', data, 'POST');
export const delGroupCompany = data => fetch('/Smk_GroupCompany/Delete_Smk_GroupCompany', data, 'POST');

// 维保单位
export const getMaintenancePagedList = data => fetch('/Smk_Maintenance/List_Smk_Maintenance', data, 'POST');
export const addMaintenance = data => fetch('/Smk_Maintenance/Add_Smk_Maintenance', data, 'POST');
export const editMaintenance = data => fetch('/Smk_Maintenance/Edit_Smk_Maintenance', data, 'POST');
export const delMaintenance = data => fetch('/Smk_Maintenance/Delete_Smk_Maintenance', data, 'POST');

// endregion

// region 首页

export const getSimCardGroupStatic = data => fetch('/Home/SimCardGroupStatic', data, 'POST');
export const getFlowUsagePie = data => fetch('/Home/FlowUsagePieStatic', data, 'POST');
export const getPoolUsageLine = data => fetch('/Home/PoolUsageLineStatic', data, 'POST');
// endregion