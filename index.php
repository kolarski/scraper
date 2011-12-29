<!doctype html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.6.0/jquery.min.js"></script>
		<script src="libs/underscore.js"></script>
		
		<!--<script type="text/javascript" src="https://www.google.com/jsapi"></script>-->
		<script type="text/javascript" src="libs/highcharts.js"></script>
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
			function execute(){
				var proxy_script = 'proxy.php';
				
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
			execute();
			//google.load("visualization", "1", {packages:["corechart"]});
		</script>
		
		<link rel="stylesheet" type="text/css" href="style.css"  />
	</head>
	<body style="width: 100%; height: 100%;">
		<div id="chart_div"></div>
		<div id="container" style="width: 100%; height: 100%; margin: 0 auto"></div>
		<div id="<?=$_GET['plugin']?>_container"></div>
	</body>
</html>