package com.crawler;

import java.sql.Timestamp;

public class Domain {

	
		private String domainHash;
		private String domainUrl;
		private Timestamp created;
		
		
		public String getDomainHash() {
			return domainHash;
		}
		public String getDomainUrl() {
			return domainUrl;
		}
		public Timestamp getCreated() {
			return created;
		}
		
		public Domain(String domainUrl)
		{
			this.domainHash = Hasher.toSha256(domainUrl);
			this.domainUrl = domainUrl;
			this.created = CommonFunctions.getTimeStamp();
			
		}
		
	
		
		
}
