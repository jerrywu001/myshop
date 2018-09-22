var System = require('../lib/db').System;
var User = require('../lib/db').User;
var nodemailer = require('nodemailer');
var express = require('express');
var router = express.Router();
var oneDay = 24 * 60 * 60 * 1000;

//test
System.findOne({
	name: 'config'
}, (err, sys) => {
	if (sys && Object.keys(sys).length) {
		User.find().sort({
			sort: 1
		}).exec((err, users) => {
			//			users = _util.removeAdminFromUsers(users);
			//			let sendemaildate = sys.sendemaildate ? _util.getNowDateMills(sys.sendemaildate) : null;
			//			let isSended = !!sendemaildate && sendemaildate === _util.getNowDateMills();

			//test
			//			let nextShareUser = _util.getNextShareUserBySys(users, sys);
			//
			//			nextShareUser = _util.checkRulesAndReturnUser(nextShareUser, users, sys);

			//			if (_util.isInHoliday(nextShareUser)) {
			//				nextShareUser = _util.checkIsInHolidayAndReturnUser(nextShareUser, users, sys);
			//			}
		});
	}
});
//test

/** 
 * 时间格式化注册
 * @param {string} fmt 需要格式化的类型（比如'yyyy-MM-dd hh:mm'）
 * @return {string} 时间字符串
 */
Date.prototype.format = function (fmt) { //author: meizz 
	var o = {
		"M+": this.getMonth() + 1, //月份 
		"d+": this.getDate(), //日 
		"h+": this.getHours(), //小时 
		"m+": this.getMinutes(), //分 
		"s+": this.getSeconds(), //秒 
		"q+": Math.floor((this.getMonth() + 3) / 3), //季度 
		"S": this.getMilliseconds() //毫秒 
	};
	if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (var k in o)
		if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
};

/**
 * 重启服务器时候清除人员替换信息
 * @param {function} callback 回调函数
 */
function clearReplaceFunc(callback) {
	User.updateMany({}, {
		replaceno: ''
	}).exec((err, users) => {
		if (callback) callback();
	});
}

/**
 * 获取人员列表数据
 * @param {function} callback 回调函数
 */
function getUsers(callback) {
	System.findOne({
		name: 'config'
	}, (err, sysdoc) => {
		let result = 'normal';
		let arr = [];
		let sort = {
			'sort': 1
		};

		if (sysdoc && Object.keys(sysdoc).length) {
			result = sysdoc.sorttype;
		}

		if (result === 'worknumber') {
			sort = {
				'worknumber': 1
			};
		}

		User.find().sort(sort).exec((err, row) => {
			row = _util.removeAdminFromUsers(row);
			if (row && row.length) {
				arr = row;
			}
			if (callback) callback(arr, sysdoc);
		});
	});
}

/**
 * 邮件发送成功，清除人员的请假信息
 * @param {string} userid
 */
function resetOutWorkdays(userid) {
	User.update({
		_id: userid
	}, {
		$set: {
			outworkdays: 0
		}
	}, (err, doc) => {});
}

/**
 * 邮件发送成功，清除人员的替换信息
 * @param {string} userid
 */
function resetReplaceNo(userid) {
	User.update({
		_id: userid
	}, {
		$set: {
			replaceno: ''
		}
	}, (err, doc) => {});
}

/**
 * 设置替换人员信息
 * @param {string} userid
 * @param {string} replaceUserId
 */
function setReplaceNo(userid, replaceUserId) {
	User.update({
		_id: userid
	}, {
		$set: {
			replaceno: replaceUserId
		}
	}, (err, doc) => {});
}

/**
 * 发送邮件
 */
function sendEmailFunc() {
	System.findOne({
		name: 'config'
	}, (err, doc) => {
		if (doc && Object.keys(doc).length) {
			if (doc.sendemail) {
				let nowDate = new Date();
				let nowTime = nowDate.format('hh:mm');
				if (nowTime === doc.sendemailtime) {
					getUsers((users, sys) => {
						let sendemaildate = sys.sendemaildate ? _util.getNowDateMills(sys.sendemaildate) : null;
						let isSended = sendemaildate && sendemaildate === _util.getNowDateMills();
						if (isSended) {
							console.log('今天已发送过邮件通知了！');
						} else {
							console.log('定时任务-邮件发送 start====：' + doc.sendemailtime);
                            let isInHoliday =  _util.isHoliday(nowDate, sys);
							let isNotShareDay = _util.isNotShareDay(nowDate, sys);
                            if (isNotShareDay || isInHoliday) {
                                console.log('今天不是工作日，没有分享安排！');
                                // send message to admin
                                let transporter = _util.getMmailer();
                                transporter.sendMail({
                                    from: 'wuchao@zqykj.com',
                                    to: 'wuchao@zqykj.com',
                                    subject: '每日分享提醒',
                                    text: '今天不是工作日，没有分享安排！',
                                    html: `<div style="padding: 2px 50px;">今天不是工作日，没有分享安排！</div>`
                                }, function (error, info) {
                                    if (error) {
                                        console.log('邮件发送失败：' + error);
                                    } else {
                                        console.log('邮件发送: ' + info.response);
                                    }
                                });
                                return;
                            }
							if (sys.nextshareuserid && sys.sortrules && sys.sortrules.length) {
								let nextShareUser = _util.getNextShareUserBySys(users, sys);
								nextShareUser = _util.checkRulesAndReturnUser(nextShareUser, users, sys);
								_util.sendEMail(nextShareUser.user.email, nextShareUser.user.name, nextShareUser.date);
                                
								//update sended mark
								System.findOneAndUpdate({
									name: 'config'
								}, {
									$set: {
										sendemaildate: new Date(new Date().format('yyyy/MM/dd'))
									}
								}, (err, doc) => {});
							}
						}
					});
				}
			}
		}
	});
}

function updateNextShareUser() {
	let nowDate = new Date();
	nowDate = nowDate.format('hh:mm');
	if (nowDate === '22:00') {
		System.find({
			name: 'config'
		}, (err, doc) => {
			if (doc && Object.keys(doc).length) {
				let isInholiday = _util.isHoliday(new Date(), doc[0]);
				let isNotShareDay = _util.isNotShareDay(new Date(), doc[0]);
				if (!isNotShareDay && !isInholiday) {
					getUsers((users, sys) => {
						let nextShareUser = _util.getNextShareUserBySys(users, sys);
						let updateUser = _util.getNextShareUserByUser(nextShareUser, users, sys);
						updateUser = _util.checkRulesAndReturnUser(updateUser, users, sys);
						setShareInfo(updateUser);
					});
				}
			}
		});
	}
}

function setShareInfo(user) {
	let _id = user && user.user && user.user._id? user.user._id.toString(): '';

	System.update({
		name: 'config'
	}, {
		$set: {
			nextshareuserid: _id,
			nextsharedate: user.date || null
		}
	}, (err, sys) => {});
}

//日历分享列表
router.get('/system/sharelist', function (req, res, next) {
	var data = req.body;

	System.findOne({
		name: 'config'
	}, (err, sys) => {
		if (sys && Object.keys(sys).length) {
			getUsers((users, sys) => {
				let result = [];
				let nexter = null;
				let isInholiday = _util.isHoliday(new Date(), sys);
				let isShareDay = !_util.isNotShareDay(new Date(), sys);
				let nextShareUser = _util.getNextShareUserBySys(users, sys);
				let prevUser = null;

				if (isShareDay && !isInholiday) {
					prevUser = _util.getPrevShareUserByUser(users, sys, nextShareUser);

					result.push({
						title: prevUser.user && prevUser.user.name? prevUser.user.name : '',
						start: new Date(prevUser.date).format('yyyy-MM-dd'),
						color: '#bfc1c3'
					});
				}

				//下一次分享人员
				nextShareUser = _util.checkRulesAndReturnUser(nextShareUser, users, sys);
				nexter = nextShareUser;

				if(!nexter || !nexter.user || !Object.keys(nexter.user).length) {
					res.json({
						success: false,
						msg: '请设置初始分享人员！'
					});
				} else {
					result.push({
						title: nexter.user.name,
						start: new Date(nexter.date).format('yyyy-MM-dd'),
						color: '#0d70c5'
					});

					for (let i = 0, len = 14; i < len; i++) {
						nexter = _util.getNextShareUserByUser(nexter, users, sys);
						nexter = _util.checkRulesAndReturnUser(nexter, users, sys);
						result.push({
							title: nexter.user.name,
							start: new Date(nexter.date).format('yyyy-MM-dd'),
							color: '#bfc1c3'
						});
					}
					res.json({
						success: true,
						data: result
					});
				}
			});
		} else {
			res.json({
				success: false,
				msg: '获取失败！'
			});
		}
	});
});

//分享初始化接口
router.put('/system/shareinit', function (req, res, next) {
	var data = req.body;

	System.findOneAndUpdate({
		name: 'config'
	}, {
		$set: {
			startuserid: data.startuserid,
			startsharetime: data.startsharetime
		}
	}, (err, sys) => {
		if (sys && Object.keys(sys).length) {
			getUsers((users, sys) => {
				let nextShareUser = _util.getNextShareUser(users, sys);
				setShareInfo(nextShareUser);
				res.json({
					success: true
				});
			});
		} else {
			res.json({
				success: false,
				msg: '更新失败！'
			});
		}
	});
});

//分享规则设置接口
router.put('/system/sortrules', function (req, res, next) {
	var data = req.body;
	if (!data.sortrules || !data.sortrules.length) {
		res.json({
			success: false,
			msg: '至少选中一条数据！'
		});
	} else {
		System.findOneAndUpdate({
			name: 'config'
		}, {
			$set: {
				sortrules: data.sortrules,
				sorttype: data.sorttype || 'normal'
			}
		}, (err, sys) => {
			if (sys && Object.keys(sys).length) {
				getUsers((users, sys) => {
					let nextShareUser = _util.getNextShareUser(users, sys);
					setShareInfo(nextShareUser);
					res.json({
						success: true,
						msg: '更新成功！'
					});
				});
			} else {
				res.json({
					success: false,
					msg: '更新失败！'
				});
			}
		});
	}
});

//工具函数
var _util = {
	/**
	 * "yyyy-MM-dd hh:mm:ss" 转化为 DateTime
	 * @param {date} dateStr 日期字符串，例如"yyyy-MM-dd"
	 */
	dateStrToDate(dateStr) {
		if (!!dateStr) {
			return new Date(dateStr.replace(/-/g, '/'));
		}
	},
	/**
	 * 获取邮件发送对象
	 * @return {object} obj
	 */
	getMmailer() {
		return nodemailer.createTransport({
			host: 'smtp.mxhichina.com',
			secure: true,
			port: 465,
			auth: {
				user: 'wuchao@zqykj.com',
				pass: 'Wc57242252'
			}
		});
	},
	/**
	 * 邮件配置
	 * @param {string} address  要发送至的邮件地址
	 * @param {string} userName 发送给谁（用户名）
	 * @param {date} shareDate 分享日期
	 * @return {object} obj
	 */
	getMailOpt(address, userName, shareDate) {
		return {
			from: 'wuchao@zqykj.com',
			to: address,
			subject: '每日分享提醒',
			text: userName + _util.getMailText(shareDate),
			html: `<div style="padding: 2px 50px;">
                    <p>${userName}${_util.getMailText(shareDate)}</p>
                    <img src="//img.aimoge.com/FuDtKJnZ95One-tcdPKwul0ulhBX"/>
                    <p>具体日程参加：<a href="http://172.30.6.50:9200" target="_blank">http://172.30.6.50:9200</a></p>
                </div>`
		};
	},
	/**
	 * 发送邮件主方法
	 * @param {string} address  要发送至的邮件地址
	 * @param {string} userName 发送给谁（用户名）
	 * @param {date} shareDate 分享日期
	 */
	sendEMail(address, userName, shareDate) {
		let transporter = _util.getMmailer();
		let opt = _util.getMailOpt(address, userName, shareDate);
		transporter.sendMail(opt, function (error, info) {
			if (error) {
				console.log('邮件发送失败：' + error);
			} else {
				console.log('邮件发送: ' + info.response);
			}
		});
	},
	/**
	 * 邮件正文
	 * @param {date} shareDate 下一次分享日期
	 * @return {string} 文本
	 */
	getMailText(shareDate) {
		let texts = ['日', '一', '二', '三', '四', '五', '六'];
		let shareDay = texts[shareDate.getDay()];
		return '，您好！您的分享定于' + shareDate.format('yyyy-MM-dd') + '（周' + shareDay + '）9点，请及时准备！期待您的分享哦～';
	},
	/**
	 * 判断日期是否不是分享日
	 * @param {date} date 日期
	 * @param {object} sys  系统配置
	 * @return {boolean} 布尔值
	 */
	isNotShareDay(date, sys) {
		let flag = true;
		let day = new Date(date).getDay() === 0 ? 7 : new Date(date).getDay();
		let rules = sys.sortrules || [];
        const result = [];
		for (let i = 0, len = rules.length; i < len; i++) {
			if (rules[i] === day) {
				flag = false;
				break;
			}
		}
		return flag;
	},
	/**
	 * 判断明天是否是节假期
	 * @param {date} date 日期
	 * @param {object} sys  系统配置
	 * @return {boolean} 布尔值
	 */
	isHoliday(date, sys) {
		let flag = false;
		let nowDate = _util.getNowDateMills();
        let dateStr = new Date(nowDate).format('yyyy-MM-dd');
        let holidays = sys.holiday || [];
        const result = [];
		holidays = holidays && Object.keys(holidays[0]).length ? holidays[0] : {};
        for (const m in holidays) {
			let days = holidays[m];
			let start = _util.getNowDateMills(_util.dateStrToDate(m));
			for (let i = 0; i < days; i++) {
				let newDate = start + i * oneDay;
				result.push(new Date(newDate).format('yyyy-MM-dd'));
			}
		}
        for (const str of result) {
            if (dateStr === str) { // 节假日，不发邮件
				flag = true;
				break;
            }
        }
		return flag;
	},
	/**
	 * 获取日期时间戳
	 * @param {date} 日期
	 * @return {number} 时间戳
	 */
	getNowDateMills(date) {
		return new Date((date || new Date()).format('yyyy/MM/dd')).getTime();
	},
	/**
	 * 移除admin账号
	 * @param {Array} users 排序后的人员列表
	 * @return {Array} 人员列表
	 */
	removeAdminFromUsers(users) {
		let result = [];
		for (let i = 0, len = users.length; i < len; i++) {
			if (users[i] && users[i].username !== 'admin') {
				result.push(users[i]);
			}
		}
		return result;
	},
	/**
	 * 根据开始分享人员，将users数组截成2段
	 * @param {Array} users 排序后的人员列表
	 * @param {string} startUid   初始分享人员id
	 * @return {object} 字典
	 */
	slpitUsersArray(users, startUid) {
		let result = {};
		for (let i = 0, len = users.length; i <= len; i++) {
			if (users[i] && startUid && users[i]._id.toString() === startUid.toString()) {
				result = {
					a0: users.slice(0, i),
					a1: users.slice(i)
				};
			}
		}
		return result;
	},
	/**
	 * 获取非工作日（法定节假日、公司临时假期）列表，其中并去除非分享日期
	 * @param {object} sys 系统配置
	 * @return {Array} 日期数组
	 */
	getOutWorkDates(sys) {
		let result = [];
		let nowDate = _util.getNowDateMills();
		let holidays = sys.holiday;
		let outWorkDays = sys.outworkday;
		holidays = holidays && Object.keys(holidays[0]).length ? holidays[0] : {};
		outWorkDays = outWorkDays && outWorkDays[0] && Object.keys(outWorkDays[0]).length ? outWorkDays[0] : {};
		for (m in holidays) {
			let days = holidays[m];
			let start = _util.getNowDateMills(_util.dateStrToDate(m));
			for (let i = 0; i < days; i++) {
				let newDate = start + i * oneDay;
				if (newDate > nowDate) {
					result.push(new Date(newDate));
				}
			}
		}
		for (n in outWorkDays) {
			let days1 = outWorkDays[n];
			let start1 = _util.getNowDateMills(_util.dateStrToDate(n));
			for (let j = 0; j < days1; j++) {
				let newDate1 = start1 + j * oneDay;
				if (newDate1 > nowDate) {
					result.push(new Date(newDate1));
				}
			}
		}
		result = _util.removeNoShareDays(result, sys);
		return result;
	},
	/**
	 * 获取上一次分享人员信息（时间点baseOn new Date()），作为排序的初始人员
	 * @param {Array} users 排序后的人员列表
	 * @param {object} sys   系统配置
	 * @return {object} 人员信息对象
	 */
	getPrevShareUser(users, sys) {
		let result = {};
		let sharedDays = [];
		let sharedDaysLen = 0;
		let startUid = sys.startuserid || (users && users[0]? users[0]._id : '');
		let prevShareDate = _util.getPrevShareDate(sys);
		let sortedUsers = _util.slpitUsersArray(users, startUid);
		let nowDate = _util.getNowDateMills();
		let totalDays = _util.getTotalDays(sys);
		let startShareDate = sys && sys.startsharetime ? new Date(sys.startsharetime).getTime() : nowDate;
		let startuserid = (sys.startuserid || (users && users[0]? users[0]['_id'] : '')).toString();
		let prevDays = 0;

		if (nowDate === startShareDate) {
			sortedUsers = sortedUsers['a1'].concat(sortedUsers['a0']);
			return {
				user: sortedUsers[sortedUsers.length - 1],
				date: prevShareDate
			};
		}

		if (nowDate > startShareDate) {
			prevDays = (nowDate - startShareDate) / oneDay;
			sharedDays = _util.getSharedDays(new Date(nowDate), prevDays, sys);
			sharedDaysLen = sharedDays.length;
			sortedUsers = sortedUsers['a1'].concat(sortedUsers['a0']);
		} else { //初始分享日期在今天之后
			prevDays = (nowDate - prevShareDate) / oneDay;
			sharedDays = _util.getSharedDays(new Date(startShareDate), prevDays + totalDays, sys);
			sharedDaysLen = sharedDays.length;
			sortedUsers = sortedUsers && sortedUsers['a1']? sortedUsers['a1'].concat(sortedUsers['a0']).reverse(): [];
		}

		if (sortedUsers.length < sharedDaysLen) { //已分享天数 > 人员数
			result = sortedUsers[sharedDaysLen % sortedUsers.length - 1];
		} else {
			result = sortedUsers[sharedDaysLen - 1];
		}
		startShareDate = sharedDays[sharedDaysLen - 1];

		return {
			user: result,
			date: new Date(startShareDate)
		};
	},
	getPrevShareUserByUser(users, sys, user) {
		let _date = null;
		let splitUsers = _util.slpitUsersArray(users, user.user.id);
		splitUsers = (splitUsers['a1'] || []).concat(splitUsers['a0'] || []);
		return {
			user: splitUsers[splitUsers.length - 1],
			date: _util.getPrevShareDate(sys, user.date)
		};
	},
	/**
	 * 获取下一次分享人员信息（未检查规则；时间点baseOn new Date()）
	 * @param {Array} users 排序后的人员列表
	 * @param {object} sys   系统配置
	 * @return {object} 人员信息对象
	 */
	getNextShareUser(users, sys) {
		let nowDate = _util.getNowDateMills();
		let nextShareUser = {};
		let prevShareUser = _util.getPrevShareUser(users, sys);
		let nextShareDay = _util.getNextShareDate(sys);
		let commingDays = _util.getTotalDaysFromToday(nextShareDay);
		let prevUserId = prevShareUser && prevShareUser.user && prevShareUser.user._id? prevShareUser.user._id: '';
		let sortedUsers = _util.slpitUsersArray(users, prevUserId);
		let isTodayShareDay = !_util.isNotShareDay(nowDate, sys);
		let index = isTodayShareDay ? 2 : 1;
		nextShareUser = sortedUsers && sortedUsers['a1']? sortedUsers['a1'].concat(sortedUsers['a0'])[index]: {};
		return {
			user: nextShareUser,
			date: nextShareDay
		};
	},
	/**
	 * 获取初始化后的下一次分享人员信息
	 * @param {Array} users 排序后的人员列表
	 * @param {object} sys   系统配置
	 * @return {object} 人员信息对象
	 */
	getNextShareUserBySys(users, sys) {
		let nextShareUser = _util.getUserInfoById(sys.nextshareuserid, users);
		let result = {
			user: nextShareUser,
			date: new Date(sys.nextsharedate)
		};
		return result;
	},
	/**
	 * 获取指定人员的下一个人员信息
	 * @param {object} user  指定人员信息
	 * @param {Array} users 排序后的人员列表
	 * @param {object} sys   系统配置
	 * @return {object} 人员信息对象
	 */
	getNextShareUserByUser(user, users, sys) {
		let nextShareUser = {};
		let nextShareDay = _util.getNextShareDate(sys, user.date);
		let sortedUsers = _util.slpitUsersArray(users, user.user._id);
		nextShareUser = sortedUsers['a1']? sortedUsers['a1'].concat(sortedUsers['a0'])[1]: null;
		return {
			user: nextShareUser,
			date: nextShareDay
		};
	},
	/**
	 * 获取正确的下一次分享的人员信息（排除法定／公司临时假期）
	 * @param {object} user  指定人员信息
	 * @param {Array} users 排序后的人员列表
	 * @param {object} sys   系统配置
	 * @return {object} 人员信息对象
	 */
	checkRulesAndReturnUser(user, users, sys, nextShareDay) {
		let isInHoliday = false;
		let outWorkDays = _util.getOutWorkDates(sys);
		if (nextShareDay) {
			nextShareDay = _util.getNextShareDate(sys, nextShareDay);
		} else {
			nextShareDay = user.date;
		}
		for (let i = 0, len = outWorkDays.length; i <= len; i++) {
			if (new Date(nextShareDay).format('yyyy-MM-dd') === new Date(outWorkDays[i]).format('yyyy-MM-dd')) {
				isInHoliday = true;
				break;
			}
		}
		if (!isInHoliday) {
			return {
				user: user.user,
				date: nextShareDay
			};
		} else {
			return _util.checkRulesAndReturnUser(user, users, sys, nextShareDay);
		}
	},
	/**
	 * 检查分享人员是否休假，返回正确的分享人员
	 * @param {object} user  指定人员信息
	 * @param {Array} users 排序后的人员列表
	 * @param {object} sys   系统配置
	 * @return {object} 人员信息对象
	 */
	checkIsInHolidayAndReturnUser(user, users, sys, prevUser) {
		console.log('0=============');

		function getNexter(user, users, sys) {
			let nexter = {};
			let isShared1 = false;
			let rplno = user.user.replaceno;
			rplno = rplno.indexOf('#') > -1 ? rplno : '';
			isShared1 = rplno.split('#')[1];
			isShared1 = isShared1 && isShared1.trim() !== '0' ? true : false;
			rplno = rplno.split('#')[0];
			nexter = _util.getNextShareUserByUser(user, users, sys);
			nexter.date = user.date;
			if (isShared1) {
				return getNexter(nexter, users, sys);
			} else {
				return nexter;
			}
		}

		let hasReplacer = false;
		let isShared = false;
		let isInHoliday = _util.isInHoliday(user);
		let replaceno = user.user.replaceno;
		let replaceUser = {};
		let nextShareUser = getNexter(user, users, sys);
		replaceno = replaceno.indexOf('#') > -1 ? replaceno : '';
		console.log(replaceno);
		isShared = replaceno.split('#')[1];
		isShared = isShared && isShared.trim() !== '0' ? true : false;
		replaceno = replaceno.split('#')[0];
		console.log(isShared, replaceno);

		if (replaceno) {
			replaceUser = {
				user: _util.getUserInfoById(replaceno, users),
				date: user.date
			};
			let rplInholiday = _util.isInHoliday(replaceUser);
			if (rplInholiday) {
				if (isShared) {
					console.log('1-1=============' + nextShareUser.user.name);
					return _util.checkIsInHolidayAndReturnUser(nextShareUser, users, sys, user);
				} else {
					if (!isInHoliday) {
						console.log('1-1-1=============' + user.user.name);
						setReplaceNo(user.user._id, user.user.replaceno.split('#')[0] + '#1');
						return user;
					} else {
						console.log('1-1-2=============' + user.user.name, nextShareUser.user.name);
						setReplaceNo(nextShareUser.user._id, user.user._id.toString() + '#0');
						return _util.checkIsInHolidayAndReturnUser(nextShareUser, users, sys, user);
					}
				}
			} else {
				console.log('1-2=============' + replaceUser.user.name);
				setReplaceNo(replaceUser.user._id, '');
				return replaceUser;
			}
		} else {
			if (isShared) {
				console.log('2-1=============');
				return _util.checkIsInHolidayAndReturnUser(nextShareUser, users, sys, user);
			} else {
				if (!isInHoliday) {
					console.log('2-2=============');
					setReplaceNo(user.user._id, prevUser.user._id.toString() + '#1');
					return user;
				} else {
					console.log('2-3=============' + nextShareUser.user.name);
					setReplaceNo(nextShareUser.user._id, user.user._id.toString() + '#0');
					return _util.checkIsInHolidayAndReturnUser(nextShareUser, users, sys, user);
				}
			}
		}
	},
	/**
	 * 检查分享人员是否休假
	 * @param {object} user  指定人员信息
	 * @return {boolean}
	 */
	isInHoliday(user) {
		let isInHoliday = false;
		let shareDate = _util.getNowDateMills(user.date);
		let outworkdays = user.user.outworkdays;
		let startDate = null;
		let endDate = null;
		if (outworkdays) {
			startDate = new Date(_util.getNowDateMills(user.user.outworkdate));
			endDate = new Date(startDate.getTime() + (outworkdays - 1) * oneDay);
			if (shareDate <= endDate.getTime() && shareDate >= startDate.getTime()) {
				isInHoliday = true;
			}
		}
		return isInHoliday;
	},
	/**
	 * 根据userid获取用户信息
	 * @param {string} _id userid
	 * @param {Array} users 排序后的人员列表
	 * @return {Array} 数组
	 */
	getUserInfoById(_id, users) {
		let result = {};
		for (let i = 0, len = users.length; i <= len; i++) {
			if (users[i] && users[i]._id.toString() === _id) {
				result = users[i];
			}
		}
		return result;
	},
	/**
	 * 根据天数和方向获取已经分享/即将分享的具体日期数组
	 * @param {date} date      日期
	 * @param {number} days      分享已历时多少天
	 * @param {object} sys   系统配置
	 * @param {number} direction 0/undefined -> 向前获取，1 -> 向后获取
	 * @return {Array} 日期数组
	 */
	getSharedDays(date, days, sys, direction) {
		let startDate = _util.getNowDateMills(date);
		let rules = sys.sortrules || [];
		let theDate = null;
		let result = [];
		if (days) {
			for (let i = 1, len = days; i <= len; i++) {
				if (direction) {
					theDate = new Date(startDate + i * oneDay);
				} else {
					theDate = new Date(startDate - i * oneDay);
				}
				result.push(theDate);
			}
			result = _util.removeNoShareDays(result, sys);
		}
		return result;
	},
	/**
	 * 移除不需要分享的日期
	 * @param {Array} dates 日期列表
	 * @param {object} sys   系统配置
	 * @return {Array} 日期列表
	 */
	removeNoShareDays(dates, sys) {
		let flag = false;
		let result = [];
		let rules = sys.sortrules || [];
		if (dates && dates.length) {
			for (let i = 0, len = dates.length; i <= len; i++) {
				for (let j = 0, len1 = rules.length; j <= len1; j++) {
					if (dates[i] && (dates[i].getDay() === 0 ? 7 : dates[i].getDay()) === rules[j]) {
						flag = true;
					}
				}
				if (flag && dates[i]) {
					result.push(dates[i]);
				}
				flag = false;
			}
		}
		return result;
	},
	/**
	 * 获取从初始分享日到今天的时间间隔（单位：天）
	 * @param {object} sys   系统配置
	 * @return {number} 天数
	 */
	getTotalDays(sys) {
		let nowDate = _util.getNowDateMills();
		let startShareDate = sys && sys.startsharetime ? new Date(sys.startsharetime).getTime() : nowDate;
		let days = (nowDate - startShareDate) / oneDay;
		return days < 0 ? -days : days;
	},
	/**
	 * 获取从日期到今天的时间间隔（单位：天）
	 * @param {date} date   日期
	 * @return {number} 天数
	 */
	getTotalDaysFromToday(date) {
		let toDate = _util.getNowDateMills(date);
		let nowDate = _util.getNowDateMills();
		let days = (nowDate - toDate) / oneDay;
		return days < 0 ? -days : days;
	},
	/**
	 * 获取附近8天
	 * @param {number} direction 0/undefined -> 前8天，1 -> 后8天
	 * @param {object} date      开始分享日期
	 * @return {Array}   日期数组
	 */
	getAroundEightDays(direction, date) {
		date = !!date ? new Date(date) : new Date();
		let theDate = null;
		let result = [];
		for (let i = 1, len = 8; i <= len; i++) {
			if (direction) {
				theDate = new Date(date.getTime() + i * oneDay);
			} else {
				theDate = new Date(date.getTime() - i * oneDay);
			}
			result.push(theDate);
		}
		return result;
	},
	/**
	 * 获取上一个分享日期
	 * @param {type}     sys         系统配置
	 * @param {[[Type]]} date        基准日期，baseOnShare=(false/undefined)时，传null/undefined/Date格式数据；baseOnShare=true时，请传null，否则程序会出错
	 * @param {boolean}  baseOnShare 是否以系统配置的初始分享日期为基准，默认为false
	 * @return {date}   日期
	 */
	getPrevShareDate(sys, date, baseOnShare) {
		let sysShareDate = sys && sys.startsharetime ? sys.startsharetime : new Date();
		let startshareDate = baseOnShare ? sysShareDate : (date ? date : new Date());
		let prev8days = _util.getAroundEightDays(0, startshareDate);
		let rules = sys.sortrules || [];
		let flag = false;
		let result = null;
		for (let i = 0, len = prev8days.length; i < len; i++) {
			for (let j = 0, len1 = rules.length; j < len1; j++) {
				if (prev8days[i] && (prev8days[i].getDay() === 0 ? 7 : prev8days[i].getDay()) === rules[j] && !flag) {
					flag = true;
					result = new Date(_util.getNowDateMills(prev8days[i]));
					break;
				}
			}
		}
		return result;
	},
	/**
	 * 获取下一个分享日期
	 * @param {object}  sys         系统配置
	 * @param {[[Type]]} date        基准日期，baseOnShare=(false/undefined)时，传null/undefined/Date格式数据；baseOnShare=true时，请传null，否则程序会出错
	 * @param {boolean} baseOnShare 是否以系统配置的初始分享日期为基准，默认为false
	 * @return {date}   日期
	 */
	getNextShareDate(sys, date, baseOnShare) {
		let sysShareDate = sys && sys.startsharetime ? sys.startsharetime : new Date();
		let startshareDate = baseOnShare ? sysShareDate : (date ? date : new Date());
		let next8days = _util.getAroundEightDays(1, startshareDate);
		let rules = sys.sortrules || [];
		let flag = false;
		let result = null;
		for (let i = 0, len = next8days.length; i < len; i++) {
			for (let j = 0, len1 = rules.length; j < len1; j++) {
				if (next8days[i] && (next8days[i].getDay() === 0 ? 7 : next8days[i].getDay()) === rules[j] && !flag) {
					flag = true;
					result = new Date(_util.getNowDateMills(next8days[i]));
					break;
				}
			}
		}
		return result;
	}
};

//定时任务入口
setInterval(() => {
	sendEmailFunc();
	updateNextShareUser();
}, 60 * 1000);

module.exports = router;
