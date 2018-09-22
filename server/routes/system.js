var System = require('../lib/db').System;
var _global = require('../common/global');
var express = require('express');
var router = express.Router();

router.get('/system', function (req, res, next) {
    if (_global.session && _global.session.uid) {
        System.find((err, row) => {
            if (row && row.length) {
                res.json({
                    success: true,
                    data: row[0]
                });
            } else {
                res.json({
                    success: true,
                    data: {}
                });
            }
        });
    } else {
        res.json({
            success: false,
            msg: '用户未登录！'
        });
    }
});

router.put('/system/email/send', function (req, res, next) {
    var data = req.body;

    if (data.sendemail !== undefined) {
        System.findOneAndUpdate({
            name: 'config'
        }, {
            $set: {
                sendemail: data.sendemail
            }
        }, (err, doc) => {
            if (doc && Object.keys(doc).length) {
                res.json({
                    success: true,
                    data: doc
                });
            } else {
                res.json({
                    success: false,
                    msg: '更新失败！'
                });
            }
        });
    } else {
        res.json({
            success: false,
            msg: '缺少参数'
        });
    }
});

router.put('/system/email/time', function (req, res, next) {
    var data = req.body;

    System.findOneAndUpdate({
        name: 'config'
    }, {
        $set: {
            sendemailtime: data.sendEmailTime
        }
    }, (err, doc) => {
        if (doc && Object.keys(doc).length) {
            res.json({
                success: true
            });
        } else {
            res.json({
                success: false,
                msg: '更新失败！'
            });
        }
    });
});

router.put('/system/holiday', function (req, res, next) {
    var data = req.body;
    var type = data.type || 'holiday';
    var data = data.data;

    if (!data) {
        res.json({
            success: false,
            msg: '无效数据！'
        });
    } else {
        if (type === 'outworkday') {
            System.findOneAndUpdate({
                name: 'config'
            }, {
                $set: {
                    outworkday: [data]
                }
            }, (err, doc) => {
                if (doc && Object.keys(doc).length) {
                    res.json({
                        success: true,
                        msg: '更新成功！'
                    });
                } else {
                    res.json({
                        success: false,
                        msg: '更新失败！'
                    });
                }
            });
        } else {
            if (!Object.keys(data).length) {
                res.json({
                    success: false,
                    msg: '至少保留一条法定假日！'
                });
            } else {
                System.findOneAndUpdate({
                    name: 'config'
                }, {
                    $set: {
                        holiday: [data]
                    }
                }, (err, doc) => {
                    if (doc && Object.keys(doc).length) {
                        res.json({
                            success: true,
                            msg: '更新成功！'
                        });
                    } else {
                        res.json({
                            success: false,
                            msg: '更新失败！'
                        });
                    }
                });
            }
        }
    }
});

module.exports = router;
