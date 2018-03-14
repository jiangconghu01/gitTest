package com.huawei.logpro.util;

import org.apache.commons.codec.digest.DigestUtils;

public class PasswordUtil {
	public static String crypt="用于加密的文字";
	public static String encrypt(String password){
		String cryPass=DigestUtils.md5Hex(password);
		return cryPass;
		
	}
	public static void main(String[] args) {
		String v=PasswordUtil.encrypt("123rereuu");
		System.out.println(v);
	}
}
