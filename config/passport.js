/*
    For passport
 */

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const User = require('../model/user.js'); // 实体数据库模块

// serializeUser 用户登录验证成功以后将会把用户的数据存储到 session 中
passport.serializeUser(function(user, done) {
    done(null, user);
});

// deserializeUser 每次请求的时将从 session 中读取用户对象，并将其封装到 req.user
passport.deserializeUser(function(user, done) {
    return done(null, user);
});

// 用户名密码验证策略
// passport.use(new LocalStrategy(
//     /*
//      * @param username 用户输入的用户名
//      * @param password 用户输入的密码
//      * @param done 验证验证完成后的回调函数，由passport调用
//      */

//     function(username, password, done) {
//         User.findOne({ username: username })
//             .then(function(result) {
//                 if (result != null) {
//                     if (result.password == password) {
//                         return done(null, result);
//                     } else {
//                         log.error('密码错误');
//                         return done(null, false, { message: '密码错误' });
//                     }
//                 } else {
//                     log.error('用户不存在');
//                     return done(null, false, { message: '用户不存在' });
//                 }
//             })
//             .catch(function(err) {
//                 log.error(err.message);
//                 return done(null, false, { message: err.message });
//             });
//     }
// ));
passport.use(new LocalStrategy(
    function(username, password, done) {
        User.findOne({ username: username }, function(err, user) {
            if (err) {
                return next(err);
            }
            if (!user) {
                return done(null, false);
            }
            if (!bcrypt.compareSync(password, user.password)) {
                return done(null, false);
            }
            return done(null, user);
        });
    }
));

module.exports = passport;
