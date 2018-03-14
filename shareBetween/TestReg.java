package com.huawei.logpro.test;

public class TestReg {
	
	public static void main(String[] args) {
		String path="/jdsjfdsf/iiiii/343_edit.html";
		System.out.println(path.matches(".*/.*_edit\\.html$"));
		String path1="/45645eterte/t/wwe/user/message.go";
		System.out.println(path1.matches(".*/(user).*\\.go$"));
		path=path.substring(path.indexOf('/',1));
		System.out.println(path);
	}

}
