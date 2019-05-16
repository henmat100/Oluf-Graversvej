const db = require('../config/database')();
const bcrypt = require('bcryptjs');

module.exports = function (app) {
	app.get('/login', (req, res, next) => {
		db.query(`SELECT * FROM menu ORDER BY position`, (err, menus) =>{
            if (err) res.send(err);
            if (req.query.status && req.query.status === 'badcredentials') {
				res.locals.status = 'Ugyldigt Brugernavn eller Adgangskode';
			}
			res.render('login', { title: 'Login', 'menus': menus });
        })  
		
	});

	app.post('/auth/login', (req, res, next) => {
		db.query(`SELECT users.id, users.password, roles.level AS role FROM users 
		INNER JOIN roles ON roles.id = users.fk_role
		WHERE username = ?`, [req.fields.username], (err, result) => {``
			if (err) return next(`${err} at db.query (${__filename}:9:5)`);
			if (result.length !== 1) {
				res.redirect('/login?status=badcredentials');
				return;
			}
			if (bcrypt.compareSync(req.fields.password, result[0].password)) {
				req.session.user = result[0].id;
				req.session.role = result[0].role;

				if (req.session.role >= 90)
					res.redirect('/admin');
				else if (req.session.role >= 80 && req.session.role < 90)
					res.redirect('/admin');
				else if (req.session.role >= 70 && req.session.role < 80)
					res.redirect('/profile');
				else if (req.session.role >= 60 && req.session.role < 70)
					res.redirect('/profile');
				else if (req.session.role >= 50 && req.session.role < 60)
					res.redirect('/bookingstid');
				else if (req.session.role >= 10 && req.session.role < 20)
					res.redirect('/profile');
				else
					res.redirect('/');
			} else {
				res.redirect('/login');
			}
		});
	});

	app.get('/auth/logout', (req, res, next) => {
		delete req.session.user;
		delete req.session.role;
		res.redirect('/');
	});
};
