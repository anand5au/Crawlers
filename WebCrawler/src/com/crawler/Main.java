package com.crawler;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Timestamp;
import java.util.HashSet;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import de.l3s.boilerpipe.BoilerpipeProcessingException;
import de.l3s.boilerpipe.extractors.ArticleExtractor;

public class Main {

	static Connection connection = null;
	static Statement stmt = null;
	static Set url_set = new HashSet<String>();
	static int count = 0;
	static int maxCount = 50;

	public static void connectToTheDatabase()
	{
		System.out.println("-------- PostgreSQL "
				+ "JDBC Connection Testing ------------");

		try {

			Class.forName("org.postgresql.Driver");

		} catch (ClassNotFoundException e) {

			System.out.println("Where is your PostgreSQL JDBC Driver? "
					+ "Include in your library path!");
			e.printStackTrace();
			return;
		}

		System.out.println("PostgreSQL JDBC Driver Registered!");

		connection = null;;

		try {

			connection = DriverManager.getConnection(
					"jdbc:postgresql://127.0.0.1:5432/CrawlerJava", "postgres",
					"password");
			Class.forName("org.postgresql.Driver");

			connection.setAutoCommit(false);
			System.out.println("Opened database successfully");

			stmt = connection.createStatement();
			stmt.executeUpdate("DELETE FROM crawler;");



		} catch (SQLException e) {

			System.out.println("Connection Failed! Check output console");
			e.printStackTrace();
			return;

		} catch (ClassNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		if (connection != null) {
			System.out.println("You made it, take control your database now!");
	
		} else {
			System.out.println("Failed to make connection!");
		}
	
	}

	public static void crawlWepPage(String anchorUrl)
	{
		if(count < maxCount)
			count++;
		else 
			return;
		
		if(url_set.contains(anchorUrl))
		{
			return;
		}
		else
		{
			url_set.add(anchorUrl);
		}
		Domain domain = new Domain(anchorUrl);

		try {

			WebPage webPage = new WebPage(domain);

			webPage.getDocumentFromWeb();
			Document doc = webPage.getDocuemnt();
			String htmlString = webPage.getHTMLDocument();
			if(htmlString ==null)
				return;
			String extractedTextOfHTML = ""; 
			try {
				extractedTextOfHTML = ArticleExtractor.INSTANCE.getText(htmlString); //ArticleExtractor // KeepEverythingExtractor // KeepEverythingExtractor
				//System.out.println(extractedTextOfHTML);
			} catch (BoilerpipeProcessingException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}

			//System.out.println(htmlString);
			if( doc == null)
				System.out.println("The document is null");

			extractedTextOfHTML = extractedTextOfHTML.replaceAll("\"|'", "`");
			htmlString = htmlString.replaceAll("\"|'", "`");
			String sql_stm = insert_to_db_stm_str( domain.getDomainHash(),domain.getDomainUrl(), htmlString,extractedTextOfHTML,domain.getCreated());
			execute_statement(sql_stm);


			Elements hrefs = doc.select("a");//#mp-itn b a


			for(Element e : hrefs)
			{
				// abs stands for absolute path. 
				String href = e.attr("abs:href").trim();
				System.out.println("Anchor:"+href);
				if(!href.equals(anchorUrl))
					crawlWepPage(href);
				//anchors.add(href);
			}
		} catch (Exception e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}

	}

	// This function execute SQL statement 
	public static void execute_statement(String sql_stm)
	{
		try {
			stmt.executeUpdate(sql_stm);

		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

	}

	// This function returns a formated INSERT SQL string. 
	public static String insert_to_db_stm_str(String sha256_sig,String url, String html_cont,String text_content,Timestamp created)
	{
		//,html_cont,text_content,
		String sql_stm_str = "INSERT INTO crawler (sha256_sig,url,created,html_cont,text_content)"
				+ " VALUES ("
				+"'"+sha256_sig+"',"
				+"'"+url+"',"
				+"'"+created.toString()+"',"
				+"'"+html_cont+"',"
			 	+"'"+text_content+"'"
				+");"; 
		System.out.println(sql_stm_str);

		return sql_stm_str;

	}


	public static void main(String[] args)
	{
		// connect to the database:
		connectToTheDatabase();
		//

		String anchorUrl = "http://jsoup.org/";
		
		//CRAWLING PAGES
		crawlWepPage(anchorUrl);
		
		
		
		
		try {
			stmt.close();
			connection.commit();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

	}
}
