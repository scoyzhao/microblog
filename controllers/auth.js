/*
    For auth
 */

"use strict";

const bcrypt = require('bcrypt');
const passport = require('passport');
const User = require('../model/user.js');

const bcryptSalt = 10;

module.exports = {
    /*
        处理注册逻辑
     */
    getReg: function(req, res) {
        res.render('reg');
    },

    reg: function(req, res, next) {
        // 需要的字段是否填写完整
        if (req.body.username === '' || req.body.password === '' || req.body['password-repeat'] === '') {
            req.session.flash = {
                type: 'danger',
                intro: 'E_OF_USER   ',
                message: '请填写完整',
            }
            return res.redirect('/reg');
        }
        // 输入的两次密码是否相等
        if (req.body['password-repeat'] != req.body['password']) {
            req.session.flash = {
                type: 'danger',
                intro: 'E_OF_USER   ',
                message: 'Password!',
            }
            return res.redirect('/reg');
        }
        // 数据库操作，存数据，注册成功后自动登录
        User.findOne({ username: req.body.username }, 'username', function(err, user) {
            if (user) {
                req.session.flash = {
                    type: 'danger',
                    intro: 'E_OF_USER   ',
                    message: 'The username already exists',
                }
                return res.redirect('/reg');
            }

            var salt = bcrypt.genSaltSync(bcryptSalt);
            var hashPass = bcrypt.hashSync(req.body.password, salt);

            var newUser = User({
                username: req.body.username,
                password: hashPass,
            });

            newUser.save(function(err) {
                if (err) {
                    req.session.flash = {
                        type: 'danger',
                        intro: 'E_OF_USER   ',
                        message: 'The username already exists',
                    }
                    return res.redirect('/reg');
                }
                // 这里这样写是为了立即执行它
                passport.authenticate('local')(req, res, function() {
                    //console.log(req.user);
                    return res.redirect('/user');
                });
            });

        })
    },

    /*
        处理登录逻辑
     */
    getLogin: function(req, res) {
        res.render('login');
    },

    login: function(req, res, next) {
        passport.authenticate('local', function(err, user, info) {
            if (err) {
                req.session.flash = {
                    type: 'danger',
                    intro: 'E_OF_USER   ',
                    message: 'error1',
                }
                return next(err);
            }
            if (!user) {
                req.session.flash = {
                    type: 'danger',
                    intro: 'E_OF_USER   ',
                    message: 'No user',
                }
                return res.redirect('/login');
            }
            req.logIn(user, function(err) {
                if (err) {
                    req.session.flash = {
                        type: 'danger',
                        intro: 'E_OF_USER   ',
                        message: 'Login error',
                    }
                    return next(err);
                }
                // console.log(req.user);
                // console.log(req.session.passport);
                // 从上面两个打印出来的东西可以知道，第一个是登录的用户信息，第二个是登录用户对象
                // console.log(req.isAuthenticated());
                // console.log(req.isUnauthenticated());
                // 上面俩函数按字面意思，验证可行
                return res.redirect('/user');
            });
        })(req, res, next);
    },

    /*
        处理登出逻辑
     */
    logout: function(req, res) {
        req.logout();
        delete res.locals.currentUser;
        delete req.session.passport;
        // delete currentUser and passport properties
        // becasuse when we calling req.logout() is leaving an empty object inside both properties. empty !== false, empty is a method that cannot compare with varible.
        res.redirect('/');
    },

    /*
        设置res.isUserLoggedIn，方便视图
     */
    setCurrentUser: function(req, res, next) {
        if (req.session.passport) {
            // cunrrentUser为了在navbar上显示用户姓名
            res.locals.currentUser = req.session.passport;
            res.locals.isUserLoggedIn = true;
        } else {
            // delete res.locals.currentUser;
            res.locals.isUserLoggedIn = false;
        }
        next();
    },

    /*
        设置权限，在每个页面的路有相应函数内检查用户是否已经登录
     */
    checkLoggedIn: function(req, res, next) {
        // return function(req, res, next) {
        //     if (req.isAuthenticated()) {
        //         return next();
        //     } else {
        //         req.session.flash = {
        //             type: 'danger',
        //             intro: 'E_OF_USER   ',
        //             message: message,
        //         };
        //         res.redirect(route);
        //     }
        // }
        if (req.isAuthenticated()) {
            return next();
        } else {
            req.session.flash = {
                type: 'danger',
                intro: 'E_OF_USER   ',
                message: 'You have to login first',
            };
            res.redirect('/login');
        }
    },

    /*
        设置权限，防止登录用户进入注册页面
     */
    checkNotLoggedIn: function(req, res, next) {
        if (req.isUnauthenticated()) {
            return next();
        } else {
            req.session.flash = {
                type: 'danger',
                intro: 'E_OF_USER   ',
                message: 'You have to logout first',
            };
            res.redirect('/user');
        }
    },
}
