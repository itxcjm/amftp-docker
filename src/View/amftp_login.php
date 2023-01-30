<?php 
include('amftp_header.php');
global $Config;
?>
<style>
#header{
	padding-left:25px;
	width: auto;
}
#content {
    margin-left: 38px;
    margin-bottom: 30px;
    width: 666px;
}
#footer {
    width: 666px;
    margin-left: 35px;
}
</style>

<div id="content" >
<?php if (!empty($notice)) { ?>
	<div id="notice"><?php echo $notice;?></div>
<?php } ?>
<form action="./index.php?c=index&a=amftp_login" method="POST">
<dl> <dd>IP域名 / 端口: </dd><dt><input type="text" id="ftp_ip" name="ftp_ip" value="<?php echo $ftp_ip;?>" <?php echo $Config['OnlyLocal'] ? 'disabled=""' : '';?> class="input_text <?php echo $Config['OnlyLocal'] ? 'disabled' : '';?>" style="width:180px"/>
<input type="text" id="ftp_port" name="ftp_port" value="21" class="input_text" style="width:35px"/>
<span class="select_text " style="width:95px;border-radius:3px;height:22px;margin: 0px 2px -8px 8px;margin-bottom: -8px;">
<span class="hidden_border" style="">
<select name="ftp_pasv"style="width:85px;margin-top:3px;">
<option value="0">主动模式</option>
<option value="1">被动模式</option>
</select>
</span>
</span>
</dt> 
</dl>
<dl> <dd>用户名: </dd><dt><input type="text" name="ftp_user" value="<?php echo $ftp_user;?>"  class="input_text" style="width:230px"/> </dt> </dl>
<dl> <dd>密码: </dd><dt><input type="password" name="ftp_pass"  class="input_text" style="width:230px"/> </dt> </dl>
<input type="submit" name="submit" value=" 登录 " class="input_button"/>
</form>

</div>


<?php include('amftp_footer.php');?>