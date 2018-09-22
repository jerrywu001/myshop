var User = require('../lib/db').User;
var System = require('../lib/db').System;

//user
var user = new User({
    "sort": 100000,
    "name": "管理员",
    "avator": "/src/assets/imgs/default.jpg",
    "worknumber": "100000",
    "email": "admin@zqykj.com",
    "username": "admin",
    "password": "password",
    "outworkdate": new Date(),
    "outworkdays": 0,
    "replaceno": "",
    "role": 1
});

user.save((err, row) => {
    console.log(err);
});

//sys
var system = new System({
    "name": "config",
    "sendemail": false,
    "sendemailtime": "12:00",
    "startuserid": "",
    "startsharetime": new Date(),
    "sorttype": "normal",
    "sortrules": [1,2,3,4,5],
    "holiday": [
        {
            "2017-10-01": 7,
            "2017-05-01": 3,
            "2017-01-01": 3
        }
    ],
    "outworkday": [],
    "sendemaildate": null,
    "nextshareuserid": "",
    "nextsharedate": null
});

system.save((err, row) => {
    console.log(err);
});