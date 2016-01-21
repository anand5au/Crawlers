function checkDate(value, field){
	if(value != "starts on/after" && value != "ends by" ){
		 // regular expression to match required date format 
		 var re = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
		 var minYear = 2007;
		 var maxYear = 2009;
		 
		  	if(regs = value.match(re)) { 
		  		if(regs[1] < 1 || regs[1] > 12) { 
		  			$.popup.show("Warning","The search field '"+field+"' is incorrect. \n\n Invalid value for month: " + regs[1]+".");
		  			return false; 
		  		} 
		  		if(regs[2] < 1 || regs[2] > 31) { 
			  		$.popup.show("Warning","The search field '"+field+"' is incorrect. \n\n Invalid value for day: " + regs[2]+".");
			  		return false; 
			  	} 
			  	/*if(regs[3] < minYear || regs[3] > maxYear) {*/
			  	if(regs[3] < minYear) {
			  	 	$.popup.show("Warning","The search field '"+field+"' is incorrect. \n\nPlease enter a valid 4 digit year after "+minYear+".");
			  	 	return false; 
			  	 } 
			  } else { 
			  		$.popup.show("Warning","The search field '"+field+"' is incorrect. \n\nThe date format should be : mm/dd/yyyy.");
			  		return false; 
		} 
	}
	return true;
		
}

function checkTime(value, field){

	// regular expression to match required time format 
	var re = /^(\d{1,2})(:(\d{2})){0,1}(\s?[aApP][mM])?$/; 
	
			if(regs = value.match(re)) { 
				if(regs[3]) { 
					if(regs[1] < 1 || regs[1] > 12) {	 
						$.popup.show("Warning","The search field 'Time' is incorrect. \n\n"+value+" is not a valid time. Please enter time in the following format: 9:00am or 3:30pm.");
						return false; 
					} 
			} else { 
				if(regs[1] > 23) { 
					$.popup.show("Warning","The search field 'Time' is incorrect. \n\n"+ value+" is not a valid time. Please enter time in the following format: 9:00am or 3:30pm.");
					return false; 
				} 
			} 
			
			if(regs[2] > 59) { 
				$.popup.show("Warning","The search field 'Time' is incorrect. \n\n"+ value+" is not a valid time. Please enter time in the following format: 9:00am or 3:30pm.");
				return false;
			 }
		 } else { 
		 	$.popup.show("Warning","The search field  'Time' is incorrect. \n\nPlease enter time in the following format: 9:00am or 3:30pm ");
		 	return false; 
		 } 

		return true; 
}