var Good = require('../lib/db').Good;
var express = require('express');
var router = express.Router();

router.put('/user/add', function (req, res, next) {
    var data = req.body;
    var goodId = data.goodId;

    Good.findOne({
        goodId,
    }, (err, doc) => {
        if (doc && Object.keys(doc).length) {
            res.json({
                success: false,
                msg: '商品已存在！'
            });
        } else {
            Good.find((err, doc) => {
                var good = new Good(data);

                good.save((err, row) => {
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
});

module.exports = router;
