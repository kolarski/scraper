var plugins = $.extend(crower.plugins, {'imoti' : {
	pageUrl: "http://www.imot.bg/pcgi/imot.cgi",
	requestType: 'post',
	postVars: {
		act:3,
		rub:1,
		topmenu:1,
		f0: '92.247.17.74',
		f1:1,
		f4:1,
		f30: 'EUR',
		f41:1,
		fe1:1,
		fe2:1,
		smsact:1,
		emailact:1,
	},
	el: 'body',
	parsed: [],
	chart_data: [],
	total_price: 0,
	probability: {},
	total: 0,
	maxPages: 23,
	parseSingle: function(imoti){
		var data = {
			link: imoti.find('tr').eq(1).find('td').eq(0).find('a').attr('href'),
			picture: imoti.find('tr').eq(1).find('td').eq(0).find('a img').attr('src'),
			price: imoti.find('tr').eq(1).find('td').eq(2).find('.price').text(),
			title: $.trim(imoti.find('tr').eq(1).find('td').eq(2).find('a').eq(0).text()),
			location: $.trim(imoti.find('tr').eq(1).find('td').eq(2).find('a').eq(1).text()),
			desc: $.trim(imoti.find('tr').eq(3).text()),
		};
		if (data.price.indexOf('EUR') !== -1){
			var kurs = 1.96
			data.price = parseInt(parseInt(data.price.split('EUR')[0].replace(' ',''), 10) * kurs);
		} else {
			console.log(data.price);
		}
		single = imoti.find('tr').eq(1).find('td').eq(2).find('.price').text();
		return data;
		
			
	},
	scrape: function(html){
		var data;
		$(html).find('table[width=980]').eq(3).find('td[width=680]').find('table[width=660]').each(function(i,v){
			if($(v).css('background') != '') {
				var imot = plugins.imoti.parseSingle($(v));
				if (typeof imot !== 'undefined') {
					plugins.imoti.parsed.push(imot);
				}
			}
		});
		// console.log(plugins.imoti.parsed);
		//console.log(data);
		
		//$('html').html(data);
		return;
		$(html).find('table[width=660]').each(function() {
			
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
			plugins.imoti.parsed.push(data);
			//console.log(plugins.imoti.parsed);
		});
	},
	getMaxPages: function(html){
		// return 2;
		return parseInt($(html).find('span.pageNumbersInfo').eq(0).text().split(' ')[3], 10)-2;
	},
	process: function(html) {
		// calculate the pages
		
		
		plugins.imoti.maxPages = plugins.imoti.getMaxPages(html);
		plugins.imoti.scrape(html);
		
		if(plugins.imoti.postVars.f1 <= plugins.imoti.maxPages) {
			plugins.imoti.postVars.f1 += 1;
			$.post(
				'proxy.php?proxy_url=' + plugins.imoti.pageUrl, 
				plugins.imoti.postVars,
				plugins.imoti.process
			);
			var text = 'Loading page: ' + plugins.imoti.postVars.f1 + ' out of ' + plugins.imoti.maxPages + ' about <strong>' + plugins.imoti.postVars.marka + ' ' + ((plugins.imoti.postVars.model)?plugins.imoti.postVars.model:'') + '</strong>. Please wait ..';
			$('#container').html(text);
		} else {
			plugins.imoti.processChartData();
			plugins.imoti.drawChart('container');
			$('#imoti_container').html('<img style="position: absolute;top: 375px;left:0;" class="imgg" src="" />')
			
		}
	},
	processChartData: function() {
		var i = 1;
		_.each(plugins.imoti.parsed, function(imot, i) {
			if (isNaN(imot.price) === false){
				plugins.imoti.chart_data.push([i, imot.price, imot.link, imot.picture]);
				i += 1;
			}
		});
		// console.log(plugins.imoti.chart_data);
	},
	drawChart: function(container) {
		var chart = new Highcharts.Chart({
			chart: {
				renderTo: container, 
				defaultSeriesType: 'scatter',
				zoomType: 'xy'
			},
			title: {
				text: 'Графика за коли марка ' + plugins.imoti.postVars.marka + ' ' + plugins.imoti.postVars.model
			},
			subtitle: {
				text: 'Александър Коларски'
			},
			xAxis: {
				title: {
					enabled: true,
					// text: 'Година на производство'
					text: 'Цена (лв.)'
				},
				startOnTick: true,
				endOnTick: true,
				showLastLabel: true
			},
			yAxis: {
				title: {
					// text: 'Цена (лв.)'
					text: 'Година'
				}
			},
			tooltip: {
				enabled: true,
				useHTML: false,
				formatter: function() {
						return this['point']['config'][1];
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
				},
				series: {
					point: {
					events: {
						mouseOver: function(){
							if (this['config'][3] == ''){
								$('.imgg').hide().attr('src','');
							} else {
								$('.imgg').attr('src', this['config'][3]).show();
							}
						},
						mouseOut: function(){
							$('.imgg').hide().attr('src','');
						},
						click: function(){
							window.open(this['config'][2],'newtaborsomething');
						}
					},
					
				},
				}
			},
			series: [{
				name: 'Цена1',
				color: 'rgba(223, 83, 83, .5)',
				data: plugins.imoti.chart_data
			}]
		});
	  }
		
	
	
}});