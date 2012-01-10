Alex Kolarski's Web Scraper with JS & jQuery
===============================================

Description
---------
Web HTML scraper all written in JavaScript! jQuery have the best DOM tree manipulation engine. Period. That's why implementing scraper with jQuery is really easy & fast. Together with all recent speed improvements in JavaScript and Node.JS it's really a cutting egde technology. 


Advantages
----------------------------------------

* Moduler architecture - every task is acheved by plug-in architecture
* Scalable
* Can be integrated with any service available
* Can be implemented with Node.js for massive paraller execution (in process)
* Use 2 drawing chart engines for visualizing the output
* Can be integrated with SQL & NoSQL databases even with HTML5's localStorage

Dependency
-----------------
* [jQuery](http://www.jquery.com/ "jQuery") (included) 
* PHP - Using PHP as AJAX proxy regarding "Cross domain origin policy"
* [Highcharts JS v2.1.9](http://www.highcharts.com/ "Highcharts JS v2.1.9") (included) (optional)
* [QUnit testing framework](https://github.com/jquery/qunit "QUnit testing framework") (opional)


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

QUnit testing framework integrated
------------------------------------
You can now write QUnit test for each plugin. Place the test in the **test** folder with the same plugin name & excute them with **test=1** parameter in the URL.


Roadmap
---------------
* Integrate with Node.js for parallel scraping
* Database layer for saving the information
* MD5 cache check for already scraped resources
* Integrating Brain.JS


--------
For more information feel free to contact me: 
aleks.rk@gmail.com