package com.huawei.logpro.test;

import java.util.HashMap;
import java.util.Map;

import javax.sql.DataSource;

import org.apache.ibatis.session.SqlSessionFactory;
import org.junit.Before;
import org.junit.Test;
import org.mybatis.spring.mapper.MapperScannerConfigurer;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import com.huawei.logpro.dao.AdminDao;
import com.huawei.logpro.entity.Admin;

public class testDemo {
	 private ClassPathXmlApplicationContext xt;
	 @Before
	 public void unitWork(){
		 xt=new ClassPathXmlApplicationContext("springweb-mybatis.xml");
	 }
	 //测试ibatis配置
	 @Test
	 public void testDataSource(){
		 DataSource data=xt.getBean("dataSource",DataSource.class);
		 System.out.println(data);
		 
	 }
	@Test
	public void test2(){
		SqlSessionFactory factory=xt.getBean("sqlSessionFactory",SqlSessionFactory .class);
		System.out.println(factory);
	}
	@Test
	public void test3(){
		MapperScannerConfigurer scanner=xt.getBean("mapperScanner",MapperScannerConfigurer.class);
		System.out.println(scanner);
	}
	@Test
	public void test4(){
		Admin a=new Admin("1","nick","12rtyrtyrt45","2wyyte3");
		AdminDao dao=xt.getBean("adminDao",AdminDao.class);
		dao.saveAdmin(a);
	}
	@Test
	public void test5(){
		AdminDao dao=xt.getBean("adminDao",AdminDao.class);
		Admin at=dao.findAdminByName("nick");
		System.out.println(at);
	}
	@Test
	public void test6(){
		AdminDao dao=xt.getBean("adminDao",AdminDao.class);
		Map<String,Object> map=new HashMap<String,Object>();
		map.put("name", "jim");
		map.put("id", "2");
		int i=dao.updateAdmin(map);
		System.out.println(i);
		Admin admin=dao.findAdminByName("jim");
		System.out.println(admin);
	}
}
