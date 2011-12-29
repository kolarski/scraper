var plugins = $.extend(crower.plugins, {'bets' : {
	pageDomain: "http://www.olbg.com/",
	pageUrl: "http://www.olbg.com/football.php",
	requestType: 'get',
	el: 'body',
	process: function(html){
		var data = $(html).find('#sport'),
			bets_data = [],
			single_bet,
			self = this;
		data.find('tr').each(function(i,current_bet) { // for many bets
			single_bet = {};
			if (i !== 0) { // remove thead
				$(current_bet).find('td').each(function(i, field) { // for single bet
					
					if (i == 0) {
						console.log($(field));
						single_bet.name = $.trim($(field).find('a').text());
						single_bet.sporttime = $.trim($(field).find('.sporttime').text());
						single_bet.link = crower.plugins.bets.pageDomain + $.trim($(field).find('a').attr('href'));
					}
					if (i == 1) {
						single_bet.bet_type = $.trim($(field).find('p em').text());
						$(field).find('p:first').remove();
						single_bet.chance = $.trim($(field).find('p').text());
					
						single_bet.percent_votters = single_bet.chance.split('%')[0];
						single_bet.total_voters = single_bet.chance.split(' Win')[0].split('of ')[1];
						single_bet.voters = (parseInt(single_bet.chance, 10)/100) * parseInt(single_bet.total_voters, 10);
						
						$(field).find('p:first').remove();
						single_bet.bet = $.trim($(field).text());
					}
					if(i == 2) {
						single_bet.best_odd = $.trim($(field).find('span').text());
						single_bet.best_odd_at = $.trim($(field).find('a img').attr('alt'));
						
					}
					if(i == 3) {
						single_bet.ticks = $(field).find('img[src*="tick"]').length;
					}
				});
				bets_data.push(single_bet);
			}
			
		});
		
		
		//crower.plugins.bets.render(bets_data);
		bets_data = _.sortBy(bets_data, function(el){ return 1-(el.percent_votters/100) * el.total_voters });
		_.each(bets_data, function(single_bet){
			var output = "";
			for (property in single_bet) {
				if (property == 'link'){
					output += '<strong>' + property + '</strong>' + ': <a href="' + single_bet[property] + '">' + single_bet[property] + '</a> <br/ >';
				}else {
					output += '<strong>' + property + '</strong>' + ': ' + single_bet[property]+' <br/ >';
				}
			}
			$('#bets_container').append(output + '<br />');
		});
	},
	render: function(bets_data){
		$('#bets_container').html('<div class="summary"/><div class="tips">');
		$('.summary').html('Total tips: ' + bets_data.length);
		$(bets_data).each(function(i,bet){
			$('.tips').append(bet.name + '<br />');
			$('.tips').append(bet.best_odd + '<br />');
			$('.tips').append(bet.chance + '<br />');
			$('.tips').append('<br />');
			//$('.tips').append(bet.name + '<br />');
			//console.log(bet);
		});
		
	}
}});