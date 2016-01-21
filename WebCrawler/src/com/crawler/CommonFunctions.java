package com.crawler;

import java.sql.Timestamp;

public class CommonFunctions {
	public static Timestamp getTimeStamp()
	{
		java.util.Date date = new java.util.Date();
		return new Timestamp(date.getTime());
	}
}
