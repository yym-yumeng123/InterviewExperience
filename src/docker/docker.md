---
outline: deep
---


## Docker 概述

1. 基于`LXC(Linux Containers)`, 使用 AUFS
2. Docker 可以被称为轻量级虚拟化技术, 与传统的 VM 相比, 更轻量, 启动速度更快, 单台硬件可以跑成千上百容器
3. Docker 是跨平台的 `linux mac window`

**Docker 是一个能够把开发应用程序自动部署到容器的开源引擎**

1. 提供了一个简单、轻量的建模方式 `写时复制 copy-on-write`模型
2. 职责逻辑分离
3. 快速高效的开发周期
4. 鼓励使用面向服务的架构 => 推荐单个容器只运行一个应用程序或进程


**Docker 基本组成**

1. Docker 客户端和服务器, 也称为 Docker 引擎
2. Docker 镜像 image
   - 镜像是构建 Docker 世界的基石, 用户基于镜像来运行自己的容器
   - 可以把镜像当做容器的 "源代码"
   - 通过镜像可以创建多个容器
3. Docker 容器: container
   - 基于镜像启动起来的
   - 一个执行环境
   - 一系列标准的操作
4. Registry
   - 保存用户构建的镜像
   - 分为公有和私有 

**Docker 的技术组件**

- 一个原生的 Linux 容器格式, `libcontainer`
- Linux内核的命名空间(namespace), 用于隔离文件系统 进程和网络
- 文件系统隔离: 每个容器都有自己的 root 文件系统
- 进程隔离: 每个容器都运行在自己的进程环境中
- 网络隔离: 容器间的虚拟网络接口和IP地址都是分开的
- 资源隔离和分组: 将CPU和内存之类的资源独立分配给每个 Docker 容器
- 写时复制: 文件系统都是通过写时复制创建的, 意味文件系统是分层的、快速的、占用磁盘空间更小
- 日志: 容器产生的 STDOUT STDERR STDIN 这些IO流都会被收集记入日志
- 交互式 shell: 用户可以创建一个伪 tty 终端, 连接到 STDIN,为容器提供一个交互式终端


## run 的流程

`docker run hello-world`

- 开始 `docker run`, Docker 会检查本地是否存在 hello-world 镜像
   1. 如果有, 使用这个镜像
   2. 如果没有, 去 Docker Hub 上下载
      1. 如果找到, 下载这个镜像到本地, 使用这个镜像
      2. 如果没有, 报错, 说找不到


`Docker` 怎么工作的?

1. Docker 是一个 `CS` 架构的系统, Docker客户端只需要向Docker服务器或守护进程发出请求
2. 服务器或守护进程江湾城所有工作并返回结果


## Docker 常用命令

```shell
docker version # 显示版本信息
docker info    # 显示docker系统信息, 包括镜像和容器的数量
docker --help  # 帮助命令
```

## Docker 容器

1. 运行我们的第一个容器

- `-i` 保证容器中 `STDIN` 是开启的, 尽管我们没有附着到容器中, 持久的标准输入是交互式 `shell` 的半边天
- `-t` 告诉 Docker 为要创建的容器分配一个伪 tty 终端

```shell
# 告诉 docker 基于 ubuntu 创建容器
docker run  -i -t ubuntu /bin/bash
# Unable to find image 'ubuntu:latest' locally 
# latest: Pulling from library/ubuntu
# 7b1a6ab2e44d: Pull complete
# Status: Downloaded newer image for ubuntu:latest
```

2. 查看容器列表

```shell
# 正在运行的容器
docker ps
# -a 列出所有容器
docker ps -a
```

3. 容器命名

```shell
# 不使用默认的名字, 指定一个名称
# [a-zA-Z0-9_.-]
docker run --name new_container
```

4. 重启已经停止的容器

```shell
docker start 容器name
docker start 容器id

docker restart
```

5. 附着在容器上

```shell
# 附着在容器上会话上
docker attach 容器id
```

6. 在容器内部运行进程

```shell
# -it => -i -t
docker exec -it
```

7. 停止容器

```shell
docker stop 容器id
docker stop 容器name
```

8. 查看容器

```shell
# 会对容器进行详细的检查, 返回配置信息
docker inspect
```

9. 删除容器

```shell
docker rm
```

## Docker 镜像和仓库

Docker镜像是由文件系统叠加而成, 最低端是一个文件引导系统, 即 `bootfs`, Docker 用户永远不会和引导文件系统有交互.

1. 列出镜像 

```shell
# 本地镜像都保存在 Docker 宿主机的 /var/lib/docker 目录下
docker images

# 每个镜像仓库可以存放很多镜像, 拉取 Ubuntu 镜像
docker pull ubuntu:12.04
docker pull ubuntu:latest

# 运行一个带标签的 Docker 镜像
docker run -it --name new_container ubuntu:12.04 /bin/bash
```

2. 拉取镜像

```shell
# 拉取 mysql 镜像
docker pull mysql

# 查看 mysql 镜像
docker images mysql

# 拉取带标签的 mysql 镜像
docker pull mysql:8.2
```

3. 查找镜像

```shell
# 查找所有 Docker Hub 上公共的可用镜像
# NAME 仓库名 
# DESCRIPTION 镜像描述 
# STARS 用户评价 -反映一个镜像的受欢迎程度
# OFFICIAL 是否官方
# AUTOMATED 自动构建 -> 表示这横额镜像由 Docker Hub 自动构建流程创建的
docker search puppet 
```

4. 构建镜像

一般来说, 我们不是真正"创建"新镜像, 而是基于一个已有的基础镜像, 构建新镜像

```shell
# 1. 不推荐使用 docker commit 命令
docker commit

# 2. 使用 docker build 和 Dockerfile 文件
# 2.1 创建 Docker Hub 账号
docker login # 会完成 Docker Hub 账号的登录
docker logout # 退出
```

下面指令的含义: 

- Dockerfile 第一条指令必须是 `FROM` 指定一个已经存在的镜像, 这个镜像被称为`基础镜像`
- `MAINTAINER`指令, 这条指令会告诉 Docker 该镜像作者是谁以及电子邮件
- 两条 `RUN` 会在当前镜像中运行指定的命令
- `EXPOSE` 指令会告诉容器内的应用程序使用容器的指定端口
```Dockerfile
# 由一系列指令和参数组成, 每条指令, 都大写, 后面要跟参数

# 大体执行流程:
# Docker 从基础镜像运行一个容器
# 执行一条命令, 对容器进行修改
# 执行类似 docker commit 的操作, 提交一个新的镜像层
# Docker 再基于刚提交的镜像运行一个新容器
# 执行下一条指令, 直到所有指令都执行完毕
FROM ubuntu:14.04
MAINTAINER James Turnbull "james@example.com" 
RUN apt-get update && apt-get install -y nginx
RUN echo 'Hi, I am in your container' \
   > /usr/share/nginx/html/index.html
EXPOSE 80
```

```shell
# 执行 docker build, Dockerfile 中的所有指令都会被执行并且提交, 成功后返回一个新镜像
docker build
```

5. 从新镜像启动容器

运行一个容器时, 通过两种方法在宿主机上分配端口:

- Docker 可以在宿主机上随机选择一个位于 `32768~61000`的一个比较大的端口映射到容器的 `80` 端口
- 可以在 Docker 宿主机指定一个具体端口号来映射容器中的 80 端口  `-p 3000:80`

```shell
# -d 告诉 Docker 以分离的方式在后台运行
# -p 用来控制 Docker 在运行时应该公开哪些端口给宿主机
docker run -d -p 80 --name static_web James/static_web nginx -g "deamon off"
```

6. 删除镜像

```shell
docker rmi 镜像1 镜像2 ...
```

