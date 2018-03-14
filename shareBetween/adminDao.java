package com.huawei.logpro.dao;

import java.util.Map;

import com.huawei.logpro.entity.Admin;

public interface AdminDao {
	public void saveAdmin(Admin admin);
	public Admin findAdminByName(String name);
	public int updateAdmin(Map<String,Object> map);
	public int modMessage(Map<String,Object> map);
}
