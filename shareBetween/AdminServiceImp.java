package com.huawei.logpro.service;

import java.awt.image.BufferedImage;
import java.io.IOException;
import java.io.OutputStream;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import javax.annotation.Resource;
import javax.imageio.ImageIO;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.stereotype.Service;


import com.huawei.logpro.dao.AdminDao;
import com.huawei.logpro.entity.Admin;
import com.huawei.logpro.entity.ConstantCollection;
import com.huawei.logpro.util.DrawCodeUtil;
import com.huawei.logpro.util.PasswordUtil;

@Service("adminService")
public class AdminServiceImp implements AdminService {
	@Resource
	private AdminDao adminDao;

	public Admin loginAction(String name, String password,String imgcode,String sessionCode) throws AdminNameException,PasswordException{
		String reg="^\\w{3,32}$";
		if(imgcode==null||imgcode.trim().isEmpty()){
			throw new ImgCodeException(ConstantCollection.IMGCODE_NULL);
		}
		if(!imgcode.equals(sessionCode)){
			throw new ImgCodeException(ConstantCollection.IMGCODE_ERROR);
		}
		if(name==null||name.trim().isEmpty()){
			throw new AdminNameException(ConstantCollection.NULL_NAME);
		}
		if(!name.matches(reg)){
			throw new AdminNameException(ConstantCollection.NOFIT_NAME);
		}
		if(password==null||password.trim().isEmpty()){
			throw new PasswordException(ConstantCollection.NULL_PASSWORD);
		}
		if(!name.matches(reg)){
			throw new PasswordException(ConstantCollection.NOFIT_PASSWORD);
		}
		Admin a=adminDao.findAdminByName(name);
		if(a==null){
			throw new AdminNameException(ConstantCollection.NULL_NAME);
		}
		String md5pass=PasswordUtil.encrypt(password);
		if(a.getPassword().equals(md5pass)){
			Map<String,Object> map = new HashMap<String,Object>();
			String token = UUID.randomUUID().toString();
			System.out.println(token);
			map.put("id", a.getId());
			map.put("token", token);
			adminDao.updateAdmin(map);
			return adminDao.findAdminByName(name);
		}
		throw new PasswordException(ConstantCollection.ERROR_PASSWORD);
	}

	public Admin registerAdmin(String name, String password, String confirmPass) throws AdminNameException,PasswordException{
		String reg="^\\w{3,32}$";
		if(name==null||name.trim().isEmpty()){
			throw new AdminNameException(ConstantCollection.NULL_NAME);
		}
		if(!name.matches(reg)){
			throw new AdminNameException(ConstantCollection.NOFIT_NAME);
		}
		if(password==null||password.trim().isEmpty()){
			throw new PasswordException(ConstantCollection.NULL_PASSWORD);
		}
		if(!name.matches(reg)){
			throw new PasswordException(ConstantCollection.NOFIT_PASSWORD);
		}
		name=name.trim();
		password=password.trim();
		confirmPass=confirmPass.trim();
		if(!password.equals(confirmPass)){
			throw new PasswordException(ConstantCollection.NOFIT_CONFRIMPASS);
		}
		Admin a=adminDao.findAdminByName(name);
		if(a!=null){
			throw new AdminNameException(ConstantCollection.REGISTER);
		}
		String id =UUID.randomUUID().toString();
		String token="";
		password=PasswordUtil.encrypt(password);
		Admin admin = new Admin(id,name,password,token);
		adminDao.saveAdmin(admin);
		return admin;
	}

	public boolean checkLogin(String name, String token) {
		if(name==null || name.trim().isEmpty()){
			return false;
		}
		if(token==null || token.trim().isEmpty()){
			return false;
		}
		Admin a=adminDao.findAdminByName(name);
		if(a==null){
			return false;
		}
		System.out.println(a.getToken());
		return token.equals(a.getToken());
	}

	public Admin findAdmin(String name) throws AdminNameException {
		Admin a=adminDao.findAdminByName(name);
		System.out.println(a);
		return a;
	}

	public void createImageCode(HttpServletRequest req, HttpServletResponse res)
			throws ServletException, IOException {
		Object[] objs=DrawCodeUtil.createImage();
		String imgcode=(String) objs[0];
		System.out.println(imgcode);
		HttpSession session=req.getSession();
		session.setAttribute("imgcode", imgcode);
		
		BufferedImage img=(BufferedImage) objs[1];
		res.setContentType("image/png");
		
		OutputStream os=res.getOutputStream();
		ImageIO.write(img, "png", os);
		os.flush();
		
	}

	public Admin modMessage(String id,String name, String address, String article)
			throws AdminNameException {
		Admin a=adminDao.findAdminByName(name);
		if(a==null){
			throw new AdminNameException(ConstantCollection.NULL_NAME);
		}
		Map<String,Object> map = new HashMap<String,Object>();
		map.put("id", id);
		map.put("address",address);
		map.put("article", article);
		int ad=adminDao.modMessage(map);
		if(ad>0){
			a=adminDao.findAdminByName(name);
			return a;
		}else{
			throw new AdminNameException(ConstantCollection.FAILED);
		}
	}

}
