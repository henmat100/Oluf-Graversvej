const express = require('express');

module.exports = function (app) {
    app.set('views', 'views');           // I hvilken mappe findes visninger
    app.set('view engine', 'ejs');       // Which view engine to use
    app.use(express.static('./public')); // Hvor er statiske filer placeret
};