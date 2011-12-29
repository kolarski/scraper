var plugins = $.extend(crower.plugins, {'arena_movies' : {
	pageUrl: "http://www.kinoarena.com/%D0%BF%D1%80%D0%BE%D0%B3%D1%80%D0%B0%D0%BC%D0%B0.html",
	el: 'body',
	process: function(html){
		$(html).find('.projection').each(function(){
			var m_title = $(this).find('.movie-thumb').text(),
				m_href = 'http://www.kinoarena.com/' + $(this).find('.movie-thumb').attr('href'),
				m_buy = $(this).find('.buy').html(),
				m_img = $(this).find('img').attr('src'),
				info = $(this).find('.info').text();
			if (m_buy !== null){
				$(plugins.arena_movies.el).append('<div style="height: 300px; float:left; display:block; width:24%; overflow:hidden;border: 0px solid red; text-align:center;"><a href="'+m_href+'"><img style="width:60px;height:80px;" src="http://www.kinoarena.com/'+m_img+'"><br />' + m_title + '</a>'+m_buy+'</div>');
			}
		});
	}
}});