package com.huawei.logpro.util;

import com.huawei.logpro.entity.ConstantCollection;

public class JsonFormatUtil<T> {
	private String state;
	private T data;
	private String message;
	public JsonFormatUtil() {
		
	}
	public JsonFormatUtil(T data) {
		this.state = ConstantCollection.SUCCESS;
		this.data = data;
		this.message = "";
	}
	public JsonFormatUtil(String state,Throwable e) {
		this.state = ConstantCollection.FAILED;
		this.data = null;
		this.message = e.getMessage();
	}
	public JsonFormatUtil(String state) {
		this.state = ConstantCollection.SUCCESS;
		this.data = null;
		this.message = ConstantCollection.SUCCESS;
	}
	public JsonFormatUtil(Throwable e) {
		this.state = ConstantCollection.FAILED;
		this.data = null;
		this.message = e.getMessage();
	}
	public String getState() {
		return state;
	}
	public void setState(String state) {
		this.state = state;
	}
	public T getData() {
		return data;
	}
	public void setData(T data) {
		this.data = data;
	}
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}

}
