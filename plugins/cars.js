var plugins = $.extend(crower.plugins, {'cars' : {
	pageUrl: "http://nfs.mobile.bg/pcgi/mobile.cgi",
	requestType: 'post',
	postVars: {
		act:3,
		rub:1,
		topmenu:1,
		marka: 'Renault',
		model: 'Kangoo',
		//price1:,
		//year: 1997,
		//engine_t:'бензинов',
		//transmis:'%D0%FA%F7%ED%E0',
		//location:'',
		f1: 1,
		nup:0,
	},
	el: 'body',
	cars_data: [],
	chart_data: [],
	total_price: 0,
	probability: {},
	total: 0,
	maxPages: 23,
	process: function(html) {
		// calculate the pages
		var pages_array = $(html).find('.pageNumbersInfo').text().split(' '),car_money_type;
		plugins.cars.maxPages = pages_array[pages_array.length-1];
		$(html).find('table[width=660]').each(function() {
			var desc = $(this).find('tbody td[width=510]').html(),
				car_title = $(this).find('.mmm').text(),
				price = $(this).find('.price').text(),
				link_pic = $(this).find('tr').eq(2).find('td a');
			if (desc === null || car_title === null || price === null) return;
			// manif data
			car_data = desc.split('<br><br>')[0].split(',');
			manifacture_date = car_data[0].substring(31).split(' ');
			
			// probeg
			car_km = car_data[1].split(' ')[3];
			
			// color
			if (car_data[2] !== undefined) {
				car_color = car_data[2].split(' ').splice(3,5).join(' ');
			} else {
				car_color = '';
			}
			
			// car location
			car_data = desc.split('<br><br>')[1].split('<br>Регион: ');
			car_desc = car_data[0];
			car_location = car_data[1];
			
			//car price
			price_split = price.split(' ');
			car_price = price_split.slice(0,price_split.length-1).join('');
			
			if(price.indexOf('лв.') == -1) {
				if (price.indexOf('EUR') !== -1) {
					car_money_type = 'euro';
				}
			} else {
				car_money_type = 'leva';
			}
			link = $(link_pic).attr('href');
			pic = $(link_pic).find('img').attr('src');
			//default no-picture
			if (pic == "http://www.mobile.bg/images/picturess/photo_med1.gif") {
				pic = '';
			}
			console.log(pic);
			var data = {
				month: manifacture_date[0],
				year: parseInt(manifacture_date[1], 10),
				title: car_title,
				km: parseInt(car_km, 10),
				color: car_color,
				location: car_location,
				short_desc: car_desc,
				price: parseInt(car_price, 10),
				price_currency: car_money_type,
				scrape_time:  parseInt(new Date().getTime() / 1000, 10),
				link_pic:  link,
				pic: pic
			}
			//console.log($(link_pic).html());
			plugins.cars.cars_data.push(data);
		});
		if(plugins.cars.postVars.f1 <= plugins.cars.maxPages) {
			plugins.cars.postVars.f1 += 1;
			$.post(
				'proxy.php?proxy_url=' + plugins.cars.pageUrl, 
				plugins.cars.postVars,
				plugins.cars.process
			);
			var text = 'Loading page: ' + plugins.cars.postVars.f1 + ' out of ' + plugins.cars.maxPages + ' about <strong>' + plugins.cars.postVars.marka + ' ' + ((plugins.cars.postVars.model)?plugins.cars.postVars.model:'') + '</strong>. Please wait ..';
			$('#container').html(text);
		} else {
			plugins.cars.processChartData();
			plugins.cars.drawChart('container');
			$('#cars_container').html('<div>Cars fetched: ' + plugins.cars.chart_data.length + '<br />Pages scraped: ' + plugins.cars.maxPages  + '<br />Average car price: ' + (plugins.cars.total_price/plugins.cars.chart_data.length).toFixed(2) +'<br />Fucking amazing average: ' + plugins.cars.total.toFixed(2) +'</div>')
			
		}
	},
	processChartData: function() {
		var key = '';
		// console.log(plugins.cars.cars_data);
		_.each(plugins.cars.cars_data, function(car, i) {
			tolerance = 2500;
			if (car.price_currency !== 'leva') {
				car.price = car.price * 1.93;
			}
			if (isNaN(car.price) === false){
				plugins.cars.total_price += car.price;
				key = (car.price > tolerance)?(car.price - (car.price % tolerance)):tolerance;
				if (typeof plugins.cars.probability[key] === 'undefined') {
					plugins.cars.probability[key] = 1;
				} else {
					plugins.cars.probability[key] += 1;
				}
				plugins.cars.chart_data.push([car.year, car.price, car.link_pic, car.pic]);
			}			
		});
		
		_.each(plugins.cars.probability, function(value, key) {
			plugins.cars.total += ( key * value / plugins.cars.chart_data.length);
			//console.log(key + ' * ' + value + ' / ' + plugins.cars.chart_data.length);
		});
		
	},
	drawChart: function(container) {
		var chart = new Highcharts.Chart({
			chart: {
				renderTo: container, 
				defaultSeriesType: 'scatter',
				zoomType: 'xy'
			},
			title: {
				text: 'Графика за коли марка ' + plugins.cars.postVars.marka + ' ' + plugins.cars.postVars.model
			},
			subtitle: {
				text: 'Александър Коларски'
			},
			xAxis: {
				title: {
					enabled: true,
					// text: 'Година на производство'
					text: 'Година'
				},
				startOnTick: true,
				endOnTick: true,
				showLastLabel: true
			},
			yAxis: {
				title: {
					// text: 'Цена (лв.)'
					text: 'Цена (лв.)'
				}
			},
			tooltip: {
				useHTML: true,
				formatter: function() {
						console.log(this['point']['config']);
						return '<a target="_blank" href="' + this['point']['config'][2] + '"><img src="'+this['point']['config'][3]+'" /></a>';
				}
			},
			legend: {
				layout: 'vertical',
				align: 'left',
				verticalAlign: 'top',
				x: 100,
				y: 70,
				floating: true,
				backgroundColor: '#FFFFFF',
				borderWidth: 1
			},
			plotOptions: {
				scatter: {
					marker: {
						radius: 5,
						states: {
							hover: {
								enabled: true,
								lineColor: 'rgb(100,100,100)'
							}
						}
					},
					states: {
						hover: {
							marker: {
								enabled: false
							}
						}
					}
				}
			},
			series: [{
				name: 'Цена1',
				color: 'rgba(223, 83, 83, .5)',
				data: plugins.cars.chart_data
			}]
		});
	  }
		
	
	
}});