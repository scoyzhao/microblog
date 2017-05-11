// "use strict";
const auth = require('../controllers/auth.js');
const post = require('../controllers/post.js')

module.exports = function(app) {

    app.get('/', function(req, res) {
    	res.render('index');
    });

    // 注册路由检查是否已经登录，如果没有登录才可以继续
    app.get('/reg', auth.checkNotLoggedIn, auth.getReg);
    app.post('/reg', auth.checkNotLoggedIn, auth.reg);

    // 登录路由检是否已经登录，没有登录才可以继续
    app.get('/login', auth.checkNotLoggedIn, auth.getLogin);
    app.post('/login', auth.checkNotLoggedIn, auth.login);

    app.get('/logout', auth.checkLoggedIn, auth.logout);

    app.get('/user', auth.checkLoggedIn, post.user);
    app.post('/user', auth.checkLoggedIn, post.say);

    app.get('/user/:user', auth.checkLoggedIn, post.getUser);
};
