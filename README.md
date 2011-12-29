Alex Kolarski's Web Scraper with JS & jQuery
===============================================

----------------------------------------

* Moduler architecture - every task is acheved by plug-in architecture
* Scalable
* Can be integrated with any service available
* Can be implemented with Node.js for massive paraller execution (in process)
* Use 2 drawing chart engines for visualizing the output
* Can be integrated with SQL & NoSQL databases even with HTML5's localStorage

Dependency
-----------------
* Highcharts JS v2.1.9 (included)
* jQuery (included)


Simple usage
-----------------------
Here is template to an empty plugin in the scraper:

```javascript

var plugins = $.extend(crower.plugins, {'plugin_name' : { // plugin_name is the name of your plugin
    pageUrl: "http://www.example.com/", // Here is your default page you want to scrape
    requestType: 'get', // HTTP request type (POST may be also appropriate)
    el: 'body', 
    process: function(html){ // callback function that you have the HTML code of the above page
        $(html).find('/*find some data*/').each(function(){
	          // do interesting stuff with jQuery & use ajax request to save to database
        });
    }
}});
  
```
Put the plugin in plugins folder inder the same name as **plugin_name.js** & execute with **index.php?plugin=plugin_name**

--------
For more information feel free to contact me: 
aleks.rk@gmail.com