var Good = require('../lib/db').Good;
var express = require('express');
var router = express.Router();

router.post('/goods', function (req, res, next) {
    var data = req.body;
    var keyword = data.keyword;
    var shop = data.shop;
    var reg = new RegExp(keyword, 'i');
    if (!keyword) {
        var opt = (!shop || shop === '全部') ? {} : { shop };
        Good.find(opt, (err, goods) => {
            if (goods && goods.length) {
                res.json({
                    success: true,
                    goods
                });
            } else {
                res.json({
                    success: false,
                    msg: '暂无结果'
                });
            }
        });
    } else {
        var base = {
            "$or": [
                { goodId: {$regex : reg} },
                { name: {$regex : reg} }
            ]
        };
        var query = {
            "$and": [
                base,
                {
                    "$or": [
                        { shop }
                    ]
                }
            ]
        };

        if (!shop || shop === '全部') {
            query = base;
        }

        Good.find(query, (err, goods) => {
            if (goods && goods.length) {
                res.json({
                    success: true,
                    goods
                });
            } else {
                res.json({
                    success: false,
                    msg: '暂无结果'
                });
            }
        });
    }
});

router.get('/good/:id', function (req, res, next) {
    var _id = req.params.id;

    Good.findOne({ _id }, (err, good) => {
        if (good && Object.keys(good).length) {
            res.json({
                success: true,
                good
            });
        } else {
            res.json({
                success: false,
                msg: '获取数据失败'
            });
        }
    });
});

router.put('/good/update', function (req, res, next) {
    var data = Object.assign({}, req.body);
    var _id = data._id;
    var updateDs = null;

    delete data._id;
    Good.findOneAndUpdate({ _id }, data, (err, doc) => {
        if (doc && Object.keys(doc).length) {
            res.json({
                success: true,
                msg: '保存成功'
            });
        } else {
            res.json({
                success: false,
                msg: '保存失败'
            });
        }
    });
});

router.put('/save', function (req, res, next) {
    var data = req.body;
    var goodId = data.goodId || new Date().getTime().toString();
    var name = data.name;
    var shop = data.shop;

    Good.find({
        "$and": [
            {
                "$or": [
                    { goodId },
                    { name }
                ]
            },
            {
                "$or": [
                    { shop }
                ]
            }
        ]
    }, (err, docs) => {
        if (docs && docs.length) {
            res.json({
                success: false,
                msg: '商品已存在！'
            });
        } else {
            var good = new Good(data);

            good.save((err, row) => {
                if (row && Object.keys(row).length) {
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
        }
    });
});

router.delete('/good/:id', function (req, res, next) {
    var _id = req.params.id;
    Good.remove({ _id }, function (err) {
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
});

module.exports = router;
