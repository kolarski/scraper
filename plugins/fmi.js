var plugins = $.extend(crower.plugins, {'fmi' : {
	pageUrl: "http://www.fmi.uni-sofia.bg/",
	el: 'body',
	process: function(html){
	
		$(html).find('#portal-column-two .portletItem a').each(function(){
			console.log(this.el);
			var text =  $(this).text(),
				href = $(this).attr('href');
			$(plugins.fmi.el).append('<p><a href="'+href+'">'+text+'</a></p>');
		});
	}
}});