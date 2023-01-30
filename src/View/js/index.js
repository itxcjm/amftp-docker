/************************************************
 * Amysql FTP - AMFTP 3.0
 * amh.sh
 * Update:2021-01-15
 * 
 */
// AJAX请求
var Ajax={};
Ajax._xmlHttp = function(){ return new (window.ActiveXObject||window.XMLHttpRequest)("Microsoft.XMLHTTP");}
Ajax._AddEventToXHP = function(xhp,fun,isxml){
	xhp.onreadystatechange=function(){
		if(xhp.readyState==4&&xhp.status==200)
			fun(isxml?xhp.responseXML:xhp.responseText);
	}	
}
Ajax.get=function(url,fun,isxml,bool){
	var _xhp = this._xmlHttp();	
	this._AddEventToXHP(_xhp, fun || function(){} ,isxml);
	_xhp.open("GET",url,bool);
	_xhp.send(null);	
}
Ajax.post=function(url,data,fun,isxml,bool){	
	var _xhp = this._xmlHttp();	
	this._AddEventToXHP(_xhp, fun || function(){},isxml);
	_xhp.open("POST",url,bool);
	_xhp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	_xhp.send(data);
}
// 创建元素 
// attr 元素的属性
// CssOrHtml CSS或节点内容
var C = function (tag, attr, CssOrHtml)
{
	var o = (typeof(tag) != 'object') ? document.createElement(tag) : tag;
	if (attr == 'In')
	{
		if(CssOrHtml  && typeof(CssOrHtml) == 'object') 
		{
			if(CssOrHtml.length > 1 && CssOrHtml.constructor == Array )
			{
				for (x in CssOrHtml)
					if(CssOrHtml[x]) o.appendChild(CssOrHtml[x]);
			}
			else
			    o.appendChild(CssOrHtml);
		}
		else
			o.innerHTML = CssOrHtml;
		return o;
	}

	if (typeof(attr) == 'object')
	{
		for (k in attr )
			if(attr[k] != '') o[k] = attr[k];
	}

	if (typeof(CssOrHtml) == 'object')
	{
	    for (k in CssOrHtml )
			if(CssOrHtml[k] != '') o.style[k] = CssOrHtml[k];
	}
	return o;
}
var G = function (id) {return document.getElementById(id); }




// ***********************************************************
var submit_change_notice;	// 提示
var need_select_notice;		// 需要选择
var submit_change_form;		// 表单提交
var temp_tr;			// 临时TR
var t;					// TimeOut
var tr_arr = [];		// TR数组


var permissions_val;	// 权限值
var pv_item_arr = {};	// 权限数组
var pv_item_set;
var pv_select;
var pv_all_select;
var pv_all_unselect;

window.onload = function ()
{

	// AMFTP列表
	all_tr_arr = document.getElementsByTagName('tr');
	for (var k in all_tr_arr )
	{
		if (all_tr_arr[k].className && all_tr_arr[k].className.indexOf('tr') !== -1)
			tr_arr.push(all_tr_arr[k]);
	}

	for (var k in tr_arr )
	{
		(function (obj)
		{
			var input_arr = obj.getElementsByTagName('input');
			obj.select = input_arr[0];		// 选择框
			obj.charset = input_arr[1];		// 编码
			obj.can_open = input_arr[2];	// 是否可打开
			obj.permissions_number = input_arr[3];	// 权限值

			// 文件操作
			obj.action = {};
			var a_arr = obj.getElementsByTagName('a');
			for (var ak in a_arr )
			{
				if (a_arr[ak] && a_arr[ak].className && a_arr[ak].className.indexOf('action') != -1)
					obj.action[a_arr[ak].name] = a_arr[ak];
			}


			// 文件名
			obj.file_name = obj.getElementsByTagName('font')[0];
			obj.file_name.a = obj.file_name.getElementsByTagName('a')[0];	// 文件或目录链接
			obj.file_name.input = C('input', {'value':obj.file_name.a.name, 'className':'file_name_input'}, {'display':'none'});	// 重命名输入
			C(obj.file_name, 'In', obj.file_name.input);
			
			// 文件或目录链接打开
			obj.file_name.a.onclick = function ()
			{
				if (obj.can_open.value == 'n')	// 不能打开直接下载
				{
					obj.action['download'].onclick();
					return false;
				}
				else if (obj.select.name.indexOf('[d]') != -1)	// 以form方式打开目录以能保存记录
				{
					G('pwd').value = obj.select.value;
				    G('go_pwd_form').submit();
					return false;
				}
			}

			// 重命名保存
			obj.file_name.input.onblur = function ()
			{
				obj.file_name.a.style.display = '';
				obj.file_name.input.style.display = 'none';
				if(obj.file_name.input.value == obj.file_name.a.name) return false;
				var data = 'old_name=' + encodeURIComponent(obj.select.value) + '&new_name=' + encodeURIComponent(obj.file_name.input.value) + '&charset=' + obj.charset.value;
				Ajax.post('./index.php?c=index&a=file_rename&tag=' + Math.random(), data, function (msg){
					if (msg != '')
					{
						// 新值
						obj.file_name.a.name = obj.file_name.input.value;
						obj.file_name.a.innerHTML = htmlspecialchars(obj.file_name.a.name);
						if (obj.file_name.a.className == 'file')
							obj.file_name.a.href = './index.php?a=file_edit&charset=utf8&pwd=' + amftp_am_ftp_pwd + '&file=' + obj.file_name.a.name;
						else 
							obj.file_name.a.href = './index.php?pwd=' + amftp_am_ftp_pwd + obj.file_name.a.name + '/';
						
						// 新路径
						obj.charset.value = 'utf8';
						obj.select.value = msg;
					}
				}, false, true)
			}

			// Action List ******************************
			// 重命名 
			if(obj.action['rename'])
			{
				obj.action['rename'].onclick = function ()
				{
					if(obj.file_name.input.style.display != 'none') return false;
					obj.file_name.a.style.display = 'none';
					obj.file_name.input.style.display = '';
					obj.file_name.input.focus();
					return false;
				}
			}
			
			// 删除 
			if (obj.action['delete'])
			{
				obj.action['delete'].onclick = function ()
				{
					if (!confirm('确认删除：' + obj.select.value + ' ?'))
						return false;

					submit_change_notice = '';
					all_select({'checked':false});
					G('hidden_submit').name = 'delete';
					setTimeout(function ()
					{
						obj.select.checked = true;
						submit_change_form.submit();
						G('hidden_submit').name = '';
					}, 100)
					return false;
				}
			}
			
			// 下载
			if (obj.action['download'])
			{
				obj.action['download'].onclick = function ()
				{
					submit_change_notice = '';
					all_select({'checked':false});
					G('hidden_submit').name = 'download';
					setTimeout(function ()
					{
						obj.select.checked = true;
						submit_change_form.submit();
						G('hidden_submit').name = '';
					}, 100)
					return false;
				}
			}
			
			// 编辑
			if (obj.action['edit'])
			{
				obj.action['edit'].onclick = function ()
				{
					window.location = './index.php?a=file_edit&charset=' + obj.charset.value + '&pwd=' + amftp_am_ftp_pwd + '&file=' + obj.file_name.a.name;
					return false;
				}
			}
			// ******************************
			
			// 焦点
			obj.onmouseover = function ()
			{
				if(temp_tr == obj) clearTimeout(t);
				obj.className = obj.className + ' trmove';

				for (var ak in obj.action)
					obj.action[ak].className = 'action_ico ' + obj.action[ak].name + ' ' + obj.action[ak].name + '_hover';
			}
			
			// 离开
			obj.onmouseout = function ()
			{
				for (var ak in obj.action)
					obj.action[ak].className = 'action_ico ' + obj.action[ak].name;

				if(obj.select.checked) return;

				temp_tr = obj;
				t = setTimeout(function ()
				{
					obj.className = obj.className.replace(/ trmove/g, '');
				}, 2);
			}

			// 选择
			obj.select.onclick = function ()
			{
				this.checked = this.checked ? false : true;
			}

			// 点击
			obj.onclick = function ()
			{
				obj.select.checked = obj.select.checked ? false : true;
			}
			
		})(tr_arr[k])		
	}
	
	// *****************************************
	permissions_val = G('permissions_val');							// 权限值
	if (permissions_val)
	{
		pv_item_arr = getElementByClassName('pv_item', 'input');	// 权限选择
		pv_all_select = G('pv_all_select');							// 全选
		pv_all_unselect = G('pv_all_unselect');						// 全不选

		// 取得权限值
		pv_item_set = function ()
		{
			var pv_val_sum = 0;
			for (var k in pv_item_arr )
			{
				if (pv_item_arr[k].checked)
				{
					pv_val_sum += parseInt(pv_item_arr[k].value);
				}
			}
			// 值补0
			var pad = (4-parseInt((pv_val_sum + '').length));
			var pad_str = '';
			for (var i=0; i<pad; ++i )
				pad_str += '0';

			permissions_val.value = pad_str + pv_val_sum;
		}
		for (var k in pv_item_arr )
			pv_item_arr[k].onclick = pv_item_set;

		// 全选&全不选
		pv_select = function (status)
		{
			for (var k in pv_item_arr )
			{
				if (pv_item_arr[k].id.indexOf('s') == -1)
					pv_item_arr[k].checked = status;
			}
			pv_item_set();
			return false;
		}
		pv_all_select.onclick = function ()
		{
			return pv_select(true);
		}
		pv_all_unselect.onclick = function ()
		{
			return pv_select(false);
		}

		// 权限值改变
		permissions_val.onkeyup = function ()
		{
			var pv_object = [[0,0,0], [1,0,0], [0,1,0], [1,1,0], [0,0,1], [1,0,1], [0,1,1], [1,1,1]];
			var pv_group = ['s', 'u', 'g', 'p'];

			var pv_val = (permissions_val.value + '');
			var pv_len = pv_val.length;	

			// 值补0
			var pad = (4-parseInt(pv_len));
			if(pad < 0)
			{
				permissions_val.value = permissions_val.value.substr(0, 4);
				return false;
			}
			var pad_str = '';
			for (var i=0; i<pad; ++i )
				pad_str += '0';
			pv_val = pad_str + pv_val;

			var i = 3;
			for (; i>=0; --i )
			{
				// var pok = pv_val[i]; // ie6&7
				var pok = pv_val.substr(i, 1);
				var pv_object_tmp = pv_object[pok] ? pv_object[pok] : pv_object[0];		// 分别每组权限值, (7,5,5)
				G(pv_group[i]+'x').checked = pv_object_tmp[0];
				G(pv_group[i]+'w').checked = pv_object_tmp[1];
				G(pv_group[i]+'r').checked = pv_object_tmp[2];
			}
		}

	}


	// *****************************************
	// 主表单提交
	submit_change_form = G('submit_change_form');
	if (submit_change_form)
	{
		submit_change_form.onsubmit = function()
		{
			if (need_select_notice)
			{
				var select_sum = 0;
				for (var k in tr_arr )
				{
					if(tr_arr[k].select.checked)	
						++select_sum;
				}
				if (select_sum == 0)
				{
					alert('请先选择文件。');
					return false;		
				}

				if (submit_change_notice && submit_change_notice != '')
				{
					if (!confirm(submit_change_notice + ' (总' + select_sum + '项)' )) return false;	
				}
			}
			return true;
		}
		// 禁止回车提交(避免误操作)
		submit_change_form.onkeydown = function(e)
		{
			e = e ? e : window.event;
			if (e.keyCode == 13)
				return false;
		}
	}

	pwd_val = G('pwd');
	pwd_str_val = G('pwd_str');
	if(pwd_val)
	{
		pwd_val.onfocus = function()
		{
			pwd_str_val.style.display = 'none';
			this.style.textIndent = '0px';
		}
		pwd_val.onblur = function()
		{
			pwd_str_val.style.display = 'block';
			this.style.textIndent = '-1000px';
		}
		pwd_val.onchange = function()
		{
			pwd_str_val.style.display = 'none';
			this.style.textIndent = '0px';
			this.onblur = function(){}
		}
	}
}

// 获取class元素
var getElementByClassName = function (cls,elm) 
{  
	var arrCls = new Array();  
	var seeElm = elm;  
	var rexCls = new RegExp('(^|\\\\s)' + cls + '(\\\\s|$)','i');  
	var lisElm = document.getElementsByTagName(seeElm);  
	for (var i=0; i<lisElm.length; i++ ) 
	{  
		var evaCls = lisElm[i].className;  
		if(evaCls.length > 0 && (evaCls == cls || rexCls.test(evaCls))) 
			arrCls.push(lisElm[i]);  
	}  
	return arrCls;  
}

// 全反选 
function all_select(o)
{
	for (var k in tr_arr )
	{
		tr_arr[k].select.checked = o.checked;
		if (tr_arr[k].select.checked)
			tr_arr[k].className = tr_arr[k].className + ' trmove';
		else
		    tr_arr[k].className = tr_arr[k].className.replace(/ trmove/g, '');
	}
}



// 需要选择
function need_select()
{
	var exit = true;
	for (var k in tr_arr )
	{
		if(tr_arr[k].select.checked)	
		{
			exit = false;
			break;
		}
	}
	if (exit)
	{
		alert('请先选择文件。');
		return false;		
	}
	return true;
}

// 移动
function move_file(obj)
{
	if(!need_select()) return false;
	obj.disabled = true;
	copy_cancel();
	permissions_cancel();
	new_cancel();
	remote_download_cancel();
	change_submit('move_file_sub');
	G('move_block').style.display = 'inline-block';
	show_dir_dom = 'move_show_dir_dom';
	show_dir_input_dom = 'move_pwd';
	show_dir(amftp_am_ftp_pwd);
}
// 取消移动
function move_cancel()
{
	G('move_button').disabled = false;
	G('move_block').style.display = 'none';
}
// 复制 
function copy_file(obj)
{
	if(!need_select()) return false;
	obj.disabled = true;
	move_cancel();
	permissions_cancel();
	new_cancel();
	remote_download_cancel();
	change_submit('copy_file_sub');
	G('copy_block').style.display = 'inline-block';
	show_dir_dom = 'copy_show_dir_dom';
	show_dir_input_dom = 'copy_pwd';
	show_dir(amftp_am_ftp_pwd);
}
// 取消复制
function copy_cancel()
{
	G('copy_button').disabled = false;
	G('copy_block').style.display = 'none';
}


// 权限
function permissions_file(obj)
{
	if(!need_select()) return false;
	copy_cancel();
	move_cancel();
	new_cancel();
	remote_download_cancel();
	change_submit('per_file_sub');
	obj.disabled = true;
	G('permissions_block').style.display = 'inline-block';
	G('permissions_val').focus();

	var Pnumber = 0;
	for (var k in tr_arr)
	{
		if(tr_arr[k].select.checked)
			Pnumber = tr_arr[k].permissions_number.value;
	}
	permissions_val.value = Pnumber;
	permissions_val.onkeyup();

}
// 取消权限
function permissions_cancel()
{
	G('permissions_button').disabled = false;
	G('permissions_block').style.display = 'none';
}

// 新建
function new_file(obj)
{
	copy_cancel();
	move_cancel();
	permissions_cancel();
	remote_download_cancel();
	change_submit('new_file_sub');
	obj.disabled = true;
	G('new_block').style.display = 'inline-block';
	G('new_name').focus();

}
// 取消新建
function new_cancel()
{
	G('new_button').disabled = false;
	G('new_block').style.display = 'none';
}
// 远程下载
function remote_download(obj)
{
	copy_cancel();
	move_cancel();
	permissions_cancel();
	new_cancel();
	change_submit('rd_file_sub');
	obj.disabled = true;
	G('remote_download_block').style.display = 'inline-block';
	G('remote_file').focus();
}
// 取消远程下载
function remote_download_cancel()
{
	G('remote_download_button').disabled = false;
	G('remote_download_block').style.display = 'none';
}

// 改变submit
function change_submit(name)
{
	G('del_file_sub').type = 'button';
	G('move_file_sub').type = 'button';
	G('copy_file_sub').type = 'button';
	G('per_file_sub').type = 'button';
	G('new_file_sub').type = 'button';
	G('rd_file_sub').type = 'button';
	G('zip_file_sub').type = 'button';
	G('unzip_file_sub').type = 'button';
	G(name).type = 'submit';
}
// 显示目录
var show_dir = function (dir)
{
	G(show_dir_input_dom).value = dir;
	G(show_dir_dom).innerHTML = '<p><img src="View/images/loading.gif" style="padding:10px 29px 0px 5px;"/></p>';
	Ajax.get('./index.php?c=index&a=index_list&show_dir=' + dir,function (msg)
	{
		var data = eval('(' + msg + ')');
		var str_arr = [];
		var str = '<p>.. <a href="javascript:;" onclick="show_dir(\'' + data.back + '\')">上级</a></p>';
		str_arr.push(str);
		for (var k in data.dir )
		{
			var str = '<p><img src="View/images/ico/folder.png"/> <a href="javascript:;" onclick="show_dir(\'' + dir + data.dir[k] + '/\')">' + data.dir[k] + '</a></p>';
			str_arr.push(str);
		}
		for (var k in data.file )
		{
			var str = '<p href="javascript:;">' + data.file[k] + '</p>';
			str_arr.push(str);
		}
		G(show_dir_dom).innerHTML = str_arr.join('');
	}, false, true)
}

// 转实体
function htmlspecialchars(str)  
{  
	str = str.replace(/&/g, '&amp;');
	str = str.replace(/</g, '&lt;');
	str = str.replace(/>/g, '&gt;');
	str = str.replace(/"/g, '&quot;');
	str = str.replace(/'/g, '&#039;');
	return str;
}
// 编码设置
var character_set = function(obj)
{
	var character_arr = {"UTF-8":5,"EUC-CN":3,"BIG-5":3,"CP936":4};
	if(G('character_v').value == '' || character_arr[G('character_v').value] == '' || G('file_content').value == '') 
		return;

	if(obj.value != G('character_v').value && character_arr[obj.value] <= character_arr[G('character_v').value])
		alert($('#character_t').html());
}
// 编辑工具
var edit_tool = function(type)
{
	if(type == 'find' || type == 'replace')
	{
		if(!editor.searchBox || !editor.searchBox.active || editor.action_name != type)
			editor.execCommand(type);
		else
			editor.searchBox.hide();
		editor.action_name = type;
	}
	else
		editor.execCommand(type);
}


// 上传
var upload_file = function (obj)
{
	if(obj.disabled) return;
	obj.style.display = 'none';
	obj.disabled = true;

	var upload_block = G('upload_block');
	upload_block.style.display = 'inline-block';

	AmfileUploader_run();
}
//***************************************************
var AmfileUploader_run = function() {
    var AmfileUploader;
    function UpTime() {
        this.list = [];
    }
    var UpTimeObject = new UpTime(); 
    var chunkSize = 1024*1024*2;
    var progress_now = null;

     // *********************************************
     WebUploader.Uploader.register({
        "before-send": "beforeSend"  
    }, {
        beforeSend: function (block) {
        	// console.log('AMFile:fileCheck');
            var task = WebUploader.Deferred();  
            if(!$('#continued_dom')[0].checked)
            {
                task.resolve();
                return task.promise();
            }
            $.ajax({
                type: "POST",
                url: './index.php?c=index&a=file_upload&file_check=y&amftp_pwd=' + amftp_am_ftp_pwd,
                data: {
                    name: block.file.name,
                    size: block.file.size,
                    chunk: block.chunk,
                    chunks:block.chunks,
                    bsize: block.end - block.start
                },
                cache: false,
                async: false,  
                timeout: 1000,  
                dataType: "json"
            }).then(function (data, textStatus, jqXHR) {
                if(data.status == '1')
                {
                	var percentage = block.end/block.file.size;
        			progress_now.setUploadState(3);
			        progress_now.SecondsRemaining.innerHTML = '断点上传加速中...请您稍等';
			        progress_now.setProgress((percentage*100-0.01).toFixed(2));          // 设置上传百分比
                	task.reject();
                }
                else
                	task.resolve();
            }, function (jqXHR, textStatus, errorThrown) { 
                task.resolve();
            });
            task.resolve();  
            return task.promise(); 
        }
    });

    AmfileUploader = WebUploader.create({
        resize: false,
        chunked: true,
        chunkSize: chunkSize,
        chunkRetry: 3,
        threads: 1,
        runtimeOrder: 'html5',
        auto: true,
        server: './index.php?c=index&a=file_upload&file_put=y&amftp_pwd=' + amftp_am_ftp_pwd,
        pick: '#picker'
    });

    AmfileUploader.on( 'fileQueued', function( file ) {
        // console.log('AMFile:fileQueued');
        var p = new AmfileUploader.progress(file, 'amfile_uplist');
        progress_now = p;
        p.setShow(true);
        p.setUploadState(2);
        $('#amfile_upload_complete').html('');
    });

    AmfileUploader.on( 'uploadProgress', function( file, percentage ) {
        // console.log('AMFile:uploadProgress');
        var progress = new AmfileUploader.progress(file, 'amfile_uplist');
        progress.setUploadState(3);

        // 更新速度与时间
        var name_arr = file.id.split('_');
        var now_id = parseInt(name_arr[2]);     // 获得当前ID
        var upo = {};                           // 每进程信息
        upo.now_time = (new Date()).valueOf();
        upo.bytesLoaded = file.size*percentage;

        var bytesTotal = file.size;
        var bytesLoaded = upo.bytesLoaded;
        
        if (typeof(UpTimeObject.list[now_id]) != 'object')
        {
            UpTimeObject.list[now_id] = {};
            UpTimeObject.list[now_id].Progress = [];
            UpTimeObject.list[now_id].start_time = upo.now_time;
            UpTimeObject.list[now_id].bytesTotal = bytesTotal;
        }

        var p_l = UpTimeObject.list[now_id].Progress.length;
        if(UpTimeObject.list[now_id].Progress[p_l-1] && UpTimeObject.list[now_id].Progress[p_l-1].bytesLoaded == upo.bytesLoaded)
            return;

        UpTimeObject.list[now_id].Progress.push(upo);

        var p_l = UpTimeObject.list[now_id].Progress.length;
        if (p_l >= 2)
        {
            var use_time = parseInt(upo.now_time) - parseInt(UpTimeObject.list[now_id].Progress[p_l-2].now_time);       // 使用时间
            var up_size = parseInt(upo.bytesLoaded) - parseInt(UpTimeObject.list[now_id].Progress[p_l-2].bytesLoaded);  // 上传了多少

            progress.setTimeProgress(use_time, up_size, bytesLoaded, bytesTotal);   // 时间进行信息更新
        }
        progress.setProgress((percentage*100).toFixed(2));          // 设置上传百分比
        // console.log(percentage*100-0.01);
    });
    AmfileUploader.on( 'uploadAccept', function( obj, data ) {
        // console.log('AMFile:uploadAccept');
        // 已经上传
        var name_arr = obj.file.id.split('_');
        var now_id = parseInt(name_arr[2]);     // 获得当前ID
        if(!UpTimeObject.list[now_id])
        {
            var progress = new AmfileUploader.progress(obj.file, 'amfile_uplist');
            if(obj.chunk == obj.chunks -1)
           		progress.setComplete(1);  // 上传完成
            if(data.status == '0')
            {
            	progress.SecondsRemaining.innerHTML = '<font color="red">上传失败。</font>';
            	return;
            }
            return;
        }

        var last_key = UpTimeObject.list[now_id].Progress.length - 1;
        var use_time = (UpTimeObject.list[now_id].Progress[last_key].now_time - UpTimeObject.list[now_id].start_time);

        var progress = new AmfileUploader.progress(obj.file, 'amfile_uplist');
        if(data.status == '0')
        {
            progress.SecondsRemaining.innerHTML = '<font color="red">上传失败。</font>';
        	return;
        }
        if(obj.chunk == obj.chunks -1)
        	progress.setComplete(use_time);  // 上传完成
    });

    AmfileUploader.on( 'uploadError', function( file ) {
        // console.log('AMFile:uploadError');
         var progress = new AmfileUploader.progress(file, 'amfile_uplist');
         progress.percentSpan.innerHTML = 'AMFile UploadError.';
    });

    AmfileUploader.on( 'uploadFinished', function( file ) {
        // console.log('AMFile:uploadFinished');
        $('#amfile_upload_complete').html('<p>已上传完成。  » <a href="./index.php?pwd=' + amftp_am_ftp_pwd +'">刷新列表</a></p>');
    });

    // 相关配置
    AmfileUploader.CustomSettings = {
            // progress object
            container_css: "progressobj",
            icoNormal_css: "IcoNormal",
            icoWaiting_css: "IcoWaiting",
            icoUpload_css: "IcoUpload",
            fname_css : "fle ftt",
            state_div_css : "statebarSmallDiv",
            state_bar_css : "statebar",
            percent_css : "ftt",
            href_delete_css : "ftt a",

            // 页面中不应出现以"cnt_"开头声明的元素
            s_cnt_progress: "cnt_progress",
            s_cnt_span_text : "fle",
            s_cnt_progress_statebar : "cnt_progress_statebar",
            s_cnt_progress_percent: "cnt_progress_percent",
            s_cnt_progress_uploaded : "cnt_progress_uploaded",
            s_cnt_progress_size : "cnt_progress_size"
    },

    // 上传进程
    AmfileUploader.progress = function (file, targetid) {
        //定义文件处理标识
        this.ProgressId = file.id;
        
        //获取当前容器对象
        this.fileProgressElement = document.getElementById(file.id);

        if (!this.fileProgressElement)
        {
            //container
            this.fileProgressElement = document.createElement("div");
            this.fileProgressElement.id = file.id;
            this.fileProgressElement.className = AmfileUploader.CustomSettings.container_css;

            //state button
            this.stateButton = document.createElement("input");
            this.stateButton.type = "button";
            this.stateButton.className = AmfileUploader.CustomSettings.icoWaiting_css;
            this.fileProgressElement.appendChild(this.stateButton);

            //filename
            this.filenameSpan = document.createElement("span");
            this.filenameSpan.className = AmfileUploader.CustomSettings.fname_css;
            this.filenameSpan.appendChild(document.createTextNode(file.name));
            this.filenameSpan.appendChild(document.createTextNode(' (' + this.formatUnits(file.size) + ')'));
            this.fileProgressElement.appendChild(this.filenameSpan);

            //statebar div
            this.stateDiv = document.createElement("span");
            this.stateDiv.className = AmfileUploader.CustomSettings.state_div_css;
            this.stateBar = document.createElement("span");
            this.stateBar.className = AmfileUploader.CustomSettings.state_bar_css;
            this.stateBar.innerHTML = "&nbsp;";
            this.stateBar.style.width = "0%";
            this.stateDiv.appendChild(this.stateBar);
            this.fileProgressElement.appendChild(this.stateDiv);

            //span percent
            this.percentSpan = document.createElement("span");
            this.percentSpan.className = AmfileUploader.CustomSettings.percent_css;
            this.percentSpan.style.marginTop = "10px";
            this.percentSpan.innerHTML = "等待上传中...";
            this.fileProgressElement.appendChild(this.percentSpan);

            //span velocity
            this.velocity = document.createElement("span");
            this.velocity.className = AmfileUploader.CustomSettings.percent_css;
            this.velocity.style.marginTop = "10px";
            this.velocity.innerHTML = "";
            this.fileProgressElement.appendChild(this.velocity);


            //span Seconds remaining
            this.SecondsRemaining = document.createElement("span");
            this.SecondsRemaining.className = AmfileUploader.CustomSettings.percent_css;
            this.SecondsRemaining.style.marginTop = "10px";
            this.SecondsRemaining.innerHTML = "";
            this.fileProgressElement.appendChild(this.SecondsRemaining);

            //delete href
            this.hrefSpan = document.createElement("a");
            this.hrefSpan.className = AmfileUploader.CustomSettings.href_delete_css;
            this.hrefControl = document.createElement("a");
            this.hrefControl.href = 'javascript:;';
            this.hrefControl.innerHTML = "删除";
            this.hrefControl.onclick = function()
            {
                AmfileUploader.cancelFile(file);
                document.getElementById(targetid).removeChild(document.getElementById(file.id));
            }
            this.hrefSpan.appendChild(this.hrefControl);
            this.fileProgressElement.appendChild(this.hrefSpan);

            //insert container
            document.getElementById(targetid).appendChild(this.fileProgressElement);
        }
        else
        {
            this.reset();
        }
    }
    // 控制上传进度对象是否显示
    AmfileUploader.progress.prototype.setShow = function(show)
    {
        this.fileProgressElement.style.display = show ? "" : "none";
    }
    // 设置状态按钮状态
    AmfileUploader.progress.prototype.setUploadState = function(state)
    {
        switch(state)
        {
            case 1:
                //初始化完成
                this.stateButton.className = AmfileUploader.CustomSettings.icoNormal_css;
                break;
            case 2:
                //正在等待
                this.stateButton.className = AmfileUploader.CustomSettings.icoWaiting_css;
                break;
            case 3:
                //正在上传
                this.stateButton.className = AmfileUploader.CustomSettings.icoUpload_css;
        }
    }
    // 时间进行信息更新
    AmfileUploader.progress.prototype.setTimeProgress = function(use_time, up_size, bytesLoaded, bytesTotal)
    {
        var s_b = use_time == 0 ? up_size : up_size / use_time * 1000;  // 一秒上传多少b

        var time_str;
        if(s_b > 1024*1024)
            time_str = (s_b/(1024*1024)).toFixed(2) + 'MB/S';
        else
            time_str = (s_b/1024).toFixed(2) + 'KB/S';
        this.velocity.innerHTML = time_str;

        var SecondsRemaining = (bytesTotal-bytesLoaded)/s_b;    // 上传完毕还需多少秒
        if (SecondsRemaining > 3600)
            time_str = (SecondsRemaining/3600).toFixed(2) + '小时';
        else if (SecondsRemaining > 60)
            time_str = (SecondsRemaining/60).toFixed(2) + '分钟';
        else
            time_str = (SecondsRemaining).toFixed(2) + '秒';

        this.SecondsRemaining.innerHTML = '估计还需:' + time_str;
    }
    // 设置上传进度
    AmfileUploader.progress.prototype.setProgress = function(percent)
    {
        this.stateBar.style.width = percent + "%";
        this.percentSpan.innerHTML = percent + "%";
        if (percent == 100)
        {
            this.hrefSpan.style.display = "none";
            this.SecondsRemaining.innerHTML = '文件保存中...';
        }
    }
    // 恢复默认设置
   AmfileUploader.progress.prototype.reset = function()
    {
        this.stateButton = this.fileProgressElement.childNodes[0];
        this.fileSpan = this.fileProgressElement.childNodes[1];
        this.stateDiv = this.fileProgressElement.childNodes[2];
        this.stateBar = this.stateDiv.childNodes[0];
        this.percentSpan = this.fileProgressElement.childNodes[3];
        this.velocity = this.fileProgressElement.childNodes[4];
        this.SecondsRemaining = this.fileProgressElement.childNodes[5];
        this.hrefSpan = this.fileProgressElement.childNodes[6];
        this.hrefControl = this.hrefSpan.childNodes[0];
    }
    // 上传完成
    AmfileUploader.progress.prototype.setComplete = function(use_time)
    {
        this.stateButton.className = AmfileUploader.CustomSettings.icoNormal_css;
        this.hrefSpan.style.display = "none";

        use_time = use_time / 1000;
        if (use_time > 3600)
            time_str = (use_time/3600).toFixed(2) + '小时';
        else if (use_time > 60)
            time_str = (use_time/60).toFixed(2) + '分钟';
        else
            time_str = (use_time).toFixed(2) + '秒';

        this.SecondsRemaining.innerHTML = '用时:' + time_str;
    }
    // 计算文件大小的文字描述,传入参数单位为字节
    AmfileUploader.progress.prototype.formatUnits = function (size)
    {    
        if (isNaN(size) || size == null)
            size = 0;

        if (size <= 0) return size + "bytes";

        var t1 = (size / 1024).toFixed(2);
        if (t1 < 0)
            return "0KB";

        if (t1 > 0 && t1 < 1024)
            return t1 + "KB";

        var t2 = (t1 / 1024).toFixed(2);
        if (t2 < 1024)
            return t2 + "MB";

        return (t2 / 1024).toFixed(2) + "GB";
    }

}

