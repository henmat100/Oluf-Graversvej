const db = require('../config/database')();
const fs = require('fs');

const roleCheck = require('../middleware/role-check');

module.exports = function (app) {
    
//admin menu route
	//GET bruger man til at få noget ind på siden.
	app.get('/admin/brugere', roleCheck.admins, roleCheck.superadmins, (req,res) => {
		db.query(`SELECT * FROM users`, (err, users) => {
			if (err) res.send(err);
			res.render('admin/admin-users', { 'title': 'Admin - Redigér bruger', 'users': users });
		})
	});

	//admin users route
	//POST bruger man frks.til at sende fra en kontaktformular til databasen.
	app.post('/admin/brugere', (req,res) => {
		db.query(`INSERT INTO users (username, password, fk_role) VALUES (?, ?, ?) `, [req.fields.name, req.fields.password, req.fields.roleUpdate], (err, users) => {
			if (err) res.send(err);
			res.status(200);
			res.redirect('/admin/brugere');
		})
	});

	//admin users route
	//PATCH bruger man til at Updatere noget.
	app.patch('/admin/brugere', (req,res) => {
		db.query(`UPDATE users SET username = ?, password = ?, fk_role = ? WHERE id = ?`, [req.fields.name, req.fields.password, req.fields.role, req.fields.id], (err, users) => {
			if (err) res.send(err);
			res.status(204);
			res.end();
		})
	});

	//admin users route
	// Delete bruger man til at slette noget.
	app.delete('/admin/brugere/:id', (req, res, next) => {
		db.query(`DELETE FROM users WHERE id = ?`, [req.params.id], (err, results) => {
			if (err) return next(err);
			res.status(200);
			res.end();
		})
    });
}