const db = require('../config/database')();

module.exports = function (app) {
    app.get('/', (req, res) => {
        //henter alt fra databasen
        db.query(`SELECT * FROM menu ORDER BY position`, (err, menus) =>{
            if (err) res.send(err);
           
            db.query(`SELECT * FROM ads ORDER BY price limit 3`, (err, products) =>{
                if (err) res.send(err);
                res.render('main', { 'title': 'Oluf Graversvejs Kontorfællesskab', 'content': 'Vi tilbyder kontorpladser til kreative selvstændige i åbne og lyse lokaler midt i København N.','menus': menus, 'products': products});
            }) 
        })   
    });
};