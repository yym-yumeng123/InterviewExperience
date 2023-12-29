---
outline: deep
---

## 网络概述

TCP/IP概念层模型: `应用层 传输层 网络层 链路层`

1. 应用层
   - 功能: `文件传输 电子邮件 文件服务 虚拟终端`
   - TCP/IP协议: `TFTP HTTP FTP SMTP DNS Telnet`
2. 传输层
   - 功能: 提供端对端的接口
   - TCP/IP协议族: `TCP UDP`
3. 网络层
   - 功能: 为数据包选择路由
   - TCP/IP协议族: `IP ICMP RIP OSPF IGMP`
4. 链路层
   - 功能: 传输有地址的帧以及错误检测功能; 以二进制数据形式在屋里媒体上传输数据
   - TCP/IP协议族: `SLIP CSLIP ARP MTU`; `ISO2110 IEEE802` 

## Go TCP Client & Server

