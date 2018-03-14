package com.huawei.logpro.util;

import java.awt.Color;
import java.awt.Font;
import java.awt.Graphics;
import java.awt.image.BufferedImage;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.util.Random;

import javax.imageio.ImageIO;

public class DrawCodeUtil {
	public static final char[] codeCollection={'A','B','C','D','E','F','G','H','I','G','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','1','2','3','4','5','6','7','8','9'};
	//public static final String[] codeCollectionMin={'A','B','C','D','E','F','G','H','I','G','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'};
	//public static final char[] codeCollectionNum={'1','2','3','4','5','6','7','8','9'};
	private static final int CODE_SIZE = 4;
	// 干扰线数量
	private static final int LINES = 6;
	private static final int WIDTH = 80;
	private static final int HEIGHT = 30;
	private static final int FONT_SIZE = 30;
	
	public static Object[] createImage(){
		StringBuffer buffer=new StringBuffer();
		BufferedImage image =new BufferedImage(WIDTH, HEIGHT, BufferedImage.TYPE_INT_RGB);
		Graphics graphic = image.getGraphics();
		graphic.setColor(getRandomColor());
		graphic.fillRect(0, 0, WIDTH, HEIGHT);
		Random ran = new Random();
		for (int i = 0; i <CODE_SIZE; i++) {
			// 取随机字符索引
			int n = ran.nextInt(codeCollection.length);
			// 设置随机颜色
			graphic.setColor(getRandomColor());
			// 设置字体大小
			graphic.setFont(new Font(
				null, Font.BOLD + Font.ITALIC, FONT_SIZE));
			// 画字符
			graphic.drawString(
					codeCollection[n] + "", i * WIDTH / CODE_SIZE, HEIGHT-5);
			buffer.append(codeCollection[n]);
		}
		//画干扰线
		for (int i = 0; i < LINES; i++) {
			// 设置随机颜色
			graphic.setColor(getRandomColor());
			// 随机画线
			graphic.drawLine(ran.nextInt(WIDTH), ran.nextInt(HEIGHT),
					ran.nextInt(WIDTH), ran.nextInt(HEIGHT));
		}
		return new Object[]{buffer.toString(),image} ;
		
	}
	
	public static Color getRandomColor() {
		Random ran = new Random();
		Color color = new Color(ran.nextInt(256), 
				ran.nextInt(256), ran.nextInt(256));
		return color;
	}
/*	public static void main(String[] args) throws IOException {
		Object[] objs = createImage();
		BufferedImage image = (BufferedImage) objs[1];
		OutputStream os = new FileOutputStream("D:/testProject/2.jpg");
		ImageIO.write(image, "jpeg", os);
		os.close();
		System.out.println(codeCollection);
	}*/
}
