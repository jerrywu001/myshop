
const express = require('express');

const app = express();
const session = require('express-session');
const cookieParser = require('cookie-parser');
const path = require('path');
const bodyParser = require('body-parser');
const history = require('connect-history-api-fallback');
const routes = require('./routes');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true,
}));
app.use(cookieParser());

// session
app.use(session({
    secret: 'secret', // 对session id 相关的cookie 进行签名
    resave: true,
    saveUninitialized: true, // 是否保存未初始化的会话
    rolling: true,
    cookie: {
        expires: 1000 * 60 * 10, // 设置 session 的有效时间，单位毫秒，10分钟
    },
}));

app.use(history());

// 访问静态资源文件 这里是访问所有dist目录下的静态资源文件
app.use(express.static(path.resolve(__dirname, '../dist')));
app.use(express.static(path.resolve(__dirname, '../')));

// 跨域
app.all('*', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    // 预检请求使用
    res.header('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type');
    res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
    next();
});

routes(app);

app.set('port', process.env.PORT || 9200);
app.listen(app.get('port'), (err) => {
    if (err) {
        console.log(err);
        return;
    }
    console.log(`Express server listening on port ${app.get('port')}`);
});
