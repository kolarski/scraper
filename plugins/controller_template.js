var plugins = $.extend(crower.plugins, {'fmi' : {
	pageUrl: "http://www.fmi.uni-sofia.bg/",
	requestType: 'get',
	el: 'body',
	process: function(html){
		$(html).find('#portal-column-two .portletItem a').each(function(){
			var text =  $(this).text(),
				href = $(this).attr('href');
			$(this.el).append('<p><a href="'+href+'">'+text+'</a></p>');
		});
	}
}});