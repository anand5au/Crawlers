package scraper;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.net.URL;
import java.util.ArrayList;
import java.util.concurrent.RecursiveAction;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

@SuppressWarnings("serial")
public class LinkFinderAction extends RecursiveAction {

	private String url;
    private LinkHandler cr;

    public LinkFinderAction(String url, LinkHandler cr) {
        this.url = url;
        this.cr = cr;
    }

    @Override
    public void compute() 
    {
        if (!cr.visited(url)) 
        {
            try 
            {
                Document doc = Jsoup.connect(url).get();
                ArrayList<String> pubLinks = new ArrayList<String>();
                for(Element e : doc.getElementsMatchingOwnText("Publications"))
                {
                	String link = e.attr("href");
                	
                	if(!link.startsWith("http"))
                		link = url + link;
                	System.out.println(link);
                	pubLinks.add(link);
                }
                
                for(String link:pubLinks)
                {
                	doc = Jsoup.connect(link).get();
                	Elements ele = doc.getElementsMatchingOwnText("pdf");
                	System.out.println(ele);
                	
                	for(Element e: ele)
                	{
                		String l = e.attr("href");
                    	if(!l.startsWith("http"))
                    		l = url + l;
                    	
	                	URL url1 = new URL(l);
	                	System.out.println(url1);
	                	InputStream in = url1.openStream();
	                	String[] names = l.split("/");
	                	String name = names[names.length - 1];
	                	FileOutputStream fos = new FileOutputStream(new File(name + ".pdf"));
	                	
	                	int length = -1;
	                	byte[] buffer = new byte[1024];
	                	while ((length = in.read(buffer)) > -1) 
	                	{
	                	    fos.write(buffer, 0, length);
	                	}
	                	fos.close();
	                	in.close();
                	}
                }
                
            } 
            catch (Exception e) { }
        }
    }
}