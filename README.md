# Back-end project template

基于strapi project的Headless CMS后端模板工程, 常见的后端需求多为标准的CURD, 只需要可视化网页上配置即可, 深层次需求涉及到后端编辑. 

具体参考[strapi官网](https://strapi.io/documentation/v3.x/getting-started/introduction.html).

## Quick start

```
git clone https://github.com/espring/fullstack-backend myproj
```

删除模板工程的.git, 重新初始.
```
cd myproj
rm -rf ./.git

git init
```

安装
```
npm i 
```

本工程使用数据库是strapi默认的sqlite3, 如果希望使用mysql, 请编辑./config/database.js, 修改内容如下:
```
module.exports = ({ env }) => ({
  defaultConnection: 'default',
  connections: {
    default: {
      connector: 'bookshelf',
      settings: {
        client: 'mysql',
        host: env('DATABASE_HOST'),
        port: env.int('DATABASE_PORT', 3306),
        database: env('DATABASE_NAME'),
        username: env('DATABASE_USERNAME'),
        password: env('DATABASE_PASSWORD'),
        ssl: env.bool('DATABASE_SSL', false),
      },
      options: {
        useNullAsDefault: true,
      },
    },
  },
});
```
其中, DATABASE_HOST, DATABASE_NAME, DATABASE_USERNAME, DATABASE_PASSWORD 是外部设置的环境变量.  具体变量值, 本地开发请在.env文件中设置, 发布部署的环境变量在pm2的部署配置文件deploy.prod.config.js 中设置.

package.js 中增加 mysql的依赖, 删除sqlite3相关.
```
  "dependencies": {
    "mysql": "^2.18.1",
  }
```

如果希望使用其他数据库, 参考strapi的官方文档.


运行dev
```
npm run dev
```

第一次运行时, 打开 http://localhost:1337/admin , 设置CMS的管理员帐号. 之后所有后端工程结构配置, 都是使用这个管理员帐号操作.

所谓的Headless CMS, 也就说常见的后端CURD开发, 都只需要通过可视化页面内的配置, 自动生成了数据库项, 以及标准的Restful api访问.


## 配置Api Token

Api token 功能是将token与某一个具体的后端帐号关联起来, 所以先要配置一个控制了权限的帐号.

具体操作: 
  * 打开 Users 表, 创建一个用户, 例如为 api_user01, 注意 该用户的Role 权限是否合适.
  * 打开 Tokens表, 创那一个token, 例如为 token01, 创建时在右侧选择关联的用户为 api_user01, 
  * 注意, 创建出来的Token, 不要选择Publish.
  
添加token后, 测试是否可用:
```
curl -X GET "http://localhost:1337/upload/files?token=token01"
```
如果token错误, 返回如下:
```
{"statusCode":500,"error":"Internal Server Error","message":"An internal server error occurred"}%
```

增加Api token的用法, 来源于[官网](https://strapi.io/documentation/v3.x/guides/api-token.html#introduction)

## 部署

使用pm2进行部署, 请先阅读[pm2官网](https://pm2.keymetrics.io/docs/usage/deployment/)

```
npm i pm2 -g
```

第一次需要修改配置文件 ecosystem.prod.config.js 和 deploy.prod.config.js.

可以在ecosystem.prod.config.js 中配置运行期的环境变量, 也可以在 deploy.prod.config.js, 建议在deploy.prod.config.js中配置, 并且 deploy.prod.config.js保留在本地, 不要再上传至git.

deploy.prod.config.js 内容说明
```
module.exports = {
  deploy : {
    production : {
      user : 'ssh-user', 
      host : ['server-name'],
      ref  : 'origin/main',
      repo : 'https://github.com/espring/fullstack-backend/',
      path : '/app/back-end',
      'post-setup': 'npm install',
      'pre-deploy': 'git fetch --all && git reset --hard origin/main',
      'post-deploy' : 'npm install && npm run build && pm2 restart ecosystem.prod.config.js --env production',
      env: {
        NODE_ENV: 'production',
        DATABASE_HOST: '127.0.0.1',
        DATABASE_NAME: 'dbname',
        DATABASE_USERNAME: 'db-user',
        DATABASE_PASSWORD: 'db-password'
      }
    }
  }
}
```
  * user 和 host, 是通过ssh可访问的服务器及用户.
  * ref: 是git分支. repo是git仓库
  * path: 是服务器上配置的目录名, 注意需要事先创建, 并且设置可访问权限.
  * pre-deploy: 在服务器运行的更新代码的命令, 因为服务器端也会修改代码, 所以需要强制更新为git repo最新代码.
  * env 是定义运行期的环境变量,  会自动带到post-deploy命令中.

第一次部署需要先调用pm2 setup
```
pm2 deploy deploy.prod.config.js production setup
```

之后每次部署, 先将代码提供到git repo的指定分支上.
```
pm2 deploy deploy.prod.config.js production
```

建议: 创建一个分支用于发布.

# 用法

## 如何增加一个表, 通过api访问.
参考[官网例子](https://strapi.io/documentation/v3.x/getting-started/quick-start.html#_3-create-a-restaurant-content-type)




