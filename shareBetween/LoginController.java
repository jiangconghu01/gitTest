package com.huawei.logpro.web;

import java.io.IOException;

import javax.annotation.Resource;
import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.huawei.logpro.entity.Admin;
import com.huawei.logpro.entity.ConstantCollection;
import com.huawei.logpro.service.AdminNameException;
import com.huawei.logpro.service.AdminService;
import com.huawei.logpro.service.PasswordException;
import com.huawei.logpro.util.JsonFormatUtil;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
@Controller
@RequestMapping("/admin")
public class LoginController {
	@Resource(name="adminService")
	private AdminService service;

	@SuppressWarnings("rawtypes")
	@RequestMapping("/login.go")
	@ResponseBody
	public JsonFormatUtil loginActionController(String name,String password,String imgcode,HttpServletRequest req,HttpServletResponse res){
		Admin ad = new Admin();
		try {
			HttpSession session=req.getSession();
			String sessionCode=(String)session.getAttribute("imgcode");

			ad = service.loginAction(name, password,imgcode,sessionCode);
			Cookie cookie=new Cookie("token",ad.getToken());
			cookie.setPath("/");
			res.addCookie(cookie);
		} catch (AdminNameException e) {
			return new JsonFormatUtil(e);
		}catch (PasswordException e) {
			return new JsonFormatUtil(e);
		}catch (Exception e) {
			return new JsonFormatUtil(e);
		}
			return new JsonFormatUtil<Admin>(ad);
	}
	
	@SuppressWarnings("rawtypes")
	@RequestMapping("/register.go")
	@ResponseBody
	public JsonFormatUtil registerAction(String name,String password,String confirmPass){
		Admin admin = new Admin();
		try {
			admin = service.registerAdmin(name, password, confirmPass);
		} catch (AdminNameException e) {
			return new JsonFormatUtil(e);
		}catch (PasswordException e) {
			return new JsonFormatUtil(e);
		}catch (Exception e) {
			return new JsonFormatUtil(e);
		}
			return new JsonFormatUtil<Admin>(admin);
		
	}
	@SuppressWarnings("rawtypes")
	@RequestMapping(value="/imgcode.go", method=RequestMethod.GET)
	@ResponseBody
	public JsonFormatUtil validateImgCode(HttpServletRequest req, HttpServletResponse res){
		try {
			service.createImageCode(req ,res);
		} catch (ServletException e) {
			return new JsonFormatUtil(e);
		} catch (IOException e) {
			return new JsonFormatUtil(e);
		}
		return new JsonFormatUtil(ConstantCollection.SUCCESS);
	}

}
