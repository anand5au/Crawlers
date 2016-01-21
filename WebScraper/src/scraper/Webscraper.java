package scraper;

import java.io.File;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import org.w3c.dom.Document;
import org.w3c.dom.Element;

import org.jsoup.Jsoup;
import org.jsoup.select.Elements;

public class Webscraper 
{
	Document doc;
	Element root;
	DocumentBuilderFactory factory;
	DocumentBuilder builder;
	
	public Webscraper(String rootTag)
	{
		this.Initialize();
		doc = builder.newDocument();
		root = doc.createElement(rootTag);
		doc.appendChild(root);
	}
	
	public void Initialize()
	{
		factory = DocumentBuilderFactory.newInstance();
		try 
		{
			builder = factory.newDocumentBuilder();
		} 
		catch (ParserConfigurationException e) 
		{
			e.printStackTrace();
		}
	}
	
	public void AddElement(String name)
	{
		Element node = doc.createElement(name);
		root.appendChild(node);
	}
	
	public void AddElement(String name, String text)
	{
		Element node = doc.createElement(name);
		node.appendChild(doc.createTextNode(text));
		root.getLastChild().appendChild(node);
	}
	
	// Add more variants of AddElement as required
	
	public void CreateXMLFile() throws TransformerException
	{
		TransformerFactory fac = TransformerFactory.newInstance();
		Transformer trans = fac.newTransformer();
		DOMSource source = new DOMSource(doc);
		StreamResult stream = new StreamResult(new File("prof_data.xml"));
		
		trans.transform(source, stream);
	}
	
	public static void main(String[] args)
	{
		org.jsoup.nodes.Document doc;
		int i=0;
		Webscraper scraper = new Webscraper("Professors");
		try 
		{
			doc = Jsoup.connect("http://cidse.engineering.asu.edu/facultyandresearch/directory/faculty/").get();
			Elements anchors = doc.select("a.image_icon_doc"); //select all anchor tags with class image_icon_doc
			Elements nameAnchors = doc.select("a[target*=_self]");
			
			for(i=0; i< anchors.size(); i++)
			{
				String href = anchors.get(i).attr("href").trim();
				String name = nameAnchors.get(i).html();
				scraper.AddElement("Professor");
				scraper.AddElement("Name", name);
				scraper.AddElement("ProfileLink", href);
			}
			scraper.CreateXMLFile();
			System.out.println(i);
		}
		catch (Exception exc) 
		{
			exc.printStackTrace();
		}
	}
}
