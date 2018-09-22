var api = '/api/v1';
var express = require('express');
var router = express.Router();

module.exports = function (app) {
    app.use(api, require('./email'));
    app.use(api, require('./import'));
    app.use(api, require('./system'));
    app.use(api, require('./login'));
    app.use(api, require('./user'));
};
