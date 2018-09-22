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
    props: {
        type: Array,
        default: []
    }
}));


module.exports = exports;
