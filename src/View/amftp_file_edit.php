<?php include('amftp_header.php');?>
<script>
var amftp_am_ftp_pwd = <?php echo json_encode($amftp_am_ftp_pwd);?>;
</script>
<style>
input {
	margin: 0px;
}
</style>
<div id="content">
<?php 
$pwd_arr = explode('/', trim($amftp_am_ftp_pwd));
$back_amftp_am_ftp_pwd = array_slice($pwd_arr, 0, -2);
$back_amftp_am_ftp_pwd = implode('/', $back_amftp_am_ftp_pwd);

$pwd_str = array();
foreach($pwd_arr AS $key => $val)
{
	if(empty($val)) continue;
	foreach($pwd_arr AS $k=> $v)
	{
		if(empty($v)) continue;
		$pwd_str[$key]['url'] .= "/{$v}";
		$pwd_str[$key]['name'] = $v;
		if($v == $val)
			break;
	}
} 
?>
	<div style="border:1px solid #DBDEE1;overflow: hidden;">
	<div class="title" style="">
		<input type="button" value="返回目录" onclick="window.location='./index.php?pwd=<?php echo $amftp_am_ftp_pwd;?>'" class="input_button"/> 

		<form action="./index.php" method="GET" style="display:inline;position:relative"  id="go_pwd_form">
			<span id="pwd_str" style="padding-right: 20px;top:-2px">/<?php foreach ($pwd_str AS $key => $val) { ?><a href="javascript:;" onclick="window.location='./index.php?pwd=<?php echo $val['url'];?>'"><?php echo $val['name'];?></a>/<?php }?><?php echo $_GET['file'];?> &nbsp; <img src="View/images/ico/<?php echo functions::Gicon($_GET['file'], '-');?>" style="margin-bottom:-3px;"/></span>
			<input type="text" value="<?php echo $amftp_am_ftp_pwd;?>" name="pwd" id="pwd" class="input_text" style="width:65%"/> 
			<input type="submit" value="跳转"  class="input_button"/>
		</form>
		<input type="button" value="刷新" onclick="window.location='<?php echo $_SERVER['REQUEST_URI'];?>'"  class="input_button"/> 
		<br />
	</div>

	<?php if ($file_type == 'txt') { ?>
	
		<script src="View/js/ace/ace.js"></script>
		<script src="View/js/ace/ext-language_tools.js"></script>
		<style type="text/css">
		#content .title {
		}
		</style>

		<form action="" id="file_content_form" method="POST" style="margin:0px">
				<pre id="file_content" name="file_content"><?php echo $file_content;?></pre>
				<div class="title" style="padding: 9px 17px;">
					<?php $character_arr = array('UTF-8' => 'utf8', 'CP936' => 'gbk', 'EUC-CN' => 'gb2312', 'BIG-5' => 'big5');?>
					编码： <input type="radio" onclick="character_set(this)" name="character" value="UTF-8" <?php echo ($character == 'UTF-8') ? 'checked=""' : '';?> id="utf8_general_ci"> <label for="utf8_general_ci" class="tip" title="国际通用编码">utf8</label> &nbsp;
					<input type="radio" onclick="character_set(this)" name="character" value="CP936" <?php echo ($character == 'CP936') ? 'checked=""' : '';?> id="gbk_chinese_ci"> <label for="gbk_chinese_ci" class="tip" title="中日韩汉字编码(包括繁体)" >gbk</label> &nbsp;
					<input type="radio" onclick="character_set(this)" name="character" value="EUC-CN" <?php echo ($character == 'EUC-CN') ? 'checked=""' : '';?> id="gb2312_chinese_ci"> <label for="gb2312_chinese_ci" class="tip" title="简体中文编码" >gb2312</label> &nbsp;
					<input type="radio" onclick="character_set(this)" name="character" value="BIG-5" <?php echo ($character == 'BIG-5') ? 'checked=""' : '';?> id="big5_chinese_ci"> <label for="big5_chinese_ci" class="tip" title="繁体中文编码" >big5</label> &nbsp
					<?php if(!in_array($character, array('UTF-8', 'CP936', 'EUC-CN', 'BIG-5'))) {?>
					<input type="radio" name="character" value="<?php echo $character;?>"  checked="" id="character_other"> <label for="character_other" ><?php echo !empty($character) ? $character : '未识别';?></label> &nbsp
					<?php } ?>
					&nbsp; &nbsp; 工具：<input type="button" value="查找" onclick="edit_tool('find')" class="input_button tip" title="Ctrl+F"> &nbsp; 
					<input type="button" value="替换" onclick="edit_tool('replace')" class="input_button tip" title="<?php echo stripos($_SERVER['HTTP_USER_AGENT'], 'macintosh') ? 'Ctrl+Option+F':'Ctrl+H';?>"> &nbsp; 
					<input type="button" value="转到行" onclick="edit_tool('gotoline')" class="input_button tip" title="Ctrl+L"> &nbsp; 

					<font color="red" id="character_t" style="display:none">您当前更换的编码字符集小于文件默认 <?php echo $character_arr[$character];?> 编码，可能导致文件内容丢失。</font>
					<br /><br />
					<input type="submit" value="保存" name="save"  class="input_button" style="padding:5px 10px"/> (Ctrl+S) &nbsp; <span id="span_notice"></span>
				</div>
				<input type="hidden" name="character_v" id="character_v" value="<?php echo $character;?>" />
				<input type="hidden" name="file_ctype" id="file_ctype" value="<?php echo $file_ctype;?>" />
				<input type="hidden" name="pwd_v" id="pwd_v" value="<?php echo $amftp_am_ftp_pwd;?>" />
				<input type="hidden" name="file_v" id="file_v" value="<?php echo $_GET['file'];?>" />
				<input type="hidden" name="charset_v" id="charset_v" value="<?php echo $_GET['charset'];?>" />
		</form>
		
		<script>
		file_content_form = G('file_content_form');
		if (file_content_form)
		{
			file_content_form.onsubmit = function()
			{
				var notice_id = 'span_notice';
				$('#'+notice_id).html(' <img src="./View/images/load.gif">');
				var data = 'file_content=' + encodeURIComponent(editor.getSession().getValue()) + '&character=' + encodeURIComponent($("input[name='character']:checked").val());
				Ajax.post('./index.php?c=index&a=file_edit&pwd=' + G('pwd_v').value + '&file=' + G('file_v').value + '&charset=' + G('charset_v').value + '&tag=' + Math.random(), data, function (msg){
					if (msg == 'success')
						$('#'+notice_id).html('<span id="success"> 保存成功 </span>');
					else
						$('#'+notice_id).html('<span id="success"> 保存失败 </span>');
					setTimeout(function(){
						$('#'+notice_id).html('');
					}, 1500);
				}, false, true)
				return false;
			}
		}
		ace.require("ace/ext/language_tools");
		editor = ace.edit("file_content");
	    editor.session.setMode("ace/mode/" + G('file_ctype').value);
	    editor.setTheme("ace/theme/chrome");
	    editor.setOptions({
	    	enableSnippets: true,
			enableLiveAutocompletion: true
		});
		editor.commands.addCommand({
		    name: "SaveFile",
		    bindKey: { win: "Ctrl-S", mac: "Command-S" },
		    exec: function(editor) { G('file_content_form').onsubmit(); },
		    scrollIntoView: "cursor",
		    multiSelectAction: "forEachLine"
		});
		editor.focus();
		editor.gotoLine(1, 0);
		$().ready(function(){
			var file_content_height = $(window).height()-$('#header').height()-$('#footer').height()-195;
			$('#file_content').height(file_content_height > 500 ? file_content_height : 500);
			if(editor)
				editor.resize();
		})
		</script>
	<?php } elseif ($file_type == 'img') { ?>
			<img src="<?php echo $_SERVER['REQUEST_URI'];?>&img=y" style="margin: 15px;max-width: 96%;"/>
			<div class="title" style="">
				<input type="button" value="新窗口打开" onclick="window.open('<?php echo $_SERVER['REQUEST_URI'];?>&img=y')" class="input_button" />&nbsp;
			</div>
	<?php } else {?>
			<p>文件不支持直接阅读，请返回列表下载文件查看。</p>
			<div class="title" style="">
				<input type="button" value="返回" onclick="window.location='./index.php?pwd=<?php echo $amftp_am_ftp_pwd;?>'" class="input_button" />
			</div>
	<?php } ?>
	</div>
</div>



<?php include('amftp_footer.php');?>