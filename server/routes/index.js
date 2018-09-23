var api = '/api/v1';
var express = require('express');
var router = express.Router();

module.exports = function (app) {
    app.use(api, require('./good'));
    app.use(api, require('./shop'));
};
