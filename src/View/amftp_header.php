<?php !defined('_Amysql') && exit; ?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<title><?php echo $title;?></title>
<base href="<?php echo _Http;?>" />
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<link href="View/css/style.css?3.0" rel="stylesheet" type="text/css" />
<link href="View/css/ico.css?3.0" rel="stylesheet" type="text/css" />
<script src="View/js/index.js?3.0" type="text/javascript"></script>
<script src="View/js/jquery.js" type="text/javascript"></script>
<script src="View/js/webuploader.min.js" type="text/javascript"></script>
<link href="View/css/UploadObject.css" rel="stylesheet" type="text/css" />
</head>

<body>
<div id="header"> 
<font>
<b><a href="./index.php"><img src="View/images/logo.jpg?3.0" /></a></b> 
</font> 
<span> 在线FTP管理客户端 
<?php if(isset($_SESSION['ftp']['user'])) {?>
	 -  <b><?php echo $_SESSION['ftp']['ip'];?></b> 服务器 <font style="float:none" color="<?php echo $_SESSION['ftp']['pasv'] ? '#804491' : '#449153';?>">(<?php echo $_SESSION['ftp']['pasv'] ? '被动' : '主动';?>模式)</font>
<?php } ?>
</span>

<?php if(isset($_SESSION['ftp']['user'])) {?>
	<a id="logout" href="./index.php?c=index&a=logout"><img src="View/images/ico/logout.png" /> 退出<?php echo $_SESSION['ftp']['user'];?></a>
<?php } ?>
</div>
