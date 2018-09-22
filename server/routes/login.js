var User = require('../lib/db').User;
var _global = require('../common/global');
var express = require('express');
var router = express.Router();

router.post('/login', function (req, res, next) {
    var data = req.body;
    var username = data.username;
    var pwd = data.password;

    if (username !== undefined && pwd !== undefined) {
        User.findOne({
            username: username,
            password: pwd
        }, (err, doc) => {
            if (doc && Object.keys(doc).length) {
                _global.session = {};
                _global.session.uid = doc._id;
                _global.session.role = doc.role;
                _global.session.name = doc.name;
                _global.session.username = doc.username;
                _global.session.avator = doc.avator;

                res.json({
                    success: true,
                    msg: '登录成功！'
                });
            } else {
                res.json({
                    success: false,
                    msg: '用户名或密码错误！'
                });
            }
        });
    } else {
        res.json({
            success: false,
            msg: '请输入用户名或密码！'
        });
    }
});

router.get('/login/check', function (req, res, next) {
    if (_global.session.uid) {
        res.json({
            success: true,
            uid: _global.session.uid,
            role: _global.session.role,
            name: _global.session.name,
            username: _global.session.username,
            avator: _global.session.avator
        });
    } else {
        res.json({
            success: false,
            msg: '用户未登录！'
        });
    }
});

router.get('/logout', function (req, res, next) {
    _global.session = {};
    _global.session.uid = null;
    _global.session.role = null;
    _global.session.name = null;
    _global.session.username = null;
    _global.session.avator = null;

    res.json({
        success: true,
        msg: '用户退出！'
    });
});

module.exports = router;
