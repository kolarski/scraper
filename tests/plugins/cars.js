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
		plugin.init(data);
		plugin.breakdown();
		// 
		
		test("Parsing phase", function(){
			
			var success_titles = 0;
			var success_color = 0;
			var success_km = 0;
			var success_link = 0;
			var success_thumb_picture = 0;
			var success_medium_picture = 0;
			var success_big_picture = 0;
			
			var success_currency = 0;
			var success_year = 0;
			var success_price = 0;
			var colors = [
				'Бордо',
				'Металик',
				'Светло сив',
				'Светло син',
				'Сив',
				'Син',
				'Тъмно сив',
				'Тъмно син мет.',
				'Червен',
				'Черен',
				'Сребърен',
				'Зелен',
				'Кафяв'
			];
			
			$(plugin.cars_data).each(function(i, val){
				// title
				if (typeof val.title === 'string' && val.title.length > 5) success_titles += 1;
				// color
				if (typeof val.color === 'string' && val.color.length > 2){
					if ($.inArray(val.color, colors) !== -1) {
						success_color += 1;
					} else { 
						console.log("Missing color: '" + val.color + "'");
					}
				}
				//km
				if (!isNaN(val.km) && val.km > 0) success_km += 1;
				
				//link 
				if (typeof val.link === 'string' && val.link.indexOf('mobile.bg') !== -1) success_link += 1;
				
				//picture thumb
				if (typeof val.thumb_picture === 'string' && val.thumb_picture.indexOf('mobile.bg') !== -1) success_thumb_picture += 1;
				
				//picture medium
				if (typeof val.medium_picture === 'string' && val.medium_picture.indexOf('mobile.bg') !== -1) success_medium_picture += 1;
				
				//picture big
				if (typeof val.big_picture === 'string' && val.big_picture.indexOf('mobile.bg') !== -1) success_big_picture += 1;
				
				//currency
				if ($.inArray(val.price_currency, ['leva','evro']) !== -1) success_currency += 1;
				
				//year
				if (!isNaN(val.year) && val.year > 1000 && val.year < 3000) success_year += 1;
				
				//price
				if (!isNaN(val.price) && val.price >= 0) success_price += 1;
				
			})
			ok(success_titles > 0, "Parsed car titles ("+ success_titles +" out of " + plugin.cars_data.length + ") ");
			ok(success_color > 0, "Parsed car colors ("+ success_color +" out of " + plugin.cars_data.length + ") ");
			ok(success_km > 0, "Parsed car km ("+ success_km +" out of " + plugin.cars_data.length + ") ");
			ok(success_link > 0, "Parsed car links ("+ success_link +" out of " + plugin.cars_data.length + ") ");
			ok(success_thumb_picture > 0, "Parsed car thumb pictures ("+ success_thumb_picture +" out of " + plugin.cars_data.length + ") ");
			ok(success_medium_picture > 0, "Parsed car medium pictures ("+ success_medium_picture +" out of " + plugin.cars_data.length + ") ");
			ok(success_big_picture > 0, "Parsed car big pictures ("+ success_big_picture +" out of " + plugin.cars_data.length + ") ");
			ok(success_currency > 0, "Parsed car currency ("+ success_currency +" out of " + plugin.cars_data.length + ") ");
			ok(success_year > 0, "Parsed car years ("+ success_year +" out of " + plugin.cars_data.length + ") ");
			ok(success_price > 0, "Parsed car prices ("+ success_price +" out of " + plugin.cars_data.length + ") ");
			
			// ---
			ok(plugin.cars_data.length > 0, "We parsed some cars ("+plugin.cars_data.length+" cars on first page)");
			
			
		});
		test("Parsing number of pages", function(){
			var max_pages = parseInt(plugin.getMaxPages(data),10);
			ok(!isNaN(max_pages), "Number of pages is integer");
			ok(max_pages > 0, "Number of pages is grater than 0. Exactly "+ max_pages+" pages.");
		});
		
		// prepare data for charting
		plugin.processChartData();
		//
		test("Prepare data for charting", function(){
			ok(plugin.cars_data.length > 0, "We have data for charting");
		});
		
	},
	error: function(error){
		test("Can fetch " + plugin.pageUrl + " ?", function(){
		  ok( false, "AJAX error" );
		});
	}
});