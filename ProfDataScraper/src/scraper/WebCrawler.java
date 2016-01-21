package scraper;

import java.util.Collection;
import java.util.Collections;
import java.util.concurrent.ForkJoinPool;
import java.util.HashSet;

public class WebCrawler implements LinkHandler {

    private final Collection<String> visitedLinks = Collections.synchronizedSet(new HashSet<String>());
    private String url;
    private ForkJoinPool mainPool;

    public WebCrawler(String startingURL, int maxThreads) {
        this.url = startingURL;
        mainPool = new ForkJoinPool(maxThreads);
    }

    private void startCrawling() {
        mainPool.invoke(new LinkFinderAction(this.url, this));
    }

    @Override
    public int size() {
        return visitedLinks.size();
    }

    @Override
    public void addVisited(String s) {
        visitedLinks.add(s);
    }

    @Override
    public boolean visited(String s) {
        return visitedLinks.contains(s);
    }

    /**
     * @param args the command line arguments
     */
    public static void main(String[] args) throws Exception 
    {
        if(args.length <=0) 
    	{
        	System.out.println("Insufficient arguments!");
        	return;
    	}
        
        for(String arg : args)
        {
        	System.out.println("Crawling "+arg);
        	new WebCrawler(arg, 20).startCrawling();
        }
    }
}