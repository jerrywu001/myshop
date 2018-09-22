var exports;
var mongoose = require('mongoose');
var db = mongoose.createConnection('localhost', 'everydayshare');
// mongoose.connect('mongodb://tester:123456@127.0.0.1:27017/everydayshare?authSource=admin');
db.on('error', console.error.bind(console, 'mongodb 连接错误！'));
db.once('open', () => {
    console.log('mongodb 连接成功！');
});

exports.User = db.model('user', new mongoose.Schema({
    sort: Number,
    worknumber: String,
    name: String,
    email: String,
    username: {
        type: String,
        default: ''
    },
    password: {
        type: String,
        default: ''
    },
    avator: {
        type: String,
        default: '/src/assets/imgs/default.jpg'
    },
    role: {
        type: Number,
        default: 0
    },
    outworkdate: {
        type: Date,
        default: new Date()
    },
    outworkdays: {
        type: Number,
        default: 0
    },
    replaceno: {
        type: String,
        default: ''
    }
}));

exports.System = db.model('system', new mongoose.Schema({
    name: {
        type: String,
        default: 'config'
    },
    sendemail: {
        type: Boolean,
        default: true
    },
    sendemailtime: {
        type: String,
        default: '16:00'
    },
    startuserid: String,
    startsharetime: Date,
    sorttype: {
        type: String,
        default: 'normal'
    },
    sortrules: {
        type: Array,
        default: [1, 2, 3, 4, 5]
    },
    holiday: {
        type: Array,
        default: [
            {
                "2017-10-01": 7,
                "2017-05-01": 3,
                "2017-01-01": 3
			}
		]
    },
    outworkday: {
        type: Array,
        default: []
    },
    sendemaildate: Date,
    nextshareuserid: String,
    nextsharedate: Date
}));


module.exports = exports;
