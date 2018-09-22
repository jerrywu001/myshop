var User = require('../lib/db').User;
var System = require('../lib/db').System;
var _global = require('../common/global');
var express = require('express');
var router = express.Router();

router.get('/user', function (req, res, next) {
    var data = req.body;

    if (_global.session && _global.session.uid) {
        User.findOne({
            _id: _global.session.uid
        }, (err, doc) => {
            if (doc && Object.keys(doc).length) {
                res.json({
                    success: true,
                    data: doc
                });
            } else {
                res.json({
                    success: false,
                    msg: '未找到用户！'
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

router.put('/user/replaceshare', function (req, res, next) {
    var data = req.body;

    if (!data.replaceno) {
        res.json({
            success: false,
            msg: '请选择替换人员！'
        });
    } else {
        if (_global.session && _global.session.uid) {
            User.findOne({
                _id: _global.session.uid
            }, (err, doc) => {
                if (doc && Object.keys(doc).length) {
                    let replaceno = data.replaceno === 'cancel' ? '' : (data.replaceno || '');

                    User.update({
                        _id: _global.session.uid
                    }, {
                        $set: {
                            replaceno: replaceno
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
                    res.json({
                        success: false,
                        msg: '未找到用户！'
                    });
                }
            });
        } else {
            res.json({
                success: false,
                msg: '用户未登录！'
            });
        }
    }
});

router.put('/user/setoutworkday', function (req, res, next) {
    var data = req.body;

    if (!data.outworkdate || data.outworkdays === undefined || data.outworkdays === null) {
        res.json({
            success: false,
            msg: '请填写必选项！'
        });
    } else {
        if (_global.session && _global.session.uid) {
            User.findOne({
                _id: _global.session.uid
            }, (err, doc) => {
                if (doc && Object.keys(doc).length) {
                    User.update({
                        _id: _global.session.uid
                    }, {
                        $set: {
                            outworkdate: data.outworkdate || new Date(),
                            outworkdays: data.outworkdays || 0
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
                    res.json({
                        success: false,
                        msg: '未找到用户！'
                    });
                }
            });
        } else {
            res.json({
                success: false,
                msg: '用户未登录！'
            });
        }
    }
});

router.post('/user/name', function (req, res, next) {
    var data = req.body;

    if (data.name && data.worknumber) {
        if (data.name === '管理员' && data.worknumber >= 100000) {
            res.json({
                success: false,
                msg: '管理员账号不允许修改！'
            });
            return false;
        }


        User.findOne({
            worknumber: data.worknumber
        }, (err, doc) => {
            if (doc && Object.keys(doc).length) {
                if (doc.username || doc.password) {
                    res.json({
                        success: false,
                        msg: '该工号已初始化账号！'
                    });
                } else {
                    User.findOne({
                        name: data.name,
                        worknumber: data.worknumber
                    }, (err, doc) => {
                        if (doc && Object.keys(doc).length) {
                            res.json({
                                success: true,
                                msg: 'success'
                            });
                        } else {
                            res.json({
                                success: false,
                                msg: '姓名和工号不匹配！'
                            });
                        }
                    });
                }
            } else {
                res.json({
                    success: false,
                    msg: '工号不存在！'
                });
            }
        });
    } else {
        res.json({
            success: false,
            msg: '姓名、工号信息有误！'
        });
    }
});

router.get('/users', function (req, res, next) {
    function replcePassword(rows) {
        for (var i = 0, len = rows.length; i < len; i++) {
            rows[i].password = '**********';
        }
    }


    System.findOne({
        name: 'config'
    }, (err, doc) => {
        let result = 'normal';
        let sort = {
            'sort': 1
        };

        if (doc && Object.keys(doc).length) {
            result = doc.sorttype;
        }

        if (result === 'worknumber') {
            sort = {
                'worknumber': 1
            };
        }

        User.find().sort(sort).exec((err, row) => {
            if (row && row.length) {
                replcePassword(row);
                res.json({
                    success: true,
                    data: row
                });
            } else {
                res.json({
                    success: true,
                    data: []
                });
            }
        });
    });
});

router.put('/user/init', function (req, res, next) {
    var data = req.body;
    var worknumber = data.worknumber;
    var password = data.password;
    var username = data.username;

    if (worknumber && password && username) {
        if (username.trim().toLowerCase() === 'admin') {
            res.json({
                success: false,
                msg: '请设置“admin”以外的用户名！'
            });
            return false;
        }
        User.findOne({
            username: username
        }, (err, doc) => {
            if (doc && Object.keys(doc).length) {
                res.json({
                    success: false,
                    msg: '用户名已存在！'
                });
            } else {
                User.findOne({
                    worknumber: worknumber
                }, (err, doc) => {
                    if (doc && Object.keys(doc).length) {
                        isExist = true;
                        User.update({
                            worknumber: worknumber
                        }, {
                            $set: {
                                worknumber: worknumber,
                                password: password,
                                username: username
                            }
                        }, (err, doc) => {
                            if (doc && Object.keys(doc).length) {
                                res.json({
                                    success: true,
                                    msg: '设置成功！'
                                });
                            } else {
                                res.json({
                                    success: false,
                                    msg: '设置失败！'
                                });
                            }
                        });
                    } else {
                        res.json({
                            success: false,
                            msg: '工号不存在！'
                        });
                    }
                });
            }
        });
    } else {
        res.json({
            success: false,
            msg: '请填写完整信息！'
        });
    }
});

router.put('/user/add', function (req, res, next) {
    var data = req.body;
    var worknumber = data.worknumber;
    var name = data.name;
    var email = data.email;

    if (worknumber && name && email) {
        User.findOne({
            worknumber: worknumber
        }, (err, doc) => {
            if (doc && Object.keys(doc).length) {
                res.json({
                    success: false,
                    msg: '工号已存在！'
                });
            } else {
                User.find((err, doc) => {
                    let len = doc.length || 0;
                    var user = new User({
                        sort: len + 1,
                        worknumber: worknumber,
                        name: name,
                        email: email
                    });

                    user.save((err, row) => {
                        if (doc && Object.keys(doc).length) {
                            res.json({
                                success: true,
                                msg: '添加成功！'
                            });
                        } else {
                            res.json({
                                success: false,
                                msg: '添加失败！'
                            });
                        }
                    });
                });
            }
        });
    } else {
        res.json({
            success: false,
            msg: '请填写完整信息！'
        });
    }
});

router.put('/user/edit', function (req, res, next) {
    var data = req.body;
    var uid = data.uid;
    var worknumber = data.worknumber;
    var replaceworknumber = data.replaceworknumber;
    var name = data.name;
    var email = data.email;

    if (uid && worknumber && name && email) {
        User.findOne({
            worknumber: worknumber
        }, (err, doc) => {
            let isExist = false;
            if (doc && Object.keys(doc).length) {
                if (doc.worknumber !== replaceworknumber) {
                    isExist = true;
                }
            }

            if (isExist) {
                res.json({
                    success: false,
                    msg: '工号信息已存在！'
                });
            } else {
                User.update({
                    _id: uid
                }, {
                    $set: {
                        name: name,
                        worknumber: worknumber,
                        email: email
                    }
                }, (err, doc) => {
                    if (doc && Object.keys(doc).length) {
                        res.json({
                            success: true,
                            msg: '编辑成功！'
                        });
                    } else {
                        res.json({
                            success: false,
                            msg: '编辑失败！'
                        });
                    }
                });
            }
        });
    } else {
        res.json({
            success: false,
            msg: '请填写完整信息！'
        });
    }
});

router.put('/user/update', function (req, res, next) {
    var data = req.body;
    var username = data.username;
    var pwd = data.password;
    var oldpwd = data.oldPassword;

    if (username && oldpwd && pwd) {
        User.findOne({
            username: username,
            password: oldpwd
        }, (err, doc) => {
            if (doc && Object.keys(doc).length) {
                User.update({
                    username: username
                }, {
                    $set: {
                        username: username,
                        password: pwd
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
                res.json({
                    success: false,
                    msg: '旧密码不正确！'
                });
            }
        });
    } else {
        res.json({
            success: false,
            msg: '请填写完整信息！'
        });
    }
});

router.put('/user/avator', function (req, res, next) {
    var data = req.body;
    var username = data.username;
    var avator = data.avator;

    if (username) {
        User.update({
            username: username
        }, {
            $set: {
                avator: avator
            }
        }, (err, doc) => {
            if (doc && Object.keys(doc).length) {
                _global.session.avator = avator;
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
        res.json({
            success: false,
            msg: '用户session失效！'
        });
    }
});

router.put('/user/remove', function (req, res, next) {
    var data = req.body;
    var ids = data.ids;

    if (ids && ids.length) {
        User.remove({
            "_id": {
                $in: ids
            }
        }, function (err) {
            if (!err) {
                res.json({
                    success: true,
                    msg: '删除成功'
                });
            } else {
                res.json({
                    success: false,
                    msg: '删除失败！'
                });
            }
        });
    } else {
        res.json({
            success: false,
            msg: '没有找到要删除的数据'
        });
    }
});

router.put('/user/setadmin', function (req, res, next) {
    var data = req.body;
    var ids = data.ids;
    var role = data.role;

    if (ids && ids.length && role !== undefined) {
        User.updateMany({
            "_id": {
                $in: ids
            }
        }, {
            $set: {
                role: role
            }
        }, function (err) {
            if (!err) {
                res.json({
                    success: true,
                    msg: '设置成功'
                });
            } else {
                res.json({
                    success: false,
                    msg: '设置失败！'
                });
            }
        });
    } else {
        res.json({
            success: false,
            msg: '没有匹配的数据'
        });
    }
});

module.exports = router;
