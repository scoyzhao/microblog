//"use strict";

const express = require('express');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const mongoose = require('mongoose');

const passport = require('./config/passport');
const auth = require('./controllers/auth.js');
const credentials = require('./credentials.js');

const app = express();

// set up handlebars view engine
const exphbs = require('express-handlebars');

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.set('port', process.env.PORT || 3000);

app.use(express.static(__dirname + '/public'));

// configue logger
app.use(logger('dev'));
// deal with form
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// for saving session in mongodb
app.use(cookieParser());
// use passport
// app.use(session({
//     secret: credentials.cookieSecret,
//     resave: false,
//     saveUninitialized: true,
//     store: new MongoStore({
//         // not db but url
//         url: credentials.db,
//     })
// }));
app.use(session({
    secret: credentials.cookieSecret,
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}));
app.use(passport.initialize());
app.use(passport.session());

// flash message middleware
app.use(function(req, res, next) {
    res.locals.flash = req.session.flash;
    delete req.session.flash;
    next();
});

// Connection to DB, if not configue promise, there will be a warning
mongoose.Promise = require('bluebird');
mongoose.connect(credentials.db);

// configue req.locals
app.use(auth.setCurrentUser);
// add routes
require('./config/routes.js')(app);

// 404 page
app.use(function(req, res) {
    // res.type('text/plain');
    res.status(404);
    res.render('404');
});

// 500 page
app.use(function(req, res, next) {
    console.error(err.stack);
    // res.type('text/plain');
    res.status(500);
    res.render('500');
});

app.listen(app.get('port'), () => {
    console.log(`\nExpress started on http://localhost:${app.get('port')}; press Ctrl-C to terminate.\n`);
});
