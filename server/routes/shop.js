var Shop = require('../lib/db').Shop;
var Month = require('../lib/db').Month;
var express = require('express');
var router = express.Router();

router.get('/shops', function (req, res, next) {
    Shop.find().exec((err, shops) => {
        if (shops && shops.length) {
            res.json({
                success: true,
                shops
            });
        } else {
            res.json({
                success: true,
                shops: []
            });
        }
    });
});

router.put('/shop/add', function (req, res, next) {
    var data = req.body;
    var label = data.label;

    Shop.findOne({ label }, (err, doc) => {
        if (doc && Object.keys(doc).length) {
            res.json({
                success: false,
                msg: '商家已存在！'
            });
        } else {
            var shop = new Shop(data);

            shop.save((err, row) => {
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

router.get('/months', function (req, res, next) {
    Month.find().exec((err, rs) => {
        if (rs && Object.keys(rs).length) {
            res.json({
                success: true,
                months: rs[0].value,
                remark: rs[0].remark
            });
        } else {
            res.json({
                success: true,
                months: {},
                remark: ''
            });
        }
    });
});

router.put('/months', function (req, res, next) {
    const all = req.body;

    Month.findOneAndUpdate({
        mid: 'all'
    }, {
        mid: 'all',
        value: all
    }, (err, doc) => {
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

module.exports = router;
