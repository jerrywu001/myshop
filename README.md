# vuework
> A Vue.js&express project

## Build Setup

``` bash
# install dependencies
npm install

# init database
npm run init

# serve with express load at localhost:9200
npm run server

# serve with hot reload at localhost:8090
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# 如果要持久化服务
npm install forever -g
forever start server/app.js  开启服务
forever stop server/app.js  停止服务
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
