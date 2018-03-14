package com.huawei.logpro.web;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.huawei.logpro.entity.Admin;
import com.huawei.logpro.service.AdminNameException;
import com.huawei.logpro.service.AdminService;
import com.huawei.logpro.service.PasswordException;
import com.huawei.logpro.util.JsonFormatUtil;

@Controller
@RequestMapping("/user")
public class AdminController {
	@Resource(name="adminService")
	private AdminService service;
	
	@SuppressWarnings("rawtypes")
	@RequestMapping("/message.go")
	@ResponseBody
	public JsonFormatUtil getMessageAction(String name,HttpServletRequest req){
		Admin adm= new Admin();
		try {
			adm = service.findAdmin(name);
			System.out.println(adm);
			System.out.println(req.getParameter("jsonpCallback"));
		} catch (AdminNameException e) {
			return new JsonFormatUtil(e);
		}catch (PasswordException e) {
			return new JsonFormatUtil(e);
		}catch (Exception e) {
			return new JsonFormatUtil(e);
		}
		return new JsonFormatUtil<Admin>(adm);
		
	}
	@SuppressWarnings("rawtypes")
	@RequestMapping("/modmes.go")
	@ResponseBody
	public JsonFormatUtil modAdminMessage(String id,String name,String address,String article,HttpServletRequest req){
		Admin result =null;
		try {
			result = service.modMessage(id, name, address, article);
		} catch (Exception e) {
			return new JsonFormatUtil(e);
		}
		return new JsonFormatUtil<Admin>(result);
		
	}

}
