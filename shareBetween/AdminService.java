package com.huawei.logpro.service;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.huawei.logpro.entity.Admin;

public interface AdminService {
	public  Admin loginAction(String name,String password,String imgcode,String sessionCode)throws AdminNameException,PasswordException;
	public Admin registerAdmin(String name,String password,String confirmPass)throws AdminNameException,PasswordException;
	public Admin findAdmin(String name)throws AdminNameException;
	public boolean checkLogin(String name ,String token);
	public void createImageCode(HttpServletRequest req, HttpServletResponse res)throws ServletException,IOException;
	public Admin modMessage(String id,String name,String adress,String article)throws AdminNameException;
}
