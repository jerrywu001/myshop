const express = require('express');

const router = express.Router();
const Good = require('../lib/db').Good;

router.post('/goods', (req, res, next) => {
    const data = req.body;
    const keyword = data.keyword;
    const isSellOut = data.isSellOut;
    const shop = data.shop;
    const reg = new RegExp(keyword, 'i');
    if (!keyword) {
        const opt = (!shop || shop === '全部') ? {} : { shop };
        if (isSellOut === '0') {
            opt.count = {
                $gt: 0,
            };
        }
        Good.find(opt, (err, goods) => {
            if (goods && goods.length) {
                res.json({
                    success: true,
                    goods,
                });
            } else {
                res.json({
                    success: false,
                    msg: '暂无结果',
                });
            }
        });
    } else {
        const base = {
            '$or': [
                { goodId: { $regex: reg } },
                { name: { $regex: reg } },
            ],
        };
        let query = {
            '$and': [
                base,
                {
                    '$or': [
                        { shop },
                    ],
                },
            ],
        };

        if (!shop || shop === '全部') {
            query = base;
        }
        if (isSellOut === '0') {
            opt.count = {
                $gt: 0,
            };
        }
        Good.find(query, (err, goods) => {
            if (goods && goods.length) {
                res.json({
                    success: true,
                    goods,
                });
            } else {
                res.json({
                    success: false,
                    msg: '暂无结果',
                });
            }
        });
    }
});

router.get('/good/:id', (req, res, next) => {
    const _id = req.params.id;
    Good.findOne({ _id }, (err, good) => {
        if (good && Object.keys(good).length) {
            res.json({
                success: true,
                good,
            });
        } else {
            res.json({
                success: false,
                msg: '获取数据失败',
            });
        }
    });
});

router.put('/good/update', (req, res, next) => {
    const data = Object.assign({}, req.body);
    const _id = data._id;

    delete data._id;
    Good.findOneAndUpdate({ _id }, data, (err, doc) => {
        if (doc && Object.keys(doc).length) {
            res.json({
                success: true,
                msg: '保存成功',
            });
        } else {
            res.json({
                success: false,
                msg: '保存失败',
            });
        }
    });
});

router.put('/save', (req, res, next) => {
    const data = req.body;
    const goodId = data.goodId || new Date().getTime().toString();
    const name = data.name;
    const shop = data.shop;

    Good.find({
        '$and': [
            {
                '$or': [
                    { goodId },
                    { name },
                ],
            },
            {
                '$or': [
                    { shop },
                ],
            },
        ],
    }, (err, docs) => {
        if (docs && docs.length) {
            res.json({
                success: false,
                msg: '商品已存在！',
            });
        } else {
            const good = new Good(data);

            good.save((err, row) => {
                if (row && Object.keys(row).length) {
                    res.json({
                        success: true,
                        msg: '添加成功！',
                    });
                } else {
                    res.json({
                        success: false,
                        msg: '添加失败！',
                    });
                }
            });
        }
    });
});

router.delete('/good/:id', (req, res, next) => {
    const _id = req.params.id;
    Good.remove({ _id }, (err) => {
        if (!err) {
            res.json({
                success: true,
                msg: '删除成功',
            });
        } else {
            res.json({
                success: false,
                msg: '删除失败！',
            });
        }
    });
});

module.exports = router;
