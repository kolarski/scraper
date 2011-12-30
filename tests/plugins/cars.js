var plugin_name = 'cars',
	plugin = plugins[plugin_name];

$.ajax({
	url: proxy_script+'?proxy_url=' + plugin.pageUrl,
	dataType: 'html',
	type: plugin.requestType,
	data: plugin.postVars,
	success: function(data) {
		test("Can fetch " + plugin.pageUrl + " ?", function(){
		  ok( data !== '', "HTML source code is returned" );
		});
		
		// parse the data
		plugin.scrape(data);
		// 
		
		test("Have some car data parsed ?", function(){
			success_titles = 0;
				$(plugin.cars_data).each(function(i, val){
					if (typeof val.title === 'string' && val.title.length > 5) success_titles += 1;
				})
			ok(success_titles > 0, "We parsed car titles ("+ success_titles +" out of " + plugin.cars_data.length + ") ");
			ok(plugin.cars_data.length > 0, "We parsed some cars ("+plugin.cars_data.length+" cars on first page)");
			
			
		});
		test("Get successfully max pages ?", function(){
			var max_pages = parseInt(plugin.getMaxPages(data),10);
			ok(!isNaN(max_pages), "Number of pages is integer");
			ok(max_pages > 0, "Number of pages is grater than 0. Exactly "+ max_pages+" pages.");
		});
		
		// prepare data for charting
		plugin.processChartData();
		//
		test("Prepare data for charting", function(){
			ok(plugin.chart_data.length > 0, "We have data for charting");
		});
		
	},
	error: function(error){
		test("Can fetch " + plugin.pageUrl + " ?", function(){
		  ok( false, "AJAX error" );
		});
	}
});