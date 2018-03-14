package com.huawei.logpro.test;

import javax.sql.DataSource;

import org.junit.Before;
import org.junit.Test;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import com.huawei.logpro.dao.AdminDao;
import com.huawei.logpro.entity.Admin;
import com.huawei.logpro.service.AdminService;

public class TestServiceLogin {
	 private ClassPathXmlApplicationContext xt;
	 @Before
	 public void unitWork(){
		 xt=new ClassPathXmlApplicationContext("springweb-mybatis.xml","springweb-service.xml","springweb-web.xml");
	 }
	 @Test
	 public void testServiceRegister(){
		 AdminService service=xt.getBean("adminService",AdminService.class);
		 AdminDao dao=xt.getBean("adminDao",AdminDao.class);
		 service.registerAdmin("jiangconghu", "jchjch456", "jchjch456");
		 Admin a=dao.findAdminByName("jiangconghu");
		 System.out.println(a);
		 
	 }
	 @Test
	 public void test1(){
		 AdminService service=xt.getBean("adminService",AdminService.class);
		 AdminDao dao=xt.getBean("adminDao",AdminDao.class);
		 //service.registerAdmin("jiangconghu", "jchjch456", "jchjch456");
		 //Admin a=dao.findAdminByName("jiangconghu");
		 Admin a=service.loginAction("jiangconghu", "jchjch456", null, null);
		 System.out.println(a);
	 }
}
