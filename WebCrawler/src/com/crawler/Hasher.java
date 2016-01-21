package com.crawler;

import java.security.MessageDigest;

public class Hasher {
	public static String toSha256(String inString)
	{
		try{
		MessageDigest md = MessageDigest.getInstance("SHA-256");
		String text = inString.toLowerCase();
		md.update(text.getBytes("ASCII"));
		byte[] hash = md.digest();
		
		
		
        StringBuffer hexString = new StringBuffer();
    	for (int i=0;i<hash.length;i++) {
    	  hexString.append(Integer.toHexString(0xFF & hash[i]));
    	}

		
		return hexString.toString();
		
		
		}
		catch(Exception exc)
		{
			return exc.toString();
		}
	}
}
