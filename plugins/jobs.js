var plugins = $.extend(crower.plugins, {'jobs' : {
	pageUrl: "http://www.jobs.bg/front_job_search.php?first=1&str_regions=&str_locations=&old_country=&country=-1&region=0&location%5B%5D=1&l_category%5B%5D=0&category%5B%5D=15&job_type=1&job_hours=1&keyword=",
	requestType: 'get',
	postVars: {},
	el: 'body',
	process: function(html){
		$(html).find('table').each(function(){
			if($(this).find('tbody tr:first td').length == 4){
				date = $($(this).find('tbody tr:first td')[0]);
				if( date.text() == 'Дата'){
					table = date.closest('tbody');
					
					$(plugins.jobs.el).html(table);
					console.log(self);
					$('.MainLinkBold').each(function(){
						$(this).attr('href', 'http://www.jobs.bg/' + $(this).attr('href'));
					});
					$(plugins.jobs.el).find('img').each(function(){
						if($(this).attr('src').substring(0,4) != 'http'){
							$(this).attr('src', 'http://www.jobs.bg/' + $(this).attr('src'));
						}							
					});
				}
			}
		});
	}
}});