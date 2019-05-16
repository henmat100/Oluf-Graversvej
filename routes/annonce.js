const db = require('../config/database')();

module.exports = function (app) {
    app.get('/annoncer', (req, res) => {
        //henter alt fra databasen
        db.query(`SELECT * FROM menu ORDER BY position`, (err, menus) =>{
            if (err) res.send(err);
           
            db.query(`SELECT * FROM ads`, (err, annonce) =>{
                if (err) res.send(err);
                res.render('annonce', { 'title': 'Annoncer', 'menus': menus, 'content':  'Her vises alle ledige kontorlokaler', 'annoncer': annonce});
            }) 
        })   
    });
};