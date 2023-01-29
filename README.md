# Amftp docker image
Docker container for Amftp
##  [Official Website](https://amh.sh/amftp.htm)
## Introduce
AMFTP is a safe, efficient and powerful online FTP management client (open source and free). Using AMFTP can manage the file data of the FTP server online. Online operation can avoid time-consuming operations such as switching back and forth of the local client's FTP instructions, greatly improve the response time of FTP operations, and realize the functions of local clients' inability to copy FTP files, remote download, file decompression, data compression, etc.

AMFTP是一个安全高效、功能强大的在线FTP管理客户端 (开源免费)，使用AMFTP可线上对FTP服务器文件数据进行管理，线上运行可避免本地客户端FTP指令来回切换等操作耗时， 可大幅提高FTP操作响应时间、与实现本地客户端无法复制FTP文件、远程下载、文件解压、数据压缩等功能。
## Usage

    docker pull itxcjm/amftp:1.0

    docker run -p 81:80 --name amftp itxcjm/amftp:1.0
