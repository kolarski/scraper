<?error_reporting(E_ALL&~E_NOTICE);?>
<!doctype html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<title></title>
		<!-- Grab Google CDN's jQuery, with a protocol relative URL; fall back to local if offline /*HTML5Boilerplate*/ -->
		<script src="//ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
		<script>window.jQuery || document.write('<script src="libs/jquery-1.7.1.min.js"><\/script>')</script>
  
		<script src="libs/underscore.js"></script>
		
		<!--<script type="text/javascript" src="https://www.google.com/jsapi"></script>-->
		<script type="text/javascript" src="libs/highcharts.js"></script>
		<? if (isset($_GET['test'])): ?>
		<script type="text/javascript" src="libs/qunit/qunit.js"></script>
		<link rel="stylesheet" type="text/css" href="libs/qunit/qunit.css"  />
		<? endif; ?>
		<script type="text/javascript" src="libs/exporting.js"></script>
		<script src="libs/jquery.md5.js"></script>
		<script type="text/javascript">
		var crower = {
			plugins: {},
		};
			
		</script>
			
		<? if (isset($_GET['plugin'])): ?>
			<script src="plugins/<?=$_GET['plugin']?>.js"></script>
		<? else: 
				if ($handle = opendir('plugins')) {
				echo '<h1>Plugins</h1>';
				/* This is the correct way to loop over the directory. */
				while (false !== ($entry = readdir($handle))) {
					if (!in_array($entry, array('.','..')) && substr($entry,-3,3) == '.js') 
					{
						$plugin_name =  substr($entry,0,-3);
						echo '<a href="index.php?plugin='.$plugin_name.'">'.$plugin_name.'</a><br />';
						// echo."<br />";
					}
				}

				closedir($handle);
			}
		endif; ?>
		<script type="text/javascript">
			var proxy_script = 'proxy.php';
			function execute(){
				if (plugins.<?=$_GET['plugin']?>.requestType !== 'post') {
					$.get(proxy_script, {proxy_url:plugins.<?=$_GET['plugin']?>.pageUrl}, plugins.<?=$_GET['plugin']?>.process);
				} else {
					$.post(
							proxy_script + '?proxy_url=' + plugins.<?=$_GET['plugin']?>.pageUrl, 
							plugins.<?=$_GET['plugin']?>.postVars,  
							plugins.<?=$_GET['plugin']?>.process
					);
				}
			}
			<? if (isset($_GET['test'])): ?>
				</script><script src="tests/plugins/<?=$_GET['plugin']?>.js"></script><script>			
			<? else: ?>
				execute();
			<? endif; ?>
			//google.load("visualization", "1", {packages:["corechart"]});
		</script>
		
		<link rel="stylesheet" type="text/css" href="style.css"  />
	</head>
	<body style="width: 100%; height: 100%;">
	 <? if (isset($_GET['test'])): ?>
		  <h1 id="qunit-header">QUnit example</h1>
 

 <h2 id="qunit-banner"></h2>
 <div id="qunit-testrunner-toolbar"></div>
 <h2 id="qunit-userAgent"></h2>
 <ol id="qunit-tests"></ol>
 <div id="qunit-fixture">test markup, will be hidden</div>
 <? endif; ?>
		<div id="chart_div"></div>
		<div id="container" style="width: 100%; height: 100%; margin: 0 auto"></div>
		<div id="<?=$_GET['plugin']?>_container"></div>
	</body>
</html>