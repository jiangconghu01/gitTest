package com.huawei.logpro.web;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("/login")
public class HelloWord {
	@RequestMapping("/test")
	@ResponseBody
	public Object testHello(){
		return new String[]{"message","hello to the project to jch33!"};
	}
}
