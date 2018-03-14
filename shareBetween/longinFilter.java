package com.huawei.logpro.web;

import java.io.IOException;
import java.util.Date;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.context.ApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import com.huawei.logpro.entity.ConstantCollection;
import com.huawei.logpro.service.AdminService;

public class LoginFilter implements Filter {
	private ServletContext sc;
	private ApplicationContext ctx;
	private AdminService adminService;

	public LoginFilter() {
		
	}

	public void destroy() {

	}

	public void init(FilterConfig fcf) throws ServletException {
		sc=fcf.getServletContext();
		ctx=WebApplicationContextUtils.getWebApplicationContext(sc);
		adminService=ctx.getBean("adminService", AdminService.class);
	}

	public void doFilter(ServletRequest req, ServletResponse res,FilterChain chain) throws IOException, ServletException {
		HttpServletRequest request=(HttpServletRequest)req;
		HttpServletResponse response=(HttpServletResponse)res;
		String path=request.getRequestURI();
		if(path.matches(".*/.*_message\\.html$")){
			String token=getCookie(request,"token");
			String name=getCookie(request,"userName");
			if(adminService.checkLogin(name, token)){
				chain.doFilter(request, response);
				return;
			}
			path=request.getContextPath()+
					"/log_in.html";
			response.sendRedirect(path);
		}
		if(path.matches(".*/(user).*\\.go$")){
			String token=getCookie(request,"token");
			String name=getCookie(request,"userName");
			if(adminService.checkLogin(name, token)){
				chain.doFilter(request, response);
				return;
			}
			path=request.getContextPath()+
					"/log_in.html";
			response.sendRedirect(path);
		}
		if(path.matches(".*/*.js")){
			response.setHeader("Cache-Control", "public");
			response.setHeader("Expires", (new Date(2018,5,6)).toString());
			chain.doFilter(request, response);
		}
		if(path.matches(".*/message2.css")){
			/*String token=getCookie(request,"token");
			String name=getCookie(request,"userName");
			if(adminService.checkLogin(name, token)){
				chain.doFilter(request, response);
				return;
			}
			path=request.getContextPath()+
					"/log_in.html";
			response.sendRedirect(path);*/
			//System.out.println(path);
			chain.doFilter(request, response);
			/*while(true){
				
			}*/
			//return;
		}
		//if(path.matches(".*/(admin).*\\.go$")){
/*			String token=getCookie(request,"token");
			String name=getCookie(request,"userName");
			if(adminService.checkLogin(name, token)){
				chain.doFilter(request, response);
				return;
			}
			path=request.getContextPath()+
					"/log_in.html";
			response.sendRedirect(path);
	
		}*/

		
/*		String json="{\"state\":\"logout\",\"message\":"+ConstantCollection.NOT_LOGIN+"}";
		response.setCharacterEncoding("UTF-8");
		response.setContentType("aplication/json;charset=UTF-8");
		response.getWriter().println(json);*/
		response.addHeader("Cache-Control", "no-cache");
		chain.doFilter(request, response);
	}

	
	public String getCookie(HttpServletRequest request,String cookieName){
		Cookie[] cookie=request.getCookies();
		if(cookie==null){
			return null;
		}
		if(cookie!=null){
		for(Cookie coo:cookie){
			if(cookieName.equals(coo.getName())){
				return coo.getValue();
			}
		}
		}
		return null;
		
	}

}
