const mongoose = require('mongoose');

const db = mongoose.createConnection('localhost', 'tuxiaobai');
var exports;

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
        default: 0,
    },
    prevPrice: {
        type: Number,
        default: 0,
    },
    price: {
        type: Number,
        default: 0,
    },
    prevTotal: {
        type: Number,
        default: 0,
    },
    salePrice: {
        type: Number,
        default: 0,
    },
    realPrice: {
        type: String,
        default: '0',
    },
    remark: {
        type: String,
        default: '',
    },
    props: {
        type: Array,
        default: [],
    },
}));

exports.Shop = db.model('shop', new mongoose.Schema({
    value: String,
    label: String,
}));

exports.Month = db.model('month', new mongoose.Schema({
    mid: String,
    value: {
        type: Object,
        default: {},
    },
}));


module.exports = exports;
