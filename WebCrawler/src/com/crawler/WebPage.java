package com.crawler;

import java.io.IOException;
import java.util.HashSet;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

public class WebPage {

	private Domain domain;

	private Document document;
	public WebPage(Domain domain)
	{
		this.domain = domain;
	}

	public Document getDocuemnt()
	{
		return this.document;
	}

	public String getHTMLDocument()
	{
		return document.html();
	}
	public void getDocumentFromWeb()
	{
		String crawlUrl = "http://jsoup.org/";

		try {
			document = Jsoup.connect(domain.getDomainUrl()).get();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}


	}
}
