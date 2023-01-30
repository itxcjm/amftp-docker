<?php 
!defined('_Amysql') && exit; 
global $Config;
?>
<div id="footer" style="">

<?php if(!empty($memory_limit)) {?>
当前运行环境内存限制 <b> <?php echo $memory_limit;?> </b> ( 每次处理文件大小限制范围 ) <a href="./index.php?c=index&a=rmtmp" >清除缓存</a><br />
<?php }?>
Copyright © 2021 广州华的科技 
All Rights Reserved AMFTP 3.0  <a href="./index.php?c=index&a=help" >使用帮助</a> <?php echo $Config['OnlyLocal'] ? '(本地FTP连接)' : '';?><br />
AMH提供技术支持 <a href="https://amh.sh" target="_blank">amh.sh</a> 
<br />
<br />
</div>

</body>
</html>