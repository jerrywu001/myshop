var User = require('../lib/db').User;
var fs = require('fs');
var formidable = require('formidable');
var xlsx = require("node-xlsx");
var express = require('express');
var router = express.Router();
var gUpload = './src/assets/upload/';
var _sort = 1;

//上传excel
router.post('/xlsx', function (req, res) {
    var form = null;
    form = new formidable.IncomingForm();
    form.keepExtensions = false; //隐藏后缀
    form.multiples = false; //多文件上传
    form.uploadDir = gUpload;
    uploadFileFun(form, req, res, function (res, result) {
        if (!result) {
            res.json({
                success: false,
                msg: '上传文件失败！'
            });
        } else {
            var url = '.' + result;
            try { //异常捕获
                var list = xlsx.parse(url);
                if (list.constructor === Array &&
                    list.length && list[0] &&
                    Object.keys(list[0]).length &&
                    list[0].data.constructor === Array &&
                    list[0].data.length) {

                    var data = list[0].data;
                    var title = data[0];
                    if (title.constructor === Array && title.length) {
                        if (title[0] === '序号' && title[1] === '姓名' && title[2] === '工号' && title[3] === '邮箱') {
                            var _ds = [];
                            var _admin = {
                                "sort": 100000,
                                "name": "管理员",
                                "worknumber": "100000",
                                "email": "admin@zqykj.com",
                                "username": "admin",
                                "password": "password",
                                "role": 1
                            };

                            for (var i = 0, len = data.length; i < len; i++) {
                                if (i > 0) {
                                    var _d = data[i];
                                    _ds.push({
                                        sort: _d[0],
                                        name: _d[1],
                                        worknumber: _d[2],
                                        email: _d[3]
                                    });
                                }
                            }

                            _ds.push(_admin);

                            User.remove({}, function (err) {
                                if (!err) {
                                    User.create(_ds, (err, rows) => {
                                        if (!err) {
                                            res.json({
                                                success: true,
                                                msg: '导入成功！'
                                            });
                                        } else {
                                            res.json({
                                                success: false,
                                                msg: '导入失败！'
                                            });
                                        }
                                        //var admins = new User(_admin);
                                        deleteFile(gUpload, url);
                                        //admins.save(admins, (err, rows) => {});
                                    });
                                } else {
                                    deleteFile(gUpload, url);
                                    res.json({
                                        success: false,
                                        msg: '解析失败！'
                                    });
                                }
                            });
                        } else {
                            deleteFile(gUpload, url);
                            res.json({
                                success: false,
                                msg: '格式错误，标题依次为（序号、姓名、工号、邮箱）！'
                            });
                        }
                    } else {
                        deleteFile(gUpload, url);
                        res.json({
                            success: false,
                            msg: '解析失败，未找到标题！'
                        });
                    }
                } else {
                    deleteFile(gUpload, url);
                    res.json({
                        success: false,
                        msg: '解析失败，数据错误！'
                    });
                }
            } catch (err) {
                deleteFile(gUpload, url);
                res.json({
                    success: false,
                    msg: '导入失败！'
                });
            }
        }
    });
});

//上传头像
router.post('/uploadAvator', function (req, res) {
    var form = null;
    form = new formidable.IncomingForm();
    form.keepExtensions = false; //隐藏后缀
    form.multiples = false; //多文件上传
    form.uploadDir = gUpload;
    uploadFileFun(form, req, res, function (res, result) {
        res.json({
            success: true,
            url: result
        });
    }, 'head/');
});

function deleteLocalFiles(path, deleteFolder) {
    var files = [];
    if (fs.existsSync(path)) {
        files = fs.readdirSync(path);
        files.forEach(function (file, index) {
            var curPath = path + "/" + file;
            if (fs.statSync(curPath).isDirectory()) { // recurse
                deleteLocalFiles(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        if (deleteFolder) fs.rmdirSync(path);
    }
}

function deleteFile(path, file) {
    if (fs.existsSync(path)) {
        fs.unlinkSync(file);
    }
}

//上传
function uploadFileFun(form, req, res, callback, folder) {
    form.parse(req, function (error, fields, files) {
        var gUpload1 = gUpload + (folder || ''),
            fList = files.file,
            fileUrl = '',
            fileS = null,
            resultPath = [];
        if (fList.constructor === Array) {
            for (var i = 0; i < fList.length; i++) {
                fileS = fList[i];
                fileUrl = gUpload1 + new Date().getTime() + fileS.name.substring(fileS.name.lastIndexOf('.'));
                resultPath.push('/src' + fileUrl.split('./src')[1] || '');
                fs.renameSync(fileS.path, fileUrl);
            }
            if (callback) callback(res, resultPath || []);
        } else { //单文件上传
            //res.setHeader('Content-Type', 'text/html');		//很重要，不然ie会弹出保存对话框
            fileS = fList;
            fileUrl = gUpload1 + new Date().getTime() + fileS.name.substring(fileS.name.lastIndexOf('.'));
            fs.renameSync(fileS.path, fileUrl);
            if (callback) callback(res, '/src' + fileUrl.split('./src')[1] || '');
        }
    });
}

module.exports = router;
