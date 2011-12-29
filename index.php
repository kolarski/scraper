<!doctype html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.6.0/jquery.min.js"></script>
		<script src="underscore.js"></script>
		
		<!--<script type="text/javascript" src="https://www.google.com/jsapi"></script>-->
		<script type="text/javascript" src="plugins/highcharts.js"></script>
		<script type="text/javascript" src="plugins/exporting.js"></script>
		<script src="jquery.md5.js"></script>
		<script type="text/javascript">
		var crower = {
			plugins: {},
		};
		</script>
		<? if ($_GET['plugin'] != ""): ?>
				<script src="plugins/<?=$_GET['plugin']?>.js"></script>
		<? endif; ?>
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