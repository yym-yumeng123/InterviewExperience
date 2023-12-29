---
outline: deep
---


## Docker 概述

Docker 类似于集装箱; 互相隔离

容器技术之前, 都是使用虚拟机技术, 虚拟机也是虚拟化技术, Docker 容器技术, 也是一种虚拟化技术, 但比较轻巧, 启动非常快

- 虚拟机: 资源占用多; 冗余步骤多; 启动慢
- Docker: 容器内的应用运行在 宿主机, 容器没有自己的内核; 每个容器互相隔离, 都有自己的文件系统, 互不影响
   - 打包镜像发布测试, 一键运行
   - 环境一致


**Docker 基本组成**

- 镜像 iamge
  - 镜像image 类似一个模板, 可以通过这个模板创建容器服务
  - 通过镜像可以创建多个容器
- 容器: container
  - 独立运行一个或者一个组应用, 通过镜像来创建
- 仓库 repository
  - 存放镜像的地方
  - 公有仓库、私有仓库


## run 的流程

`docker run hello-world`

- 开始 `docker run`, Docker 会在本机查找镜像
   1. 如果有, 使用这个镜像
   2. 如果没有, 去 Docker Hub 上下载
      1. 如果找到, 下载这个镜像到本地, 使用这个镜像
      2. 如果没有, 报错, 说找不到


`Docker` 怎么工作的?

1. Docker 是一个 `CS` 结构的系统, Docker的守护进程运行在主机上, 通过 Socket从客户端访问
2. DockerServer 接收到 Client 的指令, 会执行这个命令


## Docker 常用命令

```shell
docker version # 显示版本信息
docker info    # 显示docker系统信息, 包括镜像和容器的数量
docker --help  # 帮助命令
```

## 镜像命令