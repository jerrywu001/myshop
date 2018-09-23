var Good = require('../lib/db').Good;
var express = require('express');
var router = express.Router();

router.post('/goods', function (req, res, next) {
    var data = req.body;
    var keyword = data.keyword;
    var shop = data.shop;
    var reg = new RegExp(keyword, 'i');
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

module.exports = router;
