const db = require('../config/database')();
const fs = require('fs');

module.exports = function (app) {
    
//admin menu route
	//GET bruger man til at få noget ind på siden.
	app.get('/admin/menu', (req,res) => {
		db.query(`SELECT * FROM menu ORDER BY position`, (err, menus) => {
			if (err) res.send(err);
			res.render('admin/admin-menu', { 'title': 'Admin - Redigér menupunkt', 'menus': menus });
		})
	});

	//admin menu route
	//POST bruger man frks.til at sende fra en kontaktformular til databasen.
	app.post('/admin/menu', (req,res) => {
		let  success = true;
		let  errorMessage;
	
		
		if(req.fields.position == ''){
			success = false;
			errorMessage = 'Feltet Position, er tomt!';
		}
		if(req.fields.name == ''){
			success = false;
			errorMessage = 'Feltet navn, er tomt!';
		}
		if(req.fields.name && !/^[A-Za-z ]+$/.test(req.fields.name)){
			success = false;
			errorMessage = 'Der må kun bruges bogstaver i navne feltet!';
		}
		if(isNaN(req.fields.position)){
			success = false;
			errorMessage = 'Der må kun skives tal i position feltet!';
		}
		
		if(success){
			db.query(`INSERT INTO menu (name, position, url) VALUES (?, ?, ?) `, [req.fields.name, req.fields.position, req.fields.url], (err, menus) => {
				if (err) res.send(err);
				res.status(200);
				res.redirect('/admin/menu');
			})
		} else{
			db.query(`SELECT * FROM menu ORDER BY position`, (err, menus) => {
				if (err) res.send(err);
				res.render('admin/admin-menu', { 'title': 'Admin - Redigér menupunkt', 'menus': menus, errorMessage, ...req.fields });
			})
		}
		
	});

	//admin menu route
	//PATCH bruger man til at Updatere noget.
	app.patch('/admin/menu', (req,res) => {
		db.query(`UPDATE menu SET name = ?, position = ? WHERE id = ?`, [req.fields.name, req.fields.position, req.fields.id], (err, menus) => {
			if (err) res.send(err);
			res.status(204);
			res.end();
		})
	});

	//admin menu route
	// Delete bruger man til at slette noget.
	app.delete('/admin/menu/:id', (req, res, next) => {
		db.query(`DELETE FROM menu WHERE id = ?`, [req.params.id], (err, results) => {
			if (err) return next(err);
			res.status(200);
			res.end();
		})
    });
}