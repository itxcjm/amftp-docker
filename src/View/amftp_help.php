<?php include('amftp_header.php');?>

<div id="content" style="width:auto;padding-left: 32px;line-height: 16px;">


<div style="">
<p><h2> » 关于断点极速上传</h2></p>
<p>AMFTP极速上传，上传基本可以达到满速，上传文件大小无限制。</p>
<p>AMFTP3.0新版本支持断点续传，上传大文件过程如有意外中断（或关闭网页）再次上传时仍然会继续。</p>
</div>

<br/>
<p><h2> » 关于主动被动模式</h2></p>
<p>主动模式：FTP服务器需开放21端口。<p>
<p>被动模式：FTP服务器需开放21端口与被动端口，如AMH面板的FTP软件被动端口范围为10100-10180。<p>
<p>FTP服务器本地防火墙开放端口与主机商安全组开放端口放行。</p>
<br/>

<br/>
<p><h2> » 关于本地连接与速度</h2></p>
<p>AMFTP默认使用127.0.0.1连接本地FTP进行管理，<p>
<p>建议上传AMFTP程序到FTP所在服务器线上运行，使用127.0.0.1内网连接响应快速。</p>
<p>如需连接非本地的FTP服务器，修改Amysql/Config.php配置文件OnlyLocal参数。<p>
<br/>

<p><h2> » 关于压缩包支持</h2></p>
<p>1) Linux 环境全面支持 zip tar gzip(tar.gz) 格式解压与压缩。<p>
<p>1) Windows 环境zip支持良好。</p>

<br/>

<p><h2> » 关于AMFTP</h2></p>
<p>AMFTP - 基于WEB在线FTP文件管理客户端。<p>
<p>AMFTP由AMH官方开发提供，属于AMH面板扩展模块之一。</p>
<p>2013-02-06 发布首个版本，获取最新稳定版本与新功能支持请关注官方网站。</p>

</div>


<?php include('amftp_footer.php');?>