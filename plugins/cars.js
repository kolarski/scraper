var plugins = $.extend(crower.plugins, {'cars' : {
	pageUrl: "http://nfs.mobile.bg/pcgi/mobile.cgi",
	requestType: 'post',
	postVars: {
		act:3,
		rub:1,
		topmenu:1,
		marka: 'Honda',
		model: 'Civic',
		//price1:,
		//year: 2003,
		//engine_t:'бензинов',
		//transmis:'%D0%FA%F7%ED%E0',
		//location:'',
		f1: 1,
		nup:0, // нови
		//nup:23, // на части
	},
	el: 'body',
	cars_data: [],
	chart_data: [],
	total_price: 0,
	probability: {},
	total: 0,
	maxPages: 23,
	element: '',
	self: '',
	html: '',
	getMaxPages: function(){
		// return 3;
		var pages_array = $(self.html).find('.pageNumbersInfo').text().split(' ');
		return pages_array[pages_array.length-1];
	},
	parse: {
		title: function (){
			return self.element.find('.mmm').text();
		},
		price: function(){
			var price_split = self.element.find('.price').text().split(' ');
			return parseInt(price_split.slice(0, price_split.length-1).join(''), 10);
		},
		currency: function() {
			var price_split = self.element.find('.price').text().split(' ');
			if(price_split.indexOf('лв.') == -1) {
				if (price_split.indexOf('EUR') !== -1) {
					return 'euro';
				}
			} 
			return 'leva';
		},
		description: function(){
			return self.element.find('tbody td[width=510]').html();
		},
		process_picture: function(src){
			var no_picture = [
					"http://www.mobile.bg/images/picturess/photo_med1.gif",
					"http://www.mobile.bg/images/picturess/hot_small.gif",
				];
			return ($.inArray(src, no_picture) !== -1) ? '': src;
		},
		thumb_picture: function(){
			return self.parse.process_picture(self.element.find('tr').eq(2).find('td a').find('img').attr('src'));
		},
		medium_picture: function(){
			return self.parse.process_picture(self.parse.thumb_picture().replace("/med", ""));
		},
		big_picture: function(){
			return self.parse.process_picture(self.parse.thumb_picture().replace("med", "big"));
		},
		link_details: function() {
			return self.element.find('tr').eq(2).find('td a').attr('href');
		},
		manifacture_date: function(){
			var desc = self.parse.description();
				var car_data = desc.split('<br><br>')[0].split(',');
			return car_data[0].substring(31).split(' ');
		},
		manifacture_year: function(){
			return parseInt(self.parse.manifacture_date()[1], 10);
		},
		manifacture_month: function(){
			return self.parse.manifacture_date()[0];
		},
		km: function(){
			var desc = self.parse.description(),
				car_data = desc.split('<br><br>')[0].split(',');
			return parseInt(car_data[1].split(' ')[3], 10);
		},
		color: function(){
			var desc = self.parse.description(),
				car_data = desc.split('<br><br>')[0].split(',');
			return (car_data[2] !== undefined)? car_data[2].split(' ').splice(3,5).join(' '): '';
		},
		location: function(){
			var desc = self.parse.description(),
				car_data = desc.split('<br><br>')[1].split('<br>Регион: ');
			return car_data[1];
		},
	},
	breakdown: function() {
		$(self.html).find('table[width=660]').each(function() {
			self.element = $(this);
			if(self.parse.title() === '') return;
			var data = {
				year: 			self.parse.manifacture_year(),
				price:			self.parse.price(),
				y: 				self.parse.manifacture_year(),
				x:				self.parse.price(),
				title: 			self.parse.title(),
				km: 			(isNaN(self.parse.km()))? 0: self.parse.km(),
				month: 			self.parse.manifacture_month(),
				color: 			self.parse.color(),
				location: 		self.parse.location(),
				price_currency: self.parse.currency(),
				scrape_time:  	parseInt(new Date().getTime() / 1000, 10),
				link:	  		self.parse.link_details(),
				thumb_picture: 	self.parse.thumb_picture(),
				medium_picture:	self.parse.medium_picture(),
				big_picture:	self.parse.big_picture()
			}
			self.cars_data.push(data);
			
		});
		// $.map(self.cars_data, function(val,i){val.y = val.km})
		return self.cars_data;
	},
	init: function(html){
		self = plugins.cars;
		self.html = html;
		self.maxPages = self.getMaxPages();
	},
	process: function(html) {
		plugins.cars.init(html);
		self.breakdown();

		if(self.postVars.f1 <= self.maxPages) {
			self.postVars.f1 += 1;
			$.post(
				'proxy.php?proxy_url=' + self.pageUrl,
				self.postVars,
				self.process
			);
			var text = 'Loading page: ' + self.postVars.f1 + ' out of ' + self.maxPages + ' about <strong>' + self.postVars.marka + ' ' + ((self.postVars.model)?self.postVars.model:'') + '</strong>. Please wait ..';
			$('#container').html(text);
		} else {
			self.processChartData();
			self.drawChart('container');
			$('#cars_container').html('<p class="title"></p><img style="height: 300px" class="imgg" src="" /><div>')

		}
	},
	processChartData: function() {
		_.each(self.cars_data, function(car, i) {
			if (car.price_currency !== 'leva') {
				car.price = car.price * 1.93;
			}
		});
	},
	drawChart: function(container) {
		var chart = new Highcharts.Chart({
			chart: {
				renderTo: container,
				defaultSeriesType: 'scatter',
				zoomType: 'xy'
			},
			credits: {
				enabled: false
			},
			title: {
				text: 'Графика за коли марка ' + self.postVars.marka + ' ' + self.postVars.model
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
				enabled: false,
				useHTML: true,
				formatter: function() {
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
				},
				series: {
					point: {
						events: {
							mouseOver: function(){
								if (this['picture'] == ''){
									$('.imgg').hide().attr('src','');
								} else {
									$('.imgg').attr('src', this['big_picture']).show();
								}
								$('.title').text(this['title']).show();
							},
							mouseOut: function(){
								$('.imgg').hide().attr('src','');
								$('.title').hide().text('');
							},
							click: function(){
								window.open(this['link'],'newtaborsomething');
							}
						},
					},
				}
			},
			series: [{
				name: 'Цена/Година',
				color: 'rgba(223, 83, 83, .5)',
				data: self.cars_data
			}]
		});
	  }



}});