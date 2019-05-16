const db = require('../config/database')();
const moment = require('moment');
const roleCheck = require('../middleware/role-check');
module.exports = function (app) {
    app.get('/bookingstid', [roleCheck.customers], (req, res) => {
        db.query(`SELECT * FROM menu ORDER BY position`, (err, menus) =>{   
            if (err) res.send(err);
            db.query(`SELECT reservationer.id, reservationer.dato, slots.start AS starts, slots.slut AS ends FROM reservationer
                INNER JOIN slots ON reservationer.slot_fk = slots.id
                WHERE user_fk = ?`, [req.session.user], (err, reservationer) =>{   
                if (err) res.send(err);
                res.render('reservationstimer', {title: 'booking', menus, reservationer, moment})
            }) 
        }) 
    });
    app.post('/bookingstid', (req, res) =>{
        let susses = true;
        let errorMessage = [];
        console.log(req.fields);
        if(req.fields.date === ''){
            errorMessage = 'vælg en dato';
            sussesn = false;
        }
        if(susses === true){
            res.redirect(`/booking/${req.fields.date}`)
        }else{
            res.render('reservatimer', {errorMessage}); 
        }
    })

    app.get('/booking/:date', (req, res) => {
        //henter alt fra databasen
        db.query(`SELECT * FROM menu ORDER BY position`, (err, menus) =>{   
            if (err) res.send(err);
           
            db.query(`SELECT * FROM slots`, (err, booking) =>{
                if (err) res.send(err);
                db.query('SELECT * FROM oluf.reservationer WHERE dato = ?', [req.params.date],(err ,reservationstimer) =>{
                    if(err) {
                        throw err;
                    }else{
                        booking.forEach(bookin => {
                            (reservationstimer || []).forEach(reservationstime =>{
                                if(bookin.id === reservationstime.slot_fk && moment(req.params.date).format('YYYY-MM-DD') == moment(reservationstime.dato).format('YYYY-MM-DD')){
                                    bookin.reservationstime = reservationstime;
                                }
                            });
                        });
                        db.query(`SELECT reservationer.id, reservationer.dato, slots.start AS starts, slots.slut AS ends FROM reservationer
                            INNER JOIN slots ON reservationer.slot_fk = slots.id
                            WHERE user_fk = ?`, [req.session.user], (err, reservationer) =>{   
                            if (err) res.send(err);
                            res.render('booking', { 'title': 'Bookinger', 'content': 'Vælg først en tid, og tryk derefter på Book en tid.','menus': menus, 'booking': booking, reservationstimer, reservationer, moment});
                        }) 
                    
                    }
                })    
                
            }) 
        })   
    });

    app.post('/booking/', (req,res) =>{
        let susses = true;
        let errorMessage;
        if(susses === true){
            db.query('INSERT INTO reservationer (user_fk, slot_fk, dato) VALUES (?, ?, ?)', [req.session.user, req.fields.slotid, req.fields.date],function(err, results){
                if(err) {
                    throw err;
                }else{
                    res.status(200);
                    res.end();
                }

            })
        } else{
            db.query(`SELECT * FROM slots`, (err, booking) =>{
                if(err){
                    throw err;
                }else{
                    res.json({
                        errorMessage
                    })
                }

            }) 
        }
    })

    app.delete('/admin/reservation/:id', (req, res, next) => {
		db.query(`DELETE FROM reservationer WHERE id = ?`, [req.params.id], (err, results) => {
			if (err) return next(err);
			res.status(200);
			res.end();
		})
    });
};