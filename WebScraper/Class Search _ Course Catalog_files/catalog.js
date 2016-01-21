var isBrowserMobile = (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()));
var isBrowserTablet = isBrowserMobile && ($('body').innerWidth() > 780 || $('body').innerHeight() > 780);
var dropdowns = ['#locationMobile', '#mobileLevel', '#mobileGenStudies', '#mobileSession', '#mobileUnits', '#mobileLocation', '#mobileGenStudiesAnd1', '#mobileGenStudiesAnd2'];
var columnNames = {
	'#toggle-classNbrColumn' : '.classNbrColumnHeader, .classNbrColumnValue',
	'#toggle-subjectNumberColumn': '.subjectNumberColumnHeader, .subjectNumberColumnValue',
	'#toggle-titleColumn' : '.titleColumnHeader, .titleColumnValue',
	'#toggle-hoursColumn' : '.hoursColumnHeader, .hoursColumnValue',
	'#toggle-startDateColumn' : '.startDateColumnHeader, .startDateColumnValue',
	'#toggle-dayListColumn' : '.dayListColumnHeader, .dayListColumnValue',
	'#toggle-startTimeDateColumn' : '.startTimeDateColumnHeader, .startTimeDateColumnValue',
	'#toggle-endTimeDateColumn' : '.endTimeDateColumnHeader, .endTimeDateColumnValue',
	'#toggle-locationBuildingColumn' : '.locationBuildingColumnHeader, .locationBuildingColumnValue',
	'#toggle-gsColumn' : '.tooltipRqDesDescrColumnHeader, .tooltipRqDesDescrColumnValue',
	'#toggle-instructorListColumn' : '.instructorListColumnHeader, .instructorListColumnValue',
	'#toggle-availableSeatsColumn' : '.availableSeatsColumnHeader, .availableSeatsColumnValue'
};
var advancedSearchFields = {
	'#mobileAdvTerm' : '#term',
	'#mobileAdvSearchType' : '#searchType',
	'#mobileAdvLevel' : '#level',
	'#mobileAdvKeywords' : '#keywords',
	'#mobileAdvSession' : '#session_0, #session',
	'#mobileAdvUnits' : '#units',
	'#mobileAdvStartTime' : '#startTime',
	'#mobileAdvEndTime' : '#endTime',
	'#mobileAdvStartDate' : '#startDate',
	'#mobileAdvEndDate' : '#endDate',
	'#mobileAdvClassNumber' : '#classNbr',
	'#mobileAdvInstructorName' : '#instructorName',
	'#mobileAdvCollege' : '#college'
};

var advancedSearchCheckboxes = {
	'#mobileAdvDayM' : '#dayM',
	'#mobileAdvDayT' : '#dayT',
	'#mobileAdvDayW' : '#dayW',
	'#mobileAdvDayTh' : '#dayTh',
	'#mobileAdvDayF' : '#dayF',
	'#mobileAdvDayS' : '#dayS',
	'#mobileAdvDaySu' : '#daySu',
	'#mobileAdvHonors' : '#honors'
};

var calendarRegex = /(0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])[- /.](19|20)\d\d/;
var anchors = '.classNbrColumnValue a, .subjectNumberColumnValue a, .titleColumnValue a, .hoursColumnValue a, .startDateColumnValue a, .dayListColumnValue a, .startTimeDateColumnValue a, .endTimeDateColumnValue a, .tooltipRqDesDescrColumnValue a, .instructorListColumnValue a, .availableSeatsColumnValue a';
var loadingBar = '<img src="images/searching1.gif">';
var fromTopClassResults = 0;
var fromTopSearch = 0;
var columnFilter = [];

// Javascript code for the subject pop up box
var win=null;
function NewWindow(mypage,myname,w,h,pos,infocus){
	if(pos=='random'){myleft=(screen.width)?Math.floor(Math.random()*(screen.width-w)):100;mytop=(screen.height)?Math.floor(Math.random()*((screen.height-h)-75)):100;}
	if(pos=='center'){myleft=(screen.width)?(screen.width-w)/2:100;mytop=(screen.height)?(screen.height-h)/2:100;}
	else if((pos!='center' && pos!='random') || pos==null){myleft=0;mytop=20}
	settings='width=' + w + ',height=' + h + ',top=' + mytop + ',left=' + myleft + ',scrollbars=yes,location=no,directories=no,status=no,menubar=no,toolbar=no,resizable=yes';win=window.open(mypage,myname,settings);
	win.focus();
}

function setSubject(subjectCode) {
	$('#subjectEntryMobile').val(subjectCode);
	$('#subjectEntry').val(subjectCode);
	
	if($('#mobileSubjects').hasClass('nodisplay'))
		$('#mobileSubjects').removeClass('nodisplay');
	else
		$('#mobileSubjects').addClass('nodisplay');
	
	if($('#mobileSearch').hasClass('nodisplay'))
		$('#mobileSearch').removeClass('nodisplay');
	else
		$('#mobileSearch').addClass('nodisplay');
}

function switchToClassView(){
	fromTopClassResults = parseInt($('body').scrollTop());
	$('#mobile-load-material').removeClass('nodisplay');
	$('#mobileClassResults, #mainContent').addClass('nodisplay');
	return false;
}

function scrollToLetter(letter){
	$('html, body').animate({scrollTop: $('#letter_'+ letter).offset().top }, 2000);
	return false;
}

function switchToClassResults(){
	$('#mobile-load-material').addClass('nodisplay');
	$('#mobileClassResults, #mainContent').removeClass('nodisplay');
	$('html, body').animate({ scrollTop: fromTopClassResults }, 0);
	return false;
}

function bindOnMobileClickEvents(){
	$('.mobile-reserved-seat-information').on('click', function(){
		if($(this).hasClass('expand'))
			$('.mobile-reserved-seat-information, .mobile-reserved-seat-information-notice, .mobile-reserved-seat-information-table').removeClass('expand');
		else
			$('.mobile-reserved-seat-information, .mobile-reserved-seat-information-notice, .mobile-reserved-seat-information-table').addClass('expand');
	});
	
	$('.books-more-information').on('click', function(){
		var booksUrl = $(this).siblings('.booksUrl').val();
		$(this).addClass('nodisplay');
		$(this).siblings('.books-loading').removeClass('nodisplay');
		$.ajax({ 
			url: booksUrl, 
			success: function(msg) {
				$('#mobile-books-load-material > div').html(msg);
				$('#mobile-books-load-material > div').prepend('<div class="close-books-content">&times;</div>');
				$('#mobile-books-load-material').removeClass('nodisplay');
				$('.close-books-content').on('click', function(){$('#mobile-books-load-material').addClass('nodisplay');});
				$('#mobile-load-material .books-more-information').removeClass('nodisplay');
				$('#mobile-load-material .books-loading').addClass('nodisplay');
				$('html, body').animate({scrollTop: 0}, 800);
			} 
		});
	});
}

function resetColumnFilterCookie(){
	columnFilter = [];
	
	for (var columnName in columnNames) {
	    if (columnNames.hasOwnProperty(columnName)) {
	    	if($(columnName).prop('checked')){
	    		columnFilter.push(columnName);
	    	}
	    }
	}
	
	$.cookie('columnFilter', columnFilter.join(','), {expires:1});
}

function checkMobileAdvSearch(){
	if($('#mobileAdvClassNumber').val()!='' 
		|| $('#mobileAdvKeywords').val()!='' 
		|| $('#advCampusMobile option:selected').text() != '' 
		||$('#mobileAdvSession option:selected').text() != '' 
		||$('#mobileAdvUnits option:selected').text() != '' 
		||$('#mobileAdvDayM').is(':checked')
		||$('#mobileAdvDayT').is(':checked')
		||$('#mobileAdvDayW').is(':checked')
		||$('#mobileAdvDayTh').is(':checked')
		||$('#mobileAdvDayF').is(':checked')
		||$('#mobileAdvDayS').is(':checked')
		||$('#mobileAdvDaySu').is(':checked')
		||$('#mobileAdvStartTime').val()!=''
		||$('#mobileAdvEndTime').val()!=''
		||$('#mobileStartDate').val()!=''	
		||$('#mobileEndDate').val()!=''
		||$('#mobileAdvInstructorName').val()!=''
		||$('#mobileAdvCollege option:selected').text() != 'College or School' 
		||$('#mobileAdvHonors').is(':checked')
		)
		return true;
}


function checkSideAdvSearch(){
	if($('#classNbr').val()!='' 	
		||$('#units option:selected').text() != '' 
		||$('#dayM').is(':checked')
		||$('#dayT').is(':checked')
		||$('#dayW').is(':checked')
		||$('#dayTh').is(':checked')
		||$('#dayF').is(':checked')
		||$('#dayS').is(':checked')
		||$('#daySu').is(':checked')
		||$('#startTime').val()!=''
		||$('#endTime').val()!=''
		||$('#startDate').val()!=''	
		||$('#endDate').val()!=''
		||$('#instructorName').val()!=''
		||$('#college option:selected').text() != 'College or School' 
		||$('#honors').is(':checked')
		)
		return true;
}



$(document).ready(function() {
	$(anchors).addClass('mobile-disable');
	
	//Hide course option for search
	$('#mobileSearchType select > option[value="course"]').remove();
	$('#classes-slider select > option[value="course"]').remove();
	
	onload = function(){
		$('#subjectEntryMobile').val($('#subjectEntry').val().toUpperCase());
		$('#mobileAdvSubjectEntry').val($('#subjectEntry').val().toUpperCase());
		$('#catalogNbrMobile').val($('#catalogNbr').val());
		$('#mobileAdvCatalogNbr').val($('#catalogNbr').val());
		if($('#campus option:selected').text() != ''){
			$('#campusMobile').val($('#campus').val());
			$('#advCampusMobile').val($('#campus').val());
		}
		
		if($('#campusMobile option:selected').text() == '')
			$('#campusMobile').siblings('.fieldname').addClass('placeholder');
		else
			$('#campusMobile').siblings('.fieldname').removeClass('placeholder');
		
		if($('#advCampusMobile option:selected').text() == '')
			$('#advCampusMobile').siblings('.fieldname').addClass('placeholder');
		else
			$('#advCampusMobile').siblings('.fieldname').removeClass('placeholder');
	}
	
	if(window.location.pathname.toLowerCase().indexOf('scheduler') > 0){
		$('.tabs .home').removeClass('active');
		$('.tabs .scheduler').addClass('active');
	}
	
	if($('body').innerWidth() <= 780){
		//Hack to get things working
		$('#asu_mobile_button').addClass('asushow');
		$('#asu_mobile_button').removeClass('asuhide');
		
		var columnFilterStr = $.cookie('columnFilter');
		if(columnFilterStr == undefined || columnFilterStr == null)
			columnFilterStr = '';
		
		//Onload Event Check Toggles
		for (var columnName in columnNames) {
		    if (columnNames.hasOwnProperty(columnName)) {
		    	if((columnFilterStr == '' && $(columnName).prop('checked')) || columnFilterStr.indexOf(columnName) > -1){
					$(columnNames[columnName]).css({ display: 'table-cell' });
					$(columnName).prop('checked', true);
		    	} else {
					$(columnNames[columnName]).css({ display: 'none' });
					$(columnName).prop('checked', false);
		    	}
		    }
		}
		
		$('.mobile-disable').on('click', function(event){event.preventDefault();});
		$('.mobile-disable').attr('style','color: #666 !important; border:none !important;');
	}
	
	if(checkSideAdvSearch()==true){
		$('#advanced').val('Y');
		$('#adv-search').slideDown('slow');
	}
	
	$(window).on('pagehide', function(){
		$('#mobilePleaseWaitDiv').html('<div style="height: 25px"><input type="submit" id="Go" tabindex="26" class="mobile-display" value="search"/></div>');
		$('#pleaseWaitDiv').html('<input id="search" type="image" src="images/search_off.gif" onmouseover="this.src=\'images/search_on.gif\'" onmouseout="this.src=\'images/search_off.gif\'" border="0" tabindex="4"> <img src="images/searching1.gif" class="no-display" style="margin-top: 10px; margin-left: 7px;">');
		$('#mobileAdvancedSearchPleaseWait').addClass('nodisplay');
		$('#mobileAdvancedSearchSubmit').removeClass('nodisplay');
	});
	
	if($.cookie('onlineCampusSelection') == 'C'){
		$('input[name="typeSelectionCampus"]').prop('checked', true);
		$('input[name="typeSelectionOnline"]').prop('checked', false);
		$('select#offering').prop('selectedIndex', 0);
		$('#campus-slider option:first-child, #mobileCampusOnline option:first-child').prop('selected', true);
		$('#campusMobile, #advCampusMobile').html('');
		changeLocationDropDown($('#campusMobile, #advCampusMobile'),'CAMPUS');
		showHideLocationDropDown('CAMPUS');
	} else if($.cookie('onlineCampusSelection') == 'O'){
		$('input[name="typeSelectionOnline"]').prop('checked', true);
		$('input[name="typeSelectionCampus"]').prop('checked', false);
		$('select#offering').prop('selectedIndex', 1);
		$('#campus-slider option:nth-child(2), #mobileCampusOnline option:nth-child(2)').prop('selected', true);
		$('#campusMobile, #advCampusMobile').html('');
		changeLocationDropDown($('#campusMobile, #advCampusMobile'),'CLASS_ONLINE');
		showHideLocationDropDown('CLASS_ONLINE');
	}
	
	//Initialize Select Boxes
	for(var i = 0; i < dropdowns.length; i++){
		if($(dropdowns[i] + ' select').val() == '')
			$(dropdowns[i] + ' .fieldname').addClass('placeholder');
		
		if($(dropdowns[i] + ' select option:selected').text() != '')
			$(dropdowns[i] + ' .fieldname').removeClass('placeholder');
	}
	
	
	
	$('#classTermMobile select').on('change', function (){
		window.location.href = '?t=' + $(this).val();
	});
	
	$('.mobile-dropdown select').on('change', function(){
		if($(this).val() == '')
			$(this).siblings('.fieldname').addClass('placeholder');
		else
			$(this).siblings('.fieldname').removeClass('placeholder');
		
		if($(this).find('option:selected').text() != '')
			$(this).siblings('.fieldname').removeClass('placeholder');
	});
	
	if($('#mobileGenStudies select').val() == ''){
		$('#mobileGenStudiesAnd1, #mobileGenStudiesAnd2').hide();
	} else {
		$('#mobileGenStudiesAnd1').show();
		
		if($('#mobileGenStudiesAnd1 select').val() == '')
			$('#mobileGenStudiesAnd2').hide();
		else
			$('#mobileGenStudiesAnd2').show();
	}
	
	//Initialize Sliders
	$('#classes-slider select, #campus-slider select').slider();
	$('#campus-slider select').on( 'slidestop', function( event, ui ) {
		if($('#campus-slider select').val() == 'campus'){
			$('input[name="typeSelectionCampus"]').prop('checked', true);
			$('input[name="typeSelectionOnline"]').prop('checked', false);
			$('#mobileCampusOnline select').val('campus');
			$('select#offering').prop('selectedIndex', 0);
			$.cookie('onlineCampusSelection', 'C', { expires: 365 } );
			$('#campus, #advCampus, #campusMobile, #advCampusMobile').html('');
			changeLocationDropDown($('#campus, #advCampus, #campusMobile, #advCampusMobile'),'CAMPUS');
			showHideLocationDropDown('CLASS_CAMPUS');
		} else{
			$('input[name="typeSelectionOnline"]').prop('checked', true);
			$('input[name="typeSelectionCampus"]').prop('checked', false);
			$('#mobileCampusOnline select').val('online');
			$('select#offering').prop('selectedIndex', 1);
			$.cookie('onlineCampusSelection', 'O', { expires: 365 } );
			$('#campus, #advCampus, #campusMobile, #advCampusMobile').html('');
			changeLocationDropDown($('#campus, #advCampus, #campusMobile, #advCampusMobile'),'CLASS_ONLINE');
			showHideLocationDropDown('CLASS_ONLINE');
		}
	} );
	
	$('#mobileCampusOnline select').off('change');
	$('#mobileCampusOnline select').on('change', function( event, ui ) {
		if($('#mobileCampusOnline select').val() == 'C'){
			$('input[name="typeSelectionCampus"]').prop('checked', true);
			$('input[name="typeSelectionOnline"]').prop('checked', false);
			$('#campus-slider select').val('campus');
			$('#campus-slider select').slider('refresh');
			$('select#offering').prop('selectedIndex', 0);
			$.cookie('onlineCampusSelection', 'C', { expires: 365 } );
			$('#campus, #advCampus, #campusMobile, #advCampusMobile').html('');
			changeLocationDropDown($('#campus, #advCampus, #campusMobile, #advCampusMobile'),'CAMPUS');
			showHideLocationDropDown('CLASS_CAMPUS');
		} else{
			$('input[name="typeSelectionOnline"]').prop('checked', true);
			$('input[name="typeSelectionCampus"]').prop('checked', false);
			$('#campus-slider select').val('online');
			$('#campus-slider select').slider('refresh');
			$('select#offering').prop('selectedIndex', 1);
			$.cookie('onlineCampusSelection', 'O', { expires: 365 } );
			$('#campus, #advCampus, #campusMobile, #advCampusMobile').html('');
			changeLocationDropDown($('#campus, #advCampus, #campusMobile, #advCampusMobile'),'CLASS_ONLINE');
			showHideLocationDropDown('CLASS_ONLINE');
		}
		
		$(this).blur();
	} );
	
	$('#mobileSearchType select').off('change');
	$('#mobileSearchType select').on('change', function() {
		if($('#mobileSearchType select').val() == 'open'){
			$('#classes-slider select, #mobileAdvSearchType, #searchType').val('open');
		} else {
			$('#classes-slider select, #mobileAdvSearchType, #searchType').val('all');
		}
		$('#classes-slider select').slider('refresh');
		$(this).blur();
	});
	
	$('#mobileAdvSearchType').off('change');
	$('#mobileAdvSearchType').on('change', function() {
		if($('#mobileAdvSearchType').val() == 'open'){
			$('#classes-slider select, #mobileSearchType select').val('open');
		} else {
			$('#classes-slider select, #mobileSearchType select').val('all');
		}
		$('#classes-slider select').slider('refresh');
		$(this).blur();
	});
	
	$('#searchType').on('change', function() {
		if($('#searchType').val() == 'open'){
			$('#classes-slider select, #mobileAdvSearchType, #mobileSearchType select').val('open');
		} else if($('#searchType').val() == 'all') {
			$('#classes-slider select, #mobileAdvSearchType, #mobileSearchType select').val('all');
		}
		$('#classes-slider select').slider('refresh');
		$(this).blur();
	});
	
	
	$('#classes-slider select').on('slidestop', function() {
		if($('#classes-slider select').val() == 'open'){
			$('#mobileSearchType select, #mobileAdvSearchType, #searchType').val('open');
		} else {
			$('#mobileSearchType select, #mobileAdvSearchType, #searchType').val('all');
		}
	});
	
	
	$('#subjectMobile .browse').on('click', function(){
		if($('#mobileSubjects').html().length == 0){
			$('#mobileSubjects').load('./MobileSubjects.html', function(){
				$('#mobileAdvancedSearchHandler2').on('click', function(){
					if(!$(this).hasClass('disabled')){
						if(!$(this).hasClass('expand')){
							$(this).addClass('expand');
							fromTopSearch = parseInt($('body').scrollTop());
							$('#mobileAdvancedSearchMenu').removeClass('nodisplay');
							$('#mobile-load-material, #mobileClassResults, #mainContent, #mobileSearchBoxContainer').addClass('nodisplay');
							
							if($('#mobileSubjects').hasClass('nodisplay'))
								$('#mobileSubjects').removeClass('nodisplay');
							else
								$('#mobileSubjects').addClass('nodisplay');
							
							if($('#mobileSearch').hasClass('nodisplay'))
								$('#mobileSearch').removeClass('nodisplay');
							else
								$('#mobileSearch').addClass('nodisplay');
						} else {
							$(this).removeClass('expand');
							$('html, body').animate({ scrollTop: fromTopSearch }, 0);
							$('#mobileAdvancedSearchMenu').addClass('nodisplay');
							$('#mobile-load-material').addClass('nodisplay');
							$('#mobileClassResults, #mainContent, #mobileSearchBoxContainer').removeClass('nodisplay');

							if($('#mobileSubjects').hasClass('nodisplay'))
								$('#mobileSubjects').removeClass('nodisplay');
							else
								$('#mobileSubjects').addClass('nodisplay');
							
							if($('#mobileSearch').hasClass('nodisplay'))
								$('#mobileSearch').removeClass('nodisplay');
							else
								$('#mobileSearch').addClass('nodisplay');
						}
					}
				});	
			});	
		}
			
		$('#mobileSubjects').removeClass('nodisplay');
		$('#mobileSearch').addClass('nodisplay');
	});
	
	$('.applyMobileColumnValue').on('click tap', function(e){
		var classId = '#' + $(this).find('input[type="hidden"].classId').val();
		var classUrl = './' + $(this).find('input[type="hidden"].classUrl').val();
		
		if($(this).parent().hasClass('grpOdd'))
			$(classId).parent().parent().addClass('grpOdd');
		else
			$(classId).parent().parent().addClass('grpEven');
		
		if($(this).hasClass('expand')){
			$(this).removeClass('expand');
			$(classId).parent().parent().removeClass('expand');
		} else {
			$(this).addClass('expand');
			
			$(classId).parent().parent().addClass('expand');
			
			if($(classId).html().trim().length == 0 || $(classId).html().indexOf('searching1.gif') > -1){
				$.ajax({ async: true, url: classUrl, 
					success: function(msg) { 
						$(classId).html(msg);
						$('#mobile-load-material').html(msg);
						bindOnMobileClickEvents();
					} 
				});
			} else {
				$('#mobile-load-material').html($(classId).html());
				bindOnMobileClickEvents();
			}
		}
	});
	
	$('#mobileAdvancedSearchHandler').on('click tap', function(){
		if(!$(this).hasClass('disabled')){
			if(!$(this).hasClass('expand')){
				$(this).addClass('expand');
				
				fromTopSearch = parseInt($('body').scrollTop());
				$('#mobileAdvancedSearchMenu').removeClass('nodisplay');
				$('#mobile-load-material, #mobileClassResults, #mainContent, #mobileSearchBoxContainer').addClass('nodisplay');
				
				
				if(checkMobileAdvSearch()==true){
					
					$('.mobileAdvancedSearch').removeClass('nodisplay');
					$('#mobileSearchToggle .advancedSearch').addClass('nodisplay');
					$('#mobileSearchToggle .basicSearch').removeClass('nodisplay');
				}
					
			} else {
				$(this).removeClass('expand');
				$('html, body').animate({ scrollTop: fromTopSearch }, 0);
				$('#mobileAdvancedSearchMenu').addClass('nodisplay');
				$('#mobile-load-material, #mobileClassResults, #mainContent, #mobileSearchBoxContainer').removeClass('nodisplay');
				$('#mobileSubjects').addClass('nodisplay');
			}
		}
	});	
	
	$('#toggle-classNbrColumn').on('change', function() {
		if($(this).prop('checked'))
			$('.classNbrColumnHeader, .classNbrColumnValue').css({ display: 'table-cell' });
		else
			$('.classNbrColumnHeader, .classNbrColumnValue').css({ display: 'none' });
		resetColumnFilterCookie();
	});

	$('#toggle-subjectNumberColumn').on('change', function() {
		$(this).prop('checked', true); return false;
	});

	$('#toggle-locationBuildingColumn').on('change', function() {
		if($(this).prop('checked'))
			$('.locationBuildingColumnHeader, .locationBuildingColumnValue').css({ display: 'table-cell' });
		else
			$('.locationBuildingColumnHeader, .locationBuildingColumnValue').css({ display: 'none' });
		resetColumnFilterCookie();
	});
	
	$('#toggle-gsColumn').on('change', function() {
		if($(this).prop('checked'))
			$('.tooltipRqDesDescrColumnHeader, .tooltipRqDesDescrColumnValue').css({ display: 'table-cell' });
		else
			$('.tooltipRqDesDescrColumnHeader, .tooltipRqDesDescrColumnValue').css({ display: 'none' });
		resetColumnFilterCookie();
	});
	
	$('#toggle-instructorListColumn').on('change', function() {
		if($(this).prop('checked'))
			$('.instructorListColumnHeader, .instructorListColumnValue').css({ display: 'table-cell' });
		else
			$('.instructorListColumnHeader, .instructorListColumnValue').css({ display: 'none' });
		resetColumnFilterCookie();
	});
	
	$('#toggle-titleColumn').on('change', function() {
		if($(this).prop('checked'))
			$('.titleColumnHeader, .titleColumnValue').css({ display: 'table-cell' });
		else
			$('.titleColumnHeader, .titleColumnValue').css({ display: 'none' });
		resetColumnFilterCookie();
	});

	$('#toggle-hoursColumn').on('change', function() {
		if($(this).prop('checked'))
			$('.hoursColumnHeader, .hoursColumnValue').css({ display: 'table-cell' });
		else
			$('.hoursColumnHeader, .hoursColumnValue').css({ display: 'none' });
		resetColumnFilterCookie();
	});

	$('#toggle-startDateColumn').on('change', function() {
		if($(this).prop('checked'))
			$('.startDateColumnHeader, .startDateColumnValue').css({ display: 'table-cell' });
		else
			$('.startDateColumnHeader, .startDateColumnValue').css({ display: 'none' });
		resetColumnFilterCookie();
	});

	$('#toggle-dayListColumn').on('change', function() {
		if($(this).prop('checked'))
			$('.dayListColumnHeader, .dayListColumnValue').css({ display: 'table-cell' });
		else
			$('.dayListColumnHeader, .dayListColumnValue').css({ display: 'none' });
		resetColumnFilterCookie();
	});

	$('#toggle-startTimeDateColumn').on('change', function() {
		if($(this).prop('checked'))
			$('.startTimeDateColumnHeader, .startTimeDateColumnValue').css({ display: 'table-cell' });
		else
			$('.startTimeDateColumnHeader, .startTimeDateColumnValue').css({ display: 'none' });
		resetColumnFilterCookie();
	});

	$('#toggle-endTimeDateColumn').on('change', function() {
		if($(this).prop('checked'))
			$('.endTimeDateColumnHeader, .endTimeDateColumnValue').css({ display: 'table-cell' });
		else
			$('.endTimeDateColumnHeader, .endTimeDateColumnValue').css({ display: 'none' });
	});
	
	$('#toggle-availableSeatsColumn').on('change', function() {
		if($(this).prop('checked'))
			$('.availableSeatsColumnHeader, .availableSeatsColumnValue').css({ display: 'table-cell' });
		else
			$('.availableSeatsColumnHeader, .availableSeatsColumnValue').css({ display: 'none' });
		resetColumnFilterCookie();
	});
	
	$('#mobileSearchToggle').on('click', function(){
		if($('#mobileSearchToggle .basicSearch').hasClass('nodisplay')){
			$('#mobileSearchToggle .advancedSearch').addClass('nodisplay');
			$('#mobileSearchToggle .basicSearch').removeClass('nodisplay');
			$('.mobileAdvancedSearch').removeClass('nodisplay');
		} else {
			$('#mobileSearchToggle .advancedSearch').removeClass('nodisplay');
			$('#mobileSearchToggle .basicSearch').addClass('nodisplay');
			$('.mobileAdvancedSearch').addClass('nodisplay');
		}
	});
	
	$('#mobileAdvancedSearchSubmit').on('click', function(){
		$.cookie('columnFilter', null, {expires:1});
		$('#mobileAdvancedSearchForm').submit();
		$('#mobileAdvancedSearchPleaseWait').removeClass('nodisplay');
		$('#mobileAdvancedSearchSubmit').addClass('nodisplay');
	});
	
	/*
	 * Just in case of screen resize.
	 */
	$(window).on('resize orientationchange',function(){
		if($('body').innerWidth() > 780){
			$('#mobileSubjects, #mobileAdvancedSearchMenu').addClass('nodisplay');
			$('#mobileAdvancedSearchHandler, #mobileAdvancedSearchHandler2').removeClass('expand');
			$('#mobileSearchBoxContainer, #mobileSearch').removeClass('nodisplay');
			switchToClassResults();
			
			$('.mobile-disable').off('click');
			$('.mobile-disable').removeAttr('style');
			
			for (var columnName in columnNames)
			    if (columnNames.hasOwnProperty(columnName)) 
					$(columnNames[columnName]).css({ display: 'table-cell' });
			
			if(isBrowserTablet) {
				$('#subjectEntry').val($('#subjectEntryMobile').val().toUpperCase());
				$('#advSubjectEntry').val($('#subjectEntryMobile').val().toUpperCase());
				$('#catalogNbr').val($('#catalogNbrMobile').val());
				$('#advCatalogNbr').val($('#catalogNbrMobile').val());
				
				for (var field in advancedSearchFields) {
				    if (advancedSearchFields.hasOwnProperty(field)) {
				    	$(advancedSearchFields[field]).val($(field).val());
				    }
				}
				
				for (var checkbox in advancedSearchCheckboxes) {
				    if (advancedSearchCheckboxes.hasOwnProperty(checkbox)) {
				    	$(advancedSearchCheckboxes[checkbox]).prop('checked', $(checkbox).prop('checked'));
				    }
				}
				
				$('#campus').val($('#campusMobile').val());
				$('#advCampus').val($('#campusMobile').val());
				
				if($('#campusMobile option:selected').text() != '' && $('#campusMobile option:selected').val() == '' ){
					$('#campus option:last-child, #advCampus option:last-child').prop('selected', true);
				} else if($('#campusMobile option:selected').text() == '' && $('#campusMobile option:selected').val() == ''){
					$('#campus option:first-child, #advCampus option:first-child').prop('selected', true);
				}
				
				$('#subjectEntry').focus();
			}
			
		} else {
			//Hack to get things working
			$('#asu_mobile_button').addClass('asushow');
			$('#asu_mobile_button').removeClass('asuhide');
			
			$('.mobile-disable').on('click', function(event){event.preventDefault();});
			$('.mobile-disable').attr('style','color: #666 !important; border:none !important;');
			
			for (var columnName in columnNames) {
			    if (columnNames.hasOwnProperty(columnName)) {
			    	if($(columnName).prop('checked'))
						$(columnNames[columnName]).css({ display: 'table-cell' });
					else
						$(columnNames[columnName]).css({ display: 'none' });
			    }
			}
			
			//Copy Data Over only when dealing with tablet screens
			if(isBrowserTablet) {
				$('#subjectEntryMobile').val($('#subjectEntry').val().toUpperCase());
				$('#mobileAdvSubjectEntry').val($('#subjectEntry').val().toUpperCase());
				$('#catalogNbrMobile, #mobileCatalogNumber input').val($('#catalogNbr').val());
				
				for (var field in advancedSearchFields) {
				    if (advancedSearchFields.hasOwnProperty(field)) {
				    	$(field).val($(advancedSearchFields[field]).val());
				    	
				    	if((field == '#mobileAdvStartDate' || field == '#mobileAdvEndDate') && !calendarRegex.test($(field).val())) {
				    		$(field).val('');
				    	}
				    }
				}
				
				for (var checkbox in advancedSearchCheckboxes) {
				    if (advancedSearchCheckboxes.hasOwnProperty(checkbox)) {
				    	$(checkbox).prop('checked', $(advancedSearchCheckboxes[checkbox]).prop('checked'));
				    }
				}
				
				$('.mobile-dropdown select').each(function(){
					if($(this).val() == '')
						$(this).siblings('.fieldname').addClass('placeholder');
					else
						$(this).siblings('.fieldname').removeClass('placeholder');
					
					if($(this).find('option:selected').text() != '')
						$(this).siblings('.fieldname').removeClass('placeholder');
				});
				
				$('#campusMobile, #advCampusMobile').val($('#campus').val());
				
				if($('#campus option:selected').text() != '' && $('#campus option:selected').val() == '' ){
					$('#campusMobile option:last-child, #advCampusMobile option:last-child').prop('selected', true);
				} else if($('#campus option:selected').text() == '' && $('#campus option:selected').val() == ''){
					$('#campusMobile option:first-child, #advCampusMobile option:first-child').prop('selected', true);
				}
				
				if($('#campusMobile option:selected').text() == '')
					$('#campusMobile').siblings('.fieldname').addClass('placeholder');
				else
					$('#campusMobile').siblings('.fieldname').removeClass('placeholder');
				
				if($('#advCampusMobile option:selected').text() == '')
					$('#advCampusMobile').siblings('.fieldname').addClass('placeholder');
				else
					$('#advCampusMobile').siblings('.fieldname').removeClass('placeholder');
				
				$('#subjectEntryMobile').focus();
			}
		}
	});
	
	$('#subjectEntryMobile').on('change blur paste keyup', function() {
		$('#subjectEntry').val($(this).val().toUpperCase());
		$('#advSubjectEntry').val($(this).val().toUpperCase());
		$('#mobileAdvSubjectEntry').val($(this).val().toUpperCase());
	});
	
	$('#subjectEntry').on('change blur paste keyup', function() {
		$('#subjectEntryMobile').val($(this).val().toUpperCase());
		$('#mobileAdvSubjectEntry').val($(this).val().toUpperCase());
	});
	
	$('#mobileAdvSubjectEntry').on('change blur paste keyup', function() {
		$('#advSubjectEntry').val($(this).val().toUpperCase());
		$('#subjectEntryMobile').val($(this).val().toUpperCase());
		$('#subjectEntry').val($(this).val().toUpperCase());
	});
	
	$('#catalogNbrMobile').on('change blur paste keyup', function() {
		$('#catalogNbr, #advCatalogNbr, #mobileAdvCatalogNbr').val($(this).val());
	});
	
	$('#catalogNbr').on('change blur paste keyup', function() {
		$('#catalogNbrMobile, #mobileAdvCatalogNbr').val($(this).val());
	});
	
	$('#mobileAdvCatalogNbr').on('change blur paste keyup', function() {
		$('#catalogNbr, #advCatalogNbr, #catalogNbrMobile').val($(this).val());
	});
	
	$('#campus').on('change', function() {
		$('#campusMobile, #advCampusMobile').val($('#campus').val());
		
		if($('#campus option:selected').text() != '' && $('#campus option:selected').val() == '' ){
			$('#campusMobile option:last-child, #advCampusMobile option:last-child').prop('selected', true);
		} else if($('#campus option:selected').text() == '' && $('#campus option:selected').val() == ''){
			$('#campusMobile option:first-child, #advCampusMobile option:first-child').prop('selected', true);
		}
		
		if($('#campusMobile option:selected').text() == '')
			$('#campusMobile').siblings('.fieldname').addClass('placeholder');
		else
			$('#campusMobile').siblings('.fieldname').removeClass('placeholder');
		
		if($('#advCampusMobile option:selected').text() == '')
			$('#advCampusMobile').siblings('.fieldname').addClass('placeholder');
		else
			$('#advCampusMobile').siblings('.fieldname').removeClass('placeholder');
		
		$(this).blur();
	});
	
	$('#campusMobile').on('change', function() {
		$('#campus, #advCampusMobile, #advCampus').val($('#campusMobile').val());
		
		if($('#campusMobile option:selected').text() != '' && $('#campusMobile option:selected').val() == '' ){
			$('#campus option:last-child, #advCampusMobile option:last-child, #advCampus option:last-child').prop('selected', true);
		} else if($('#campusMobile option:selected').text() == '' && $('#campusMobile option:selected').val() == ''){
			$('#campus option:first-child, #advCampusMobile option:first-child, #advCampus option:first-child').prop('selected', true);
		}
		
		if($('#advCampusMobile option:selected').text() == '')
			$('#advCampusMobile').siblings('.fieldname').addClass('placeholder');
		else
			$('#advCampusMobile').siblings('.fieldname').removeClass('placeholder');
		
		$(this).blur();
	});
	
	$('#advCampusMobile').on('change', function() {
		$('#campus, #advCampus, #campusMobile').val($('#advCampusMobile').val());
	
		if($('#advCampusMobile option:selected').text() != '' && $('#advCampusMobile option:selected').val() == '' ){
			$('#campus option:last-child, #campusMobile option:last-child, #advCampus option:last-child').prop('selected', true);
		} else if($('#advCampusMobile option:selected').text() == '' && $('#advCampusMobile option:selected').val() == ''){
			$('#campus option:first-child, #campusMobile option:first-child, #advCampus option:first-child').prop('selected', true);
		}
		
		if($('#campusMobile option:selected').text() == '')
			$('#campusMobile').siblings('.fieldname').addClass('placeholder');
		else
			$('#campusMobile').siblings('.fieldname').removeClass('placeholder');
		
		$(this).blur();
	});
	
	if($('#hiddenSearchType').val() == 'course'){ 
		$('div#titleClass, div#titleClass1').hide();
		$('div#titleCrse, div#titleCrse1').show();
		changeTermDropdown('C');
		$('#searchType').val('course');
		$('#hiddenSearchType').val('course');
		$('tr.courseRemove').each(function(){
			$(this).hide();
		});
		$('a#classTermListTT, div#OpenClassTxt, label#advLocationLbl, #campus, #advCampus').hide();
		$('a#courseTermListTT, div#CCTxt, #homeCollege').show();
		$('label#locationLbl').html('COLLEGE/SCHOOL');
		$('#campus > option').remove();
		$('#advCampus > option').remove();
		changeLocationDropDown($('#campus, #advCampus, #campusMobile, #advCampusMobile'),'COURSE');
	}

	if($('#searchType').val() == 'course'){
		$('tr.courseRemove').each(function(){
			$(this).hide();
		});
	}
	else{
		if($.cookie('onlineCampusSelection') == 'C')
			showHideLocationDropDown('CLASS_CAMPUS');
		else
			showHideLocationDropDown('CLASS_ONLINE');
	}

	$('.rsrvtip').cluetip({
		width: 550,
		dropShadow: 'true',
		dropShadowSteps: 6,
		cluetipClass: 'default',
		arrows: 'true',
		cursor: 'help',
		positionBy: 'auto',
		attribute: 'rel',
		activation: 'hover',
		closeText: '<img src="images/delete.gif"/>',
		sticky: false, 
		closePosition: 'title', 
		waitImage: false, 
		fx: {openSpeed:  100},
		onActivate: function() {return !isBrowserMobile;}
	});

	$('.suntip').cluetip({
		width: 150,
		showTitle: false,
		dropShadow: 'true',
		dropShadowSteps: 6,
		cluetipClass: 'default',
		arrows: 'true',
		cursor: 'help',
		positionBy: 'auto',
		attribute: 'rel',
		activation: 'hover',
		closeText: '<img src="images/delete.gif"/>',
		sticky: false, 
		closePosition: 'title', 
		waitImage:        false, 
		fx: {openSpeed:  100},
		onActivate: function() {return !isBrowserMobile;}
	});

	$('.icontip').cluetip({
		width: 280,
		local: true,
		arrows: 'true',
		cluetipClass: 'default',
		positionBy: 'mouse',
		attribute: 'rel',
		activation: 'hover',
		closeText: '<img src="images/delete.gif"/>',
		sticky: false, 
		closePosition: 'title', 
		titleAttribute: 'title',
		fx: {openSpeed:  0},
		onActivate: function() {return !isBrowserMobile;}
	});

	$('.classDetailstip').cluetip({
		width: 230,
		dropShadow: 'true',
		dropShadowSteps: 6,
		cluetipClass: 'default',
		positionBy: 'mouse',
		arrows: 'true',
		cursor: 'help',
		attribute: 'rel',
		activation: 'hover',
		sticky: true, 
		closePosition: 'title',   
		waitImage:        false, 
		fx: {openSpeed:  1000},
		onActivate: function() {return !isBrowserMobile;}
	});

	$('.deadlinetip').cluetip({
		width: 290,
		dropShadow: 'true',
		dropShadowSteps: 6,
		cluetipClass: 'default',
		positionBy: 'mouse',
		arrows: 'true',
		cursor: 'help',
		attribute: 'rel',
		activation: 'hover',
		sticky: false, 
		closePosition: 'title',   
		waitImage:        false, 
		fx: {openSpeed:  1000},
		onActivate: function() {return !isBrowserMobile;}
	});

	$('.datetip').cluetip({
		splitTitle: '|',  // use the invoking element's title attribute to populate the clueTip...
		// ...and split the contents into separate divs where there is a "|"
		//showTitle: false, // hide the clueTip's heading
		attribute: 'rel',
		width: 270,
		cluetipClass: 'default',
		positionBy: 'topBottom',
		arrows: 'true',
		activation:'click',
		closeText: '<img src="images/delete.gif"/>',
		sticky: 'true', 
		closePosition: 'title', 
		waitImage:        false, 
		fx: {openSpeed:  0},
		onActivate: function() {return !isBrowserMobile;}
	});

	$('.tt').cluetip({
		width: 280,
		local: true,
		arrows: 'true',
		cluetipClass: 'default',
		positionBy: 'mouse',
		attribute: 'rel',
		activation: 'click',
		closeText: '<img src="images/delete.gif"/>',
		sticky: 'true', 
		closePosition: 'title', 
		titleAttribute: 'title',
		fx: {openSpeed:  0},
		onActivate: function() {return !isBrowserMobile;}
	});

	$('.add_info_tt').cluetip({
		width: 240,
		local: true,
		showTitle: false,
		arrows: 'true',
		cluetipClass: 'default',
		positionBy: 'mouse',
		attribute: 'rel',
		activation: 'hover',
		closeText: '<img src="images/delete.gif"/>',
		sticky: false,   
		fx: {openSpeed:  0},
		onActivate: function() {return !isBrowserMobile;}
	});


	$('.booktip').cluetip({
		width: '510px',
		dropShadow: 'true',
		dropShadowSteps: 6,
		cluetipClass: 'default',
		arrows: 'true',
		cursor: 'pointer',
		positionBy: 'auto',
		attribute: 'rel',
		activation: 'click',
		closeText: '<img src="images/delete.gif"/>',
		sticky: 'true', 
		closePosition: 'title',    
		waitImage:true, 
		fx: {openSpeed:  100},
		onActivate: function() {return !isBrowserMobile;}
	});

	$('.lateregtip').cluetip({
		width: '820px',
		dropShadow: 'true',
		dropShadowSteps: 6,
		cluetipClass: 'default',
		arrows: 'true',
		cursor: 'pointer',
		positionBy: 'mouse',
		attribute: 'rel',
		activation: 'click',
		closeText: '<img src="images/delete.gif"/>',
		sticky: 'true', 
		closePosition: 'title',    
		waitImage: true, 
		fx: {openSpeed:  100}
	});

	$('.nametip').cluetip({
		splitTitle: '|',
		width: 160,
		local: 'true',
		cluetipClass: 'default',
		positionBy: 'topBottom',
		arrows: 'true',
		fx: {openSpeed:  100},
		onActivate: function() {return !isBrowserMobile;}
	});



	$('.locationtip').cluetip({
		splitTitle: '|', // use the invoking element's title attribute to populate the clueTip...
		// ...and split the contents into separate divs where there is a "|"
		arrows: 'true',
		width: 220,
		local: 'true',
		cluetipClass: 'default',
		positionBy: 'topBottom',				
		titleAttribute: 'title',
		fx: {openSpeed:  100},
		onActivate: function() {return !isBrowserMobile;}
	});

	$('.gstip').cluetip({
		splitTitle: '|', // use the invoking element's title attribute to populate the clueTip...
		// ...and split the contents into separate divs where there is a "|"
		showTitle: false,
		width: 190,
		local: 'true',
		cluetipClass: 'default',
		positionBy: 'topBottom',
		titleAttribute: 'href',
		arrows: 'true',
		fx: {openSpeed:  10},
		onActivate: function() {return !isBrowserMobile;}
	});

	$('.gstip_course').cluetip({
		splitTitle: '|', // use the invoking element's title attribute to populate the clueTip...
		// ...and split the contents into separate divs where there is a "|"
		showTitle: false,
		width: 'auto',
		local: 'true',
		cluetipClass: 'default',
		positionBy: 'fixed',
		arrows: 'true',
		titleAttribute: 'href',
		leftOffset: -190,
		topOffset: 0,
		fx: {openSpeed:  10},
		onActivate: function() {return !isBrowserMobile;}
	});

	$('.comptip').cluetip({
		splitTitle: '|', // use the invoking element's title attribute to populate the clueTip...
		// ...and split the contents into separate divs where there is a "|"
		showTitle: false,
		width: 'auto',
		local: 'true',
		cluetipClass: 'default',
		positionBy: 'topBottom',
		titleAttribute: 'href',
		arrows: 'true',
		fx: {openSpeed:  10},
		onActivate: function() {return !isBrowserMobile;}
	});

	$('.changeTermTip').cluetip({
		width: 225,
		dropShadow: true,
		dropShadowSteps: 6,
		cluetipClass: 'jtip',
		arrows: true,
		cursor: 'pointer',
		attribute: 'rel',
		activation: 'click',
		closeText: '<img src="images/delete.gif"/>',
		sticky: true, 
		closePosition: 'title', 
		local:false,
		positionBy: 'mouse',
		ajaxCache: false,
		fx: {openSpeed:  100}
	});
	
	$('.adv-search-tt').cluetip({
		width: 240,
		local: true,
		showTitle: false,
		arrows: 'true',
		cluetipClass: 'default',
		positionBy: 'topBottom',
		attribute: 'rel',
		activation: 'click',
		closeText: '<img src="images/delete.gif"/>',
		sticky: 'true', 
		closePosition: 'bottom',    
		fx: {openSpeed:  0},
		onActivate: function() {return !isBrowserMobile;}
	});
	
	$('.adv-search-tt-roll').cluetip({
		width: 240,
		cluetipClass: 'default',
		positionBy: 'topBottom',
		attribute: 'rel',
		activation: 'hover',  
		fx: {openSpeed:  0},
		onActivate: function() {return !isBrowserMobile;}
	});
	
	//Career PopUp (not being used yet)
	$('#ex3a').jqm({
		trigger: '#ex3aTrigger',
		overlay: 50, /* 0-100 (int) : 0 is off/transparent, 100 is opaque */
		overlayClass: 'jqmOverlay',
		ajax:'@rel',
		modal:'true'})
		.jqDrag('.jqDrag'); /* make dialog draggable, assign handle to title */


	// Advanced Search Animation (side search)
	var advSearchClick = false;
	$('span#adv-search-link').on('click', function () {

		if ($('div#adv-search').is(':hidden')) {
			$('#advanced').val('Y');
			$('#adv-search').slideDown('slow');
		} else {
			$('#advanced').val('N');
			$('#adv-search').slideUp();
		}
	});

	// Autocomplete of Subject field
	function findValueCallback(event, data, formatted) {
		$('<li>').html( !data ? 'No match!' : 'Selected: ' + formatted).appendTo('#result');
	}		
	function formatItem(row) {
		return row[0] + ' (<strong>id: ' + row[1] + '</strong>)';
	}
	function formatResult(row) {
		return row[0].replace(/(<.+?>)/gi, '');
	}
	$('#subjectEntry').autocomplete(subjects, {
		minChars: 0,
		width: 300,
		matchContains: false,
		autoFill: false,
		selectFirst: false,
		max: 100,
		nextId: 'catalogNbr',
		formatItem: function(row, i, max, term) {
			return row.sub.replace(new RegExp('(' + term + ')', 'gi'), '$1') + '<span style="font-size: 80%;"> - ' + row.descr + '</span>';
		},
		formatResult: function(row) {
			return row.sub;
		}
	});

	//Added a second time for the advanced Search popup
	$('#advSubjectEntry').autocomplete(subjects, {
		minChars: 0,
		width: 300,
		matchContains: false,
		autoFill: false,
		selectFirst: false,
		nextId: 'advCatalogNbr',
		max: 100,
		formatItem: function(row, i, max, term) {
			return row.sub.replace(new RegExp('(' + term + ')', 'gi'), '$1') + '<span style="font-size: 80%;"> - ' + row.descr + '</span>';
		},
		formatResult: function(row) {
			return row.sub;
		}
	});

	$('#subjectEntryMobile, #mobileAdvSubjectEntry').autocomplete(subjects, {
		minChars: 0,
		width: 300,
		matchContains: false,
		autoFill: false,
		selectFirst: false,
		max: 400,
		nextId: 'catalogNbrMobile',
		formatItem: function(row, i, max, term) {
			return row.sub.replace(new RegExp('(' + term + ')', 'gi'), '$1') + '<span style="font-size: 80%;"> - ' + row.descr + '</span>';
		},
		formatResult: function(row) {
			return row.sub;
		}
	});

	//Clear fields
	$('a#clearLink, #mobileClearButton').on('click', function(){
		$('#advancedSearchBox input[type="text"],#SideSearchBox input[type="text"], #mobileAdvancedSearch input[type="text"]').val('');
		$('#advancedSearchBox select, #SideSearchBox select, #mobileAdvancedSearch select').prop('selectedIndex', 0);
		
		$('input#iCourse').prop('checked', false);
		$('input#asuOnline').prop('checked', false);

		for (var checkbox in advancedSearchCheckboxes) {
		    if (advancedSearchCheckboxes.hasOwnProperty(checkbox)) {
		    	$(checkbox).prop('checked', false);
		    	$(advancedSearchCheckboxes[checkbox]).prop('checked', false);
		    }
		}
		
		if($.cookie('onlineCampusSelection') == 'C'){
			$('select#offering').prop('selectedIndex', 0);
			$('#mobileCampusOnline option:first-child').prop('selected', true);
		} else if($.cookie('onlineCampusSelection') == 'O'){
			$('select#offering').prop('selectedIndex', 1);
			$('#mobileCampusOnline option:nth-child(2)').prop('selected', true);
		}
		
		$('#gsAw, #gsAwLabel, #addGsAw, #addGsAwLabel, #mobileGenStudiesAnd1, #mobileGenStudiesAnd2').hide();
		
		$('input#startDate').blur();
		$('input#endDate').blur();

		//Reset to class search
		$('#searchType').val('open');
		$('#searchType').change();
		$('div#OpenClassTxt').show();


		var term = $('select#term').val();
		if(parseInt(term.substr(0,4)) >=2121){
			$('select#session_0').removeOption(/./);
			var options = {
					'' : '',
					'A':'Session A',
					'B':'Session B',
					'C':'Session C',
					'TW1':'10 Week - 1st',
					'TW2':'10 Week - 2nd',
					'DYN':'Dynamic Dated'
			}
			$('select#session_0').addOption(options, false); 
			$('select#session_0').prop('selectedIndex', 0);
		}
		else{
			$('select#session_0').removeOption(/./);
			var options = {
					'' : '',
					'TW1':'10 Week - 1st',
					'TW2':'10 Week - 2nd',
					'DYN':'Dynamic Dated',
					'8W1':'8 Week - 1st',
					'8W2':'8 Week - 2nd',
					'5W1':'5 Week - 1st',
					'5W2':'5 Week - 2nd',
					'REG':'Regular',
					'7W1':'7 Week - 1st',
					'7W2':'7 Week - 2nd',
					'WIN':'3 Week - Winter'		
			}
			$('select#session_0').addOption(options, false); 
			$('select#session_0').attr('selectedIndex', 0);            
		}
		
		$('.mobile-dropdown select').each(function(){
			if($(this).val() == '')
				$(this).siblings('.fieldname').addClass('placeholder');
			else
				$(this).siblings('.fieldname').removeClass('placeholder');
			
			if($(this).find('option:selected').text() != '')
				$(this).siblings('.fieldname').removeClass('placeholder');
		});
		
	});

	//term selection events
	$('#term').on('change', function(){
		var term = $(this).val();
		if(parseInt(term.substr(0,4)) >=2121){
			
			$('select#session_0').removeOption(/./);
			var options = {
					'' : '',
					'A':'Session A',
					'B':'Session B',
					'C':'Session C',
					'TW1':'10 Week - 1st',
					'TW2':'10 Week - 2nd',
					'DYN':'Dynamic Dated'
			}
			$('select#session_0').addOption(options, false); 
			$('select#session_0').prop('selectedIndex', 0);
		}
		else{
			$('select#session_0').removeOption(/./);
			var options = {
					'' : '',
					'TW1':'10 Week - 1st',
					'TW2':'10 Week - 2nd',
					'DYN':'Dynamic Dated',
					'8W1':'8 Week - 1st',
					'8W2':'8 Week - 2nd',
					'5W1':'5 Week - 1st',
					'5W2':'5 Week - 2nd',
					'REG':'Regular',
					'7W1':'7 Week - 1st',
					'7W2':'7 Week - 2nd',
					'WIN':'3 Week - Winter'		
			}
			$('select#session_0').addOption(options, false); 
			$('select#session_0').attr('selectedIndex', 0);
		}	
		$(this).blur();
	});

	//General Studies events
	$('.gsEvent').on('change', function(){
		var selectedVal = $(this).val();
		var id = $(this).attr('id');
		if(id == 'gs' || id == 'mobileAdvGenStudies'){
			if(id == 'gs')
				$('#mobileAdvGenStudies').val($('#gs').val());
			else
				$('#gs').val($('#mobileAdvGenStudies').val());
			
			if(!selectedVal){
				$('#gsAw, #gsAwLabel, #addGsAw, #addGsAwLabel, #mobileGenStudiesAnd1, #mobileGenStudiesAnd2').hide();
				$('select#gsAw, #mobileGenStudiesAnd1 select').prop('selectedIndex', 0);
				$('select#gsAw').attr('width', 100);
				$('select#addGsAw, #mobileGenStudiesAnd2 select').prop('selectedIndex', 0);
			}else if(selectedVal != 'C' && selectedVal != 'G' && selectedVal != 'H' ){
				$('#gsAw, #gsAwLabel, #mobileGenStudiesAnd1').show();
				$('select#gsAw').removeOption(/./);
				$('#mobileGenStudiesAnd1 select').removeOption(/./);
				
				var options = {
						'' : '',
						'C' : 'C',
						'G' : 'G',
						'H' : 'H'		
				}
				$('select#gsAw').addOption(options, false);
				$('#mobileGenStudiesAnd1 select').addOption(options, false); 
				$('select#gsAw, #mobileGenStudiesAnd1 select').prop('selectedIndex', 0);
				$('select#addGsAw, #mobileGenStudiesAnd2 select').prop('selectedIndex', 0);
				$('#addGsAw, #addGsAwLabel, #mobileGenStudiesAnd2').hide();

			}else{
				$('#gsAw, #gsAwLabel, #mobileGenStudiesAnd1').show();
				$('#addGsAw, #addGsAwLabel, #mobileGenStudiesAnd2').hide();
				$('select#addGsAw').prop('selectedIndex', 0);
				$('#mobileGenStudiesAnd2 select').prop('selectedIndex', 0);
				$('select#gsAw').removeOption(/./);
				$('#mobileGenStudiesAnd1 select').removeOption(/./);
				
				var options = {
						'' : '',
						'C' : 'C',
						'G' : 'G',
						'H' : 'H'		
				};
				$('select#gsAw').addOption(options, false); 
				$('#mobileGenStudiesAnd1 select').addOption(options, false);
				$('select#gsAw').removeOption(selectedVal);
				$('#mobileGenStudiesAnd1 select').removeOption(selectedVal);
			}	
		}else if(id =='gsAw' || id == 'mobileAdvGenStudiesAdd1'){
			var select;
			
			if(id == 'gsAw'){
				$('#mobileGenStudiesAnd1 select').val($('#gsAw').val());
				select = document.getElementById('gsAw');
			} else {
				$('#gsAw').val($('#mobileGenStudiesAnd1 select').val());
				select = document.getElementById('mobileAdvGenStudiesAdd1');
			}
			if(select.length > 3 && selectedVal){
				$('#addGsAw, #addGsAwLabel, #mobileGenStudiesAnd2').show();
				$('select#addGsAw').removeOption(/./);
				$('#mobileAdvGenStudiesAnd2').removeOption(/./);
				
				var options = {
						'' : '',
						'C' : 'C',
						'G' : 'G',
						'H' : 'H'		
				};
				$('select#addGsAw').addOption(options, false);
				$('#mobileGenStudiesAnd2 select').addOption(options, false);
				$('select#addGsAw').removeOption(selectedVal);
				$('#mobileGenStudiesAnd2 select').removeOption(selectedVal);
			}else{
				$('select#addGsAw').prop('selectedIndex', 0);
				$('#mobileGenStudiesAnd2 select').prop('selectedIndex', 0);
				$('#addGsAw, #addGsAwLabel, #mobileGenStudiesAnd2').hide();
			}
		} else {
			if(id == 'addGsAw'){
				$('#mobileGenStudiesAnd2 select').val($('#addGsAw').val());
			} else {
				$('#addGsAw').val($('#mobileGenStudiesAnd2 select').val());
			}
		}
		$(this).blur();
	});
	//end General Studies events

	$('#clear').on('click', function() {
		$(':input').unautocomplete();
	}); // End Autocomplete

	$('.startDate').datepicker({
		showOn: 'button', 
		buttonImage: 'images/calendar1.png', 
		buttonImageOnly: true,
		duration: 'fast',
		minDate: new Date(2007,0,1),
		showAnim:'slideDown',
		onSelect: function(dateText) {
			var year = dateText.substr(6,4);
			var month = dateText.substr(0,2) -1;
			var day = dateText.substr(3,2);
			$('.endDate').datepicker('destroy');
			$('.endDate').datepicker({
				showOn: 'button', 
				showAnim:'slideDown',
				buttonImage: 'images/calendar1.png', 
				buttonImageOnly: true,
				minDate: new Date(year, month, day),
				duration: 'fast',
				onSelect: function(dateText) {
					$(this).focus();
				}
			});
			$(this).focus();
		},
		beforeShow: function(input) { 
			input.focus();	
		}
	});

	$('.endDate').datepicker({
		showOn: 'button', 
		buttonImage: 'images/calendar1.png', 
		buttonImageOnly: true,
		showAnim:'slideDown',
		duration: 'fast',
		minDate: new Date(2007,0,1),
		onSelect: function(dateText) {
			$(this).focus();
		}
	});

	$('.startDate').hint();
	$('.endDate').hint();

	$('.clock').ptTimeSelect({
		popupImage: "<img src='images/clock.jpg' style='border-bottom: none !important'/> ",
		onFocusDisplay: false 
	});
	
	$('#mobileStartTime input, #mobileEndTime input').ptTimeSelect();
	
	$('#mobileStartDate input').datepicker({ 
		duration: 'fast',
		minDate: new Date(2007,0,1),
		showAnim:'slideDown',
		onSelect: function(dateText) {
			var year = dateText.substr(6,4);
			var month = dateText.substr(0,2) -1;
			var day = dateText.substr(3,2);
			$('#mobileEndDate input').datepicker('destroy');
			$('#mobileEndDate input').datepicker({
				showAnim:'slideDown',
				minDate: new Date(year, month, day),
				duration: 'fast',
				onSelect: function(dateText) {
					$(this).focus();
				}
			});
			$(this).focus();
		},
		beforeShow: function(input) { 
			input.focus();	
		}
	});
	
	$('#mobileEndDate input').datepicker({
		showAnim:'slideDown',
		duration: 'fast',
		minDate: new Date(2007,0,1),
		onSelect: function(dateText) {
			$(this).focus();
		}
	});

	
	//Close advanced search pop up
	$('div#close').on('click', function(){
		$('div#advancedSearchPanel').fadeOut();
		$('input#subjectEntry').focus();
	});


	$('div#class_details_close').on('click', function(){
		var parentClass= $(this).parent().attr('class');
		var result = "<div id='class_details_open'><img src='images/icon_plus_gray.png' class='mobilePlusBtn'/></div>";

		$('.' + parentClass).html(result);
	});

	$('div#class_details_open').on('click', function(){
		var parentId= $(this).parent().attr('id');
		var parentClass= $(this).parent().attr('class');
		var classDetailsUrl = 'MobileClassDetails.ext?sp=' + parentId;

		$.ajax({
			type: 'GET',
			cache:false,
			url: classDetailsUrl,
			success: function(result) {
				result = "<div id='class_details_close'><img src='images/icon_plus_gray.png' class='mobilePlusBtn'/>" + result +"</div>";
				$("." + parentClass).html(result);
			}
		});   
	});

	//Open advanced search pop up
	$('a#advancedSearchOpen').on('click', function(){
		$('div#advancedSearchPanel').fadeIn();
		$('input#advSubjectEntry').focus();
		$('input#advSubjectEntry').val($('input#subjectEntry').val());
		$('input#advCatalogNbr').val($('input#catalogNbr').val());

		$('#advCampus').val($('#campus').val());
		var campus = $('#campus').val();

		if(campus == 'INTERNET')
		{
			$('#checkIcourse, #checkIcourse1, #checkOnline, #checkOnline1').show();
		}
		else
		{
			$('#checkIcourse, #checkIcourse1, #checkOnline, #checkOnline1').hide();
		}
	});

	//Drag effect for advanced search
	$('div#advancedSearchPanel').draggable();
	//Always set focus on subject
	$('input#subjectEntry').focus();

	//Events triggered when changing searchType dropdown 
	$('#searchType').on('change', function(){
		var type = $(this).val();
		$('#cluetip').hide();
		if(type == 'course'){
			$('div#titleClass').hide();
			$('div#titleCrse').show();
			changeTermDropdown('C');
			$('#hiddenSearchType').val('course');
			$('tr.courseRemove').each(function(){
				$(this).hide();
			});
			$('a#classTermListTT, div#OpenClassTxt, label#advLocationLbl, #campus, #advCampus').hide();
			$('a#courseTermListTT').show();
			//	if($.cookie('onlineCampusSelection') == 'O'){
			$('#campus > option').remove();
			$('#advCampus > option').remove();
			changeLocationDropDown($('#campus, #advCampus, #campusMobile, #advCampusMobile'),'COURSE');
		}else{
			$('div#titleCrse').hide();
			$('div#titleClass').show();
			changeTermDropdown('S');
			$('#hiddenSearchType').val('open');
			$('tr.courseRemove').each(function(){
				$(this).show();
			});
			$('a#courseTermListTT').hide();
			$('a#classTermListTT, div#OpenClassTxt, label#advLocationLbl, #campus, #advCampus').show();
			$('label#locationLbl').html('LOCATION');
			$('label#advLocationLbl').html('Location');
			if($.cookie('onlineCampusSelection') == 'O'){
				$('#campus > option').remove();
				$('#advCampus > option').remove();
				changeLocationDropDown($('#campus, #advCampus, #campusMobile, #advCampusMobile'),'CLASS_ONLINE');
				showHideLocationDropDown('CLASS_ONLINE');
			}
			else
			{
				$('#campus > option').remove();
				$('#advCampus > option').remove();
				changeLocationDropDown($('#campus, #advCampus, #campusMobile, #advCampusMobile'),'CAMPUS');
				showHideLocationDropDown('CLASS_CAMPUS');
			}
		}
		
		$(this).blur();
	});

	//Events triggered when Clicking the course/class links
	$('a.changeType').on('click', function(){
		var type = $(this).attr('rel');
		
		$('#cluetip').hide();
		if(type == 'C'){
			$('div#titleClass, div#titleClass1div#titleClass1').hide();
			$('div#titleCrse, div#titleCrse1').show();
			changeTermDropdown('C');
			$('#searchType, #hiddenSearchType').val('course');
			$('tr.courseRemove').each(function(){
				$(this).hide();
			});
			$('a#classTermListTT, div#OpenClassTxt, div#CCTxt, label#advLocationLbl, #campus, #advCampus').hide();
			$('a#courseTermListTT').show();
			$('label#locationLbl').html('CAMPUS');

			$('#campus > option').remove();
			$('#advCampus > option').remove();
			changeLocationDropDown($('#campus, #advCampus, #campusMobile, #advCampusMobile'),'COURSE');
		}else if(type == 'CC'){
			$('div#titleClass, div#titleClass1').hide();
			$('div#titleCrse, div#titleCrse1').show();
			changeTermDropdown('C');
			$('#searchType, #hiddenSearchType').val('course');
			$('tr.courseRemove').each(function(){
				$(this).hide();
			});
			$('a#classTermListTT, div#OpenClassTxt, label#advLocationLbl, #campus, #advCampus').hide();
			$('a#courseTermListTT, div#CCTxt, #homeCollege').show();
			$('label#locationLbl').html('COLLEGE/SCHOOL');
			$('#campus > option').remove();
			$('#advCampus > option').remove();
			changeLocationDropDown($('#campus, #advCampus, #campusMobile, #advCampusMobile'),'COURSE');
		}else{
			$('div#titleCrse, div#titleCrse1').hide();
			$('div#titleClass, div#titleClass1').show();
			
			changeTermDropdown('S');
			$('#searchType, #hiddenSearchType').val('open');
			$('tr.courseRemove').each(function(){
				$(this).show();
			});
			$('a#courseTermListTT, div#CCTxt, #homeCollege').hide();
			$('a#classTermListTT, div#OpenClassTxt, label#advLocationLbl, #campus, #advCampus').show();
			$('label#locationLbl').html('LOCATION');
			$('label#advLocationLbl').html('Location');

			if($.cookie('onlineCampusSelection') == 'O'){
				$('#campus > option').remove();
				$('#advCampus > option').remove();
				changeLocationDropDown($('#campus, #advCampus, #campusMobile, #advCampusMobile'),'CLASS_ONLINE');
				showHideLocationDropDown('CLASS_ONLINE');
			} else {
				$('#campus > option').remove();
				$('#advCampus > option').remove();
				changeLocationDropDown($('#campus, #advCampus, #campusMobile, #advCampusMobile'),'CAMPUS');
				showHideLocationDropDown('CLASS_CAMPUS');
			}
		}
	});


	/*For IE Only */
	if (navigator.appName=='Microsoft Internet Explorer') {
		/*to submit form when pressing enter key (advanced search)*/
		$('#advancedSearchPanelContainer input').keydown(function(e){
			if (e.keyCode == 13) {
				if(checkDateMask() && checkTimeMask()){
					if (document.getElementById('term').value=='archives'){
						alert('You will now be taken to the Course Catalog archive.');
						window.location.href='https://sec.was.asu.edu/coursedb/search/';
						return false
					} 
					$('div#advSearchDiv').hide();
					$(this).parents('form').submit();
					$.cookie('columnFilter', null, {expires:1});
					$('div#advPleaseWaitDiv').html('<img src="images/advSearching1.gif" style="margin-top: 10px; margin-left: 7px;">') ;
				}else{
					return false;
				}
			}

		});

	}

	//Event triggered when submitting the form (activate wait animation and validate date/time fields)
	$('form.submitEvent').on('submit', function(){
		var type = $('#searchType').val();
		if(checkDateMask() && checkTimeMask()){
			if ((type == 'open' && document.getElementById('term').value=='archives') 
					|| (type == 'course' && document.getElementById('termCourse').value=='archives')){
				alert('You will now be taken to the Course Catalog archive.');
				window.location.href='https://sec.was.asu.edu/coursedb/search/';
				return false
			} 
			if($(this).attr('target') != '_blank'){ //Not opening from Iframe
				image = $(this).attr('image');
				div = $(this).attr('div');
				$.cookie('columnFilter', null, {expires:1});
				$('div#'+div).html('<img src="images/'+image+'" style="margin-top: 10px; margin-left: 7px;">') ;
			}
			return true;
		}else{
			return false;
		}
	});


	//TODO Online-campus selection functions
	$('.typeSelection').on('click', function(){
		var selection = $(this).val();
		$.cookie('onlineCampusSelection', selection, { expires: 365 } );
		$('#campus > option').remove();
		$('#advCampus > option').remove();

		if(selection == 'C'){//Campus
			if($('#searchType').val() == 'course'){
				changeLocationDropDown($('#campus, #advCampus, #campusMobile, #advCampusMobile'),'COURSE');
			}else{
				changeLocationDropDown($('#campus, #advCampus, #campusMobile, #advCampusMobile'),'CAMPUS');
				showHideLocationDropDown('CLASS_CAMPUS');
			}
			$('select#offering').prop('selectedIndex', 0);
			$('input[name="typeSelectionCampus"]').prop('checked', true);
			$('input[name="typeSelectionOnline"]').prop('checked', false);
			$('#campus-slider select').val('campus');
			$('#campus-slider select').slider('refresh');

		}else{//Online
			$('select#offering').attr('selectedIndex', 1);
			if($('#searchType').val() == 'course'){
				changeLocationDropDown($('#campus, #advCampus, #campusMobile, #advCampusMobile'),'COURSE');
			}else{
				changeLocationDropDown($('#campus, #advCampus, #campusMobile, #advCampusMobile'),'CLASS_ONLINE');
				showHideLocationDropDown('CLASS_ONLINE');
			}
			$('input[name="typeSelectionOnline"]').prop('checked', true);
			$('input[name="typeSelectionCampus"]').prop('checked', false);
			$('#campus-slider select').val('online');
			$('#campus-slider select').slider('refresh');

		}
		$('.selectionDiv').hide();
		$('.searchDiv').show();
		$('#subjectEntry').focus();
	});

	// selection for offering in sidesearch 
	$('.offeringSelection').on('change', function(){
		var selection = $(this).val();
		$.cookie('onlineCampusSelection', selection, { expires: 365 } );

		if(selection == 'C'){//Campus
			$('#campus > option').remove();
			$('#advCampus > option').remove();
			if($('#searchType').val() == 'course'){
				changeLocationDropDown($('#campus, #advCampus, #campusMobile, #advCampusMobile'),'COURSE');
			}else{
				changeLocationDropDown($('#campus, #advCampus, #campusMobile, #advCampusMobile'),'CAMPUS');
				showHideLocationDropDown('CLASS_CAMPUS');
			}

		}else{//Online
			if($('#searchType').val() == 'course'){
				$('#campus > option').remove();
				$('#advCampus > option').remove();
				changeLocationDropDown($('#campus, #advCampus, #campusMobile, #advCampusMobile'),'COURSE');
			}else{

				$('#campus > option').remove();
				$('#advCampus > option').remove();
				changeLocationDropDown($('#campus, #advCampus, #campusMobile, #advCampusMobile'),'CLASS_ONLINE');
				showHideLocationDropDown('CLASS_ONLINE');
			}


		}
		$('.selectionDiv').fadeOut();
		$('.searchDiv').fadeIn();
		$('#subjectEntry').focus();
	});

	$('.typeSelectionCampus').on('click', function(){
		$('input[name="typeSelectionOnline"]').prop('checked', false);
		var selection = $(this).val();

		$.cookie('onlineCampusSelection', selection, { expires: 365 } );
		$('#campus > option').remove();
		$('#advCampus > option').remove();
		if(selection == 'C'){//Campus
			if($('#searchType').val() == 'course'){
				changeLocationDropDown($('#campus, #advCampus, #campusMobile, #advCampusMobile'),'COURSE');
			}else{
				$('#campusMobile, #advCampusMobile').html('');
				changeLocationDropDown($('#campus, #advCampus, #campusMobile, #advCampusMobile'),'CAMPUS');
				showHideLocationDropDown('CLASS_CAMPUS');

			}
			$('select#offering').prop('selectedIndex', 0);
			$('#campus-slider select').val('campus');
			$('#campus-slider select').slider('refresh');

		}else{//Online
			$('select#offering').prop('selectedIndex', 1);
			if($('#searchType').val() == 'course'){
				changeLocationDropDown($('#campus, #advCampus, #campusMobile, #advCampusMobile'),'COURSE');
			}else{
				$('#campusMobile, #advCampusMobile').html('');
				changeLocationDropDown($('#campus, #advCampus, #campusMobile, #advCampusMobile'),'CLASS_ONLINE');
				showHideLocationDropDown('CLASS_ONLINE');
			}
			$('#campus-slider select').val('online');
			$('#campus-slider select').slider('refresh');
		}
		$('.selectionDiv').fadeOut();
		$('.searchDiv').fadeIn();
		$('#subjectEntry').focus();
	});

	$('.typeSelectionOnline').on('click', function(){
		$('input[name="typeSelectionCampus"]').prop('checked', false);
		var selection = $(this).val();
		$.cookie('onlineCampusSelection', selection, { expires: 365 } );
		$('#campus > option').remove();
		$('#advCampus > option').remove();
		if(selection == 'C'){//Campus
			if($('#searchType').val() == 'course'){
				changeLocationDropDown($('#campus, #advCampus, #campusMobile, #advCampusMobile'),'COURSE');
			}else{
				$('#campusMobile, #advCampusMobile').html('');
				changeLocationDropDown($('#campus, #advCampus, #campusMobile, #advCampusMobile'),'CAMPUS');
				showHideLocationDropDown('CLASS_CAMPUS');
			}
			
			$('select#offering').prop('selectedIndex', 0);
			$('#campus-slider select').val('campus');
			$('#campus-slider select').slider('refresh');
			
		}else{//Online
			$('select#offering').prop('selectedIndex', 1);
			if($('#searchType').val() == 'course'){
				changeLocationDropDown($('#campus, #advCampus, #campusMobile, #advCampusMobile'),'COURSE');
			}else{
				$('#campusMobile, #advCampusMobile').html('');
				changeLocationDropDown($('#campus, #advCampus, #campusMobile, #advCampusMobile'),'CLASS_ONLINE');
				showHideLocationDropDown('CLASS_ONLINE');
			}
			$('#campus-slider select').val('online');
			$('#campus-slider select').slider('refresh');
		}
		$('.selectionDiv').fadeOut();
		$('.searchDiv').fadeIn();
		$('#subjectEntry').focus();
	});


	$('.changeCampusSelection').on('click', function(){
		$.cookie('onlineCampusSelection', null);
		$('.searchDiv').fadeOut();
		$('.selectionDiv').fadeIn();
		$('.typeSelection').prop('checked',false);

	});

	$('.changeCampusSelectionFromSide').on('click', function(){
		$.cookie('onlineCampusSelection', null);
		var term = $('#term').val();
		$(location).attr('href','/catalog/?t='+term);
	});

	$('#asu_mobile_button_catalog').on('click', function() {
		var el = document.getElementById('mobileAdvSearchMenu');
		var el2 = document.getElementById('mobileSearchBoxContainer');

		if( el!=null){
			if(el.className=='nodisplay'){
				el.className='';
			}					
			else{
				el.className='nodisplay';
			}
		}				
		if(el==null && el2!=null && el2.className=='mobile-display mobile-adv-search-menu-off'){
			$('#mobileSearchBoxContainer').attr('class', 'mobile-display mobile-adv-search-menu-on');
			$('#mobile-adv-keywords').attr('class', '');
			$('#mobile-adv-level').attr('class', '');
			$('#mobile-adv-session').attr('class', '');
		}

		else if(el==null && el2!=null && el2.className=='mobile-display mobile-adv-search-menu-on'){
			$('#mobileSearchBoxContainer').attr('class', 'mobile-display mobile-adv-search-menu-off');
			$('#mobile-adv-keywords').attr('class', 'mobile-home-hide');
			$('#mobile-adv-level').attr('class', 'mobile-home-hide');
			$('#mobile-adv-session').attr('class', 'mobile-home-hide');
		}

	});


	$('#mobile-display-table-menu-btn').on('click', function() {
		var carrot = $(this).find( "i").attr('class');
		
		if(carrot=="fa fa-caret-down fa-lg"){
			
			$(this).find( "i").attr('class', 'fa fa-caret-up fa-lg');
		}
		else
			$(this).find( "i").attr('class', 'fa fa-caret-down fa-lg');
		
		var el=document.getElementById('mobile-display-table-menu');
		if(el!=null){
			if(el.className=='mobile-display-table-menu-hidden'){
				el.className='';
			}
				
			else
				el.className='mobile-display-table-menu-hidden';
		}	    	
	});
	
	var usedNames = {};
	$('#campusMobile > option').each(function () {
	    if(usedNames[this.text]) {
	        $(this).remove();
	    } else {
	        usedNames[this.text] = this.value;
	    }
	});
	
	usedNames = {};
	$('#advCampusMobile > option').each(function () {
	    if(usedNames[this.text]) {
	        $(this).remove();
	    } else {
	        usedNames[this.text] = this.value;
	    }
	});
});

function resetSearchButton () {
	if (navigator.appName != 'Microsoft Internet Explorer') {
		if (document.getElementById('searcher'))
			document.getElementById('searcher').style.display = 'none';
	}
}

//function checkAdvanced () {
//	if (document.getElementById('advanced') != null && document.getElementById('advanced').value == 'SY') {
//		document.getElementById('adv-search').style.display = 'block';
//
//		$('.adv-search-tt').cluetip({
//			width: 240,
//			local: true,
//			showTitle: false,
//			arrows: 'true',
//			cluetipClass: 'default',
//			positionBy: 'topBottom',
//			attribute: 'rel',
//			activation: 'click',
//			closeText: '<img src="images/delete.gif"/>',
//			sticky: 'true', 
//			closePosition: 'bottom',    
//			fx: {openSpeed:  0}
//		});
//		$('.adv-search-tt-roll').cluetip({
//			width: 240,
//			local: true,
//			showTitle: false,
//			arrows: 'true',
//			cluetipClass: 'default',
//			positionBy: 'topBottom',
//			attribute: 'rel',
//			activation: 'hover',
//			fx: {openSpeed:  0}
//		});
//	} else {
//		$('#adv-search').hide();
//	}
//}


function changeTermDropdown(type){
	if(type == 'S'){
		$('#courseTerm').hide();
		$('#classTerm').show();
	}else{
		$('#classTerm').hide();
		$('#courseTerm').show();
	}
}


function checkDateMask(){
	var startDate = document.getElementById('startDate');
	var endDate = document.getElementById('endDate');
	if(startDate != null && endDate != null){
		if(startDate.value != ''){
			if (!checkDate(startDate.value, 'Start Date')){
				return false;
			}
		}
		if(endDate.value != ''){
			if(!checkDate(endDate.value, 'End Date')){
				return false;
			}
		}
	}
	return true

}

function checkTimeMask(){
	var startTime = document.getElementById('startTime');
	var endTime = document.getElementById('endTime');
	if(startTime != null && endTime != null){
		if(startTime.value != ''){
			if (!checkTime(startTime.value, 'Between')){
				return false;
			}
		}
		if(endTime.value != ''){
			if(!checkTime(endTime.value, 'and')){
				return false;
			}
		}
	}
	return true;

}

//Header 3.0

// <![CDATA[
//If we're in an iFrame, force the document domain to be asu.edu
var inIFrame = (window.top != window) ? true : false;
if (inIFrame) {
	document.domain = 'asu.edu';
}
var header_signin_url = '';

function header_alterLoginHref(url) {
	if (header_signin_url) {
		return header_signin_url;
	}
	var callApp = escape(window.location.toString());
	if (inIFrame) {
		callApp = window.parent.location.toString();
	}

	// Dyanamic Drupal login links
	if (url.match('##w.l.d##') && typeof(Drupal) != 'undefined') {
		var re = /https?:\/\/[^\/]*/i;
		var result = re.exec(window.location.toString());
		callApp = result + Drupal.settings.basePath + 'asuwebauth-login';
		url = url.replace('##w.l.d##', callApp);
	}
	url = url.replace('##w.l##', callApp);
	header_signin_url = url;
	return header_signin_url;
}

function header_checkSSOCookie() {
	// try to parse out the username from SSONAME cookie
	var cookies = document.cookie.split(';');
	for(var i = 0; i < cookies.length; i++) {
		if (cookies[i].indexOf('SSONAME') > 0) {
			var sso_name = document.createElement('li');
			if (cookies[i].substring(9) == '') {
				break;
			}
			sso_name.innerHTML = cookies[i].substring(9);

			var sso_link = document.createElement('li');
			sso_link.innerHTML = '<a target="_top" href="https://webapp4.asu.edu/myasu/Signout">SIGN OUT</a>';
			sso_link.className = 'end';

			var ul = document.getElementById('asu_login_module');
			while (ul.childNodes[0]) {
				ul.removeChild(ul.childNodes[0]);
			}
			ul.appendChild(sso_name);
			ul.appendChild(sso_link);

			document.getElementById('myasu_bar').style.display = 'block';
			break;
		}
	}
	// unhide
	document.getElementById('asu_login_module').style.display = 'inline-block';
}
if (window.addEventListener) {
	window.addEventListener('load', header_checkSSOCookie, false);
} else if (window.attachEvent) {
	window.attachEvent('onload', header_checkSSOCookie);
}
//]]>

//<![CDATA[
var header_default_search_text = 'Search ASU';
function header_searchSwitch(name) {
	var field = document.getElementById('asu_search_box');
	if (field != null) {
		var oldDefault = header_default_search_text;
		header_default_search_text = 'Search '+name;
		if (field.value == oldDefault) {
			field.value = header_default_search_text;
		}
	}
}
function header_searchFocus(field) {
	if (typeof field != 'undefined') {
		if (field.value == header_default_search_text) {
			field.value = '';
		}
	}
}
function header_searchBlur(field) {
	if (typeof field != 'undefined') {
		if (field.value == '') {
			field.value = header_default_search_text;
		}
	}
}
function header_searchToggle(radio) {
	var google = document.getElementById('asu_search_google');
	if (google != null) {
		if (google.style.display == 'none') {
			header_default_search_text = 'Search ASU';
			google.style.display = 'block';
		} else {
			google.style.display = 'none';
		}
	}
	var alt = document.getElementById('asu_search_alternate');
	if (alt != null) {
		if (alt.style.display == 'none') {
			header_default_search_text = 'Search ASU';
			alt.style.display = 'block';
		} else {
			alt.style.display = 'none';
		}
	}

	if (typeof radio != 'undefined') {
		radio.checked = false;
	}
}

function changeLocationDropDown(element,type){
	if(type == 'CAMPUS'){
		$('<option value=""></option>').appendTo(element);
		$('<option value="DTPHX">Downtown Phx</option>').appendTo(element);
		$('<option value="POLY">Polytechnic</option>').appendTo(element);
		$('<option value="TEMPE">Tempe</option>').appendTo(element);
		$('<option value="TBIRD">Thunderbird</option>').appendTo(element);
		$('<option value="WEST">West</option>').appendTo(element);
		$('<option value="EAC">Eastern AZ College</option>').appendTo(element);
		$('<option value="ICOURSE">Online: iCourse</option>').appendTo(element);
		$('<option value="OFFCAMP">Off-campus</option>').appendTo(element);
		$('<option value="">All campuses</option>').appendTo(element);
	}else if(type == 'CLASS_ONLINE'){
		$('<option value="ASUONLINE">Online: ASU Online</option>').appendTo(element);
	}else if(type == 'COURSE'){
		$('<option value=""></option>').appendTo(element);
	}
}

function showHideLocationDropDown(type){
	if(type == 'CLASS_ONLINE'){
		$('label#advLocationLbl').hide();
		$('label#locationLbl').hide();
		$('#campus').hide();
		$('#advCampus').hide();
		$('#mobileLocation').hide();
		$('#locationMobile').hide();
		$('#pleaseWaitDiv').show();
	}

	else if(type == 'CLASS_CAMPUS'){
		$('label#advLocationLbl').show();		
		$('#campus').show();
		$('#advCampus').show();
		$('#locationMobile').show();
		$('#mobileLocation').show();
		$('#locationLbl').show();
		$('#pleaseWaitDiv').show();
		
		if($('#campusMobile option:selected').text() == '')
			$('#campusMobile').siblings('.fieldname').addClass('placeholder');
		else
			$('#campusMobile').siblings('.fieldname').removeClass('placeholder');
			
		if($('#advCampusMobile option:selected').text() == '')
			$('#advCampusMobile').siblings('.fieldname').addClass('placeholder');
		else
			$('#advCampusMobile').siblings('.fieldname').removeClass('placeholder');
		
		var used = {};
		$('#campusMobile > option').each(function () {
			var txt = $(this).text();
			if (used[txt])
				$(this).remove();
			else
				used[txt] = true;
		});
		
		used = {};
		$('#advCampusMobile > option').each(function () {
			var txt = $(this).text();
			if (used[txt])
				$(this).remove();
			else
				used[txt] = true;
		});
	}
}
//]]>
