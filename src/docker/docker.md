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
- Linux 内核的命名空间(namespace), 用于隔离文件系统 进程和网络
- 文件系统隔离: 每个容器都有自己的 root 文件系统
- 进程隔离: 每个容器都运行在自己的进程环境中
- 网络隔离: 容器间的虚拟网络接口和 IP 地址都是分开的
- 资源隔离和分组: 将 CPU 和内存之类的资源独立分配给每个 Docker 容器
- 写时复制: 文件系统都是通过写时复制创建的, 意味文件系统是分层的、快速的、占用磁盘空间更小
- 日志: 容器产生的 STDOUT STDERR STDIN 这些 IO 流都会被收集记入日志
- 交互式 shell: 用户可以创建一个伪 tty 终端, 连接到 STDIN,为容器提供一个交互式终端

## run 的流程

`docker run hello-world`

- 开始 `docker run`, Docker 会检查本地是否存在 hello-world 镜像
  1.  如果有, 使用这个镜像
  2.  如果没有, 去 Docker Hub 上下载
      1. 如果找到, 下载这个镜像到本地, 使用这个镜像
      2. 如果没有, 报错, 说找不到

`Docker` 怎么工作的?

1. Docker 是一个 `CS` 架构的系统, Docker 客户端只需要向 Docker 服务器或守护进程发出请求
2. 服务器或守护进程江湾城所有工作并返回结果

## Docker 常用命令

```shell
docker version # 显示版本信息
docker info    # 显示docker系统信息, 包括镜像和容器的数量
docker --help  # 帮助命令
```

## Docker 容器

### 运行我们的第一个容器

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

### 查看容器列表

```shell
# 正在运行的容器
docker ps
# -a 列出所有容器
docker ps -a
```

### 容器命名

```shell
# 不使用默认的名字, 指定一个名称
# [a-zA-Z0-9_.-]
docker run --name new_container
```

### 重启已经停止的容器

```shell
docker start 容器name
docker start 容器id

docker restart
```

### 附着在容器上

```shell
# 附着在容器上会话上
docker attach 容器id
```

### 在容器内部运行进程

```shell
# -it => -i -t
docker exec -it
```

### 停止容器

```shell
docker stop 容器id
docker stop 容器name
```

### 查看容器

```shell
# 会对容器进行详细的检查, 返回配置信息
docker inspect
```

### 删除容器

```shell
docker rm
```

## Docker 镜像

Docker 镜像是由文件系统叠加而成, 最低端是一个文件引导系统, 即 `bootfs`, Docker 用户永远不会和引导文件系统有交互.

`rootfs(root file system)` 在 `bootfs` 上, 包含的就是典型 Linux 系统中的 `/dev /proc /bin /etc` 等标准目录和文件. 就是各种不用操作系统发行版, 比如 Ubuntu Centos 等等

### 列出镜像

```shell
# 本地镜像都保存在 Docker 宿主机的 /var/lib/docker 目录下
docker images

# 每个镜像仓库可以存放很多镜像, 拉取 Ubuntu 镜像
docker pull ubuntu:12.04
docker pull ubuntu:latest

# 运行一个带标签的 Docker 镜像
docker run -it --name new_container ubuntu:12.04 /bin/bash
```

### 拉取镜像

```shell
# 拉取 mysql 镜像
docker pull mysql

# 查看 mysql 镜像
docker images mysql

# 拉取带标签的 mysql 镜像
docker pull mysql:8.2
```

### 查找镜像

```shell
# 查找所有 Docker Hub 上公共的可用镜像
# NAME 仓库名
# DESCRIPTION 镜像描述
# STARS 用户评价 -反映一个镜像的受欢迎程度
# OFFICIAL 是否官方
# AUTOMATED 自动构建 -> 表示这横额镜像由 Docker Hub 自动构建流程创建的
docker search puppet
```

### 构建镜像

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

### 从新镜像启动容器

运行一个容器时, 通过两种方法在宿主机上分配端口:

- Docker 可以在宿主机上随机选择一个位于 `32768~61000`的一个比较大的端口映射到容器的 `80` 端口
- 可以在 Docker 宿主机指定一个具体端口号来映射容器中的 80 端口 `-p 3000:80`

```shell
# -d 告诉 Docker 以分离的方式在后台运行
# -p 用来控制 Docker 在运行时应该公开哪些端口给宿主机
docker run -d -p 80 --name static_web James/static_web nginx -g "deamon off"
```

### 删除镜像

```shell
docker rmi 镜像1 镜像2 ...
```

## 其它常用命令

### 后台启动容器

```shell
docker run -d 镜像名
```

### 查看日志

```shell
# -t show timestamps 日志加时间
# -f --follow Fllowing log output 保留打印窗口
# -n --tail 10  看 10条日志
docker logs -f -t --tail 10 容器
docker logs -tf 容器
```

### 查看容器中的进程信息

```shell
docker top 容器
#UID     PID     PPID     C      STIME   TTY    TIME       CMD
# 999     1560    1540     0      11:13   ?      00:00:02   mysqld --character-set-server=utf8mb4 --collation-server=utf8mb4_unicode_ci
```

### 查看镜像元数据

```shell
# -f --format
# -s --size
docker inspect --help

docker inspect 容器id
```

### 进入当前正在运行的容器

```shell
# exec 进入容器开启一个新的终端, 在里面操作
docker exec -it 容器id /bin/bash

# 进入容器正在执行的终端, 不会启动新的终端
docker attach 容器id
```

### 从容器内拷贝文件到宿主机

```shell
docker cp 容器id:容器内路径 目的地主机路径

docker cp 4172a23b:/home/test.html /home
```

### 安装 nginx

```shell
docker search nginx
docker pull nginx

# -p 把容器内的接口 映射到 宿主机接口
docker docker run -d --name nginx01 -p 3344:80 nginx

curl localhost:3344

docker exec -it nginx01 /bin/bash # 进入容器
```

### 安装 tomcat

```shell
# --rm 停止容器就删
docker run -it --rm tomcat:9.0
docker run -it --rm -p 8888:8080 tomcat:9.0
```

## 容器数据卷

### 什么是容器数据卷

日常开发使用容器的过程中,可能会存储一些`数据`, 如果数据都放在容器中, 我们不小心把容器删除了, 数据就会丢失! 我们需要数据可以持久化, 怎么做?

容器之间有一个数据共享的技术, Docker 容器中产生的数据, 同步到本地, 这就是`卷技术, 目录的挂载`, 将我们容器的目录, 挂载到宿主机上

数据卷是为了容器的持久化和同步操作, 容器间也是可以数据共享的

### 使用数据卷

```shell
# 指定路径挂载
docker -v 主机目录:容器内目录

# 查看容器的信息
docker inspect 容器

#"Mounts": [
#    {
#        "Type": "volume",
#        "Name": "381eb0d22b4b8f17ec9582dc501866f8c4dd7882b5fabd738a75935b16f34d09",
         # 宿主机地址
#        "Source": "/var/lib/docker/volumes/381eb0d22b4b8f17ec9582dc501866f8c4dd7882b5fabd738a75935b16f34d09/_data",
         # docker 容器内地址
#        "Destination": "/var/lib/mysql",
#        "Driver": "local",
#        "Mode": "",
#        "RW": true,
#        "Propagation": ""
#    }
#],

# create 创建一个卷
# inspect 卷的信息
# ls 卷的列表
# prune
# rm
docker volume --help
```

### 安装 mysql

```shell
# 查找镜像
docker search mysql

# 运行容器
# -d 后台运行
# -p 端口映射
# -v 数据挂载
# -e mysql 配置
# --name 容器名字
docker run -d -p 3310:3306 -v /c:/Users/18026/Desktop/mysql/data:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=123456 --name yym mysql
```

### 具名和匿名挂载

```shell
# 匿名挂载 -v 只写了容器内的路径, 没有写容器外的路径
docker -v 容器内路径
# DRIVER: local  VOLUME NAME:   6cb7245b9d35fc99f56c423c8694d46a3b9ee73331559fbb71149c697203226e


# 具名挂载 可以方便的找到我们的卷
# 名字
docker -v 名字:/etc/nginx nginx # local     gems
# 目录
docker -v /名字:/etc/nginx nginx


docker volume ls # 查看卷的列表
docker volume inspect 名字
```

```md
通过 -v 容器内路径: ro rw 改变读写权限

ro readonly 只读
rw readwrite 可读可写

docker -v /名字:/etc/nginx:ro nginx
docker -v /名字:/etc/nginx:rw nginx
```

## Dockerfile

Dockerfile 就是用来构建 docker 镜像的构建文件

- 创建一个 Dockerfile 文件
- `docker build` 构建成为一个镜像
- 成功后, 启动自己的容器 `docker run`
- `docker push` 发布镜像

```dockerfile
# 通过这个脚本生成镜像, 镜像是一层一层的,

# 指令 FROM VOLUME CMD 全大写
# 后面跟参数
FROM centos

# 匿名挂载, 通过 docker inspect containerId 可以查看宿主机地址的
# 如果没有构建, 可以手动镜像挂载 -v 卷名:容器内路径
VOLUME ["volume01", "volume02"]

CMD echo "--end--"
CMD /bin/bash
```

```shell
# . 当前目录
# -t --tag 'name:tag' format 自己定义的镜像名和版本
# -f --file Default is 'PATH/Dockerfile
docker build -f dockerfile -t /yym/centos:1.0 .
```

### Dockerfile 构建过程

1. 每个保留关键字(指令)都是大写字母
2. 执行从上到下
3. `#` 表示注释
4. 每个指令都会创建提交一个新的镜像层, 并提交

```Dockerfile
# 指令

# 基础镜像 (镜像的妈妈是谁)
FROM
# 维护镜像的作者信息 姓名 + 邮箱
MAINTAINER
# 镜像构建时运行的命令
RUN
# 用来将构建环境下的文件和目录复制到镜像中.
ADD
# 用来从镜像创建一个新容器时, 在容器内部设置一个工作目录,ENTRYPOINT CMD 指定的程序会在这个目录下运行
WORKDIR
# 用来向基于镜像创建的容器添加卷 挂载主机目录 (存放行李的地方)
VOLUME
# 指定对外的端口 (-p)
EXPOSE
# 指定容器启动要运行的命令, 只有最后一个 CMD 会生效
CMD
# 效果和 CMD 类似, 可以追加命令
ENTRYPOINT
# 类似 ADD, 将我们的文件拷贝到镜像中
COPY
# 构建的时候设置环境变量
ENV
# 为Docker镜像添加元数据, 以键值对的形式展现
LABEL
```

```Dockerfile
# docker run 可以覆盖
CMD ["/bin/true"]
CMD ["/bin/bash", "-l"]

docker run -it xxx /bin/ps

# 提供的命令不容易在启动容器时覆盖
# docker run 命令行中指定的参数会被当做参数传递给 ENTRYPOINT 指令中指定的命令
ENTRYPOINT ["usr/sbin/nginx"]

WORKDIR /var/log

ENV RVM_PATH /home/rvm

# 指定一个或多个卷
VOLUME ["/opt/project", "data"]

# 安装一个应用程序时:  源文件 目的文件夹 复制
ADD software.lic /opt/appliction/software.lic

LABEL version="1.0"
LABEL version="1.0" type="Data"
```

### 数据卷容器

- `--volumes-from` 实现容器间的数据共享和重用, 有种拷贝的概念
- 容器之间配置信息的传递, 数据卷容器的生命周期一直持续到没有容器使用为止
- 但一旦持久化到了本地, 本地的数据是不会删除的

```shell
# 父容器就是数据卷容器
docker run -it --name 父容器 我的镜像名

docker run -it --name 第二个容器 --volumes-from 父容器 我的镜像名

docker run -it --name 第三个容器 --volumes-from 父容器 我的镜像名
```

```shell
# 多个 mysql 实现数据共享, 两个容器数据同步
docker run -d -p 3310:3306 -v /var/lib/mysql -e MYSQL_ROOT_PASSWORD=123456 --name yym mysql

docker run -d -p 3310:3306 -v /var/lib/mysql -e MYSQL_ROOT_PASSWORD=123456 --name yym --volumes-from mysql
```
