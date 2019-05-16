const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('express-flash');

module.exports = function (app) {
    app.use(cookieParser('hej med dig'));

    app.use(session({
        'resave': false,
        'saveUninitialized': true,
        'secret': 'really secret stuffs'
    }));    
    
    app.use(flash());// Setup session handling
};

