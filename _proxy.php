<?
	if (isset($_GET['url']))
	{
		include "MyCurl.php";
		$mc = new MyCurl();
		$mc->getHeaders = false;
		$mc->getContent = true;
		echo $mc->get($_GET['url']);
	}

?>