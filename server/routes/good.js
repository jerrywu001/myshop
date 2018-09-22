var Good = require('../lib/db').Good;
var express = require('express');
var router = express.Router();

router.put('/save', function (req, res, next) {
    var data = req.body;
    var goodId = data.goodId || new Date().getTime().toString();
    var name = data.name;

    Good.find({
        "$or": [
            { goodId } ,
            { name },
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
