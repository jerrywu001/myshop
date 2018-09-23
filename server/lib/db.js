var exports;
var mongoose = require('mongoose');
var db = mongoose.createConnection('localhost', 'tuxiaobai');
db.on('error', console.error.bind(console, 'mongodb 连接错误！'));
db.once('open', () => {
    console.log('mongodb 连接成功！');
});

exports.Good = db.model('good', new mongoose.Schema({
    goodId: String,
    name: String,
    shop: String,
    count: {
        type: Number,
        default: 0
    },
    prevPrice: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        default: 0
    },
    prevTotal: {
        type: Number,
        default: 0
    },
    salePrice: {
        type: Number,
        default: 0
    },
    realPrice: {
        type: Number,
        default: 0
    },
    props: {
        type: Array,
        default: []
    }
}));

exports.Shop = db.model('shop', new mongoose.Schema({
    value: String,
    label: String,
}));


module.exports = exports;
