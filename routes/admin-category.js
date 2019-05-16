const db = require('../config/database')();
const fs = require('fs');

module.exports = function (app) {
    
//admin menu route
	//GET bruger man til at få noget ind på siden.
	app.get('/admin/kategori', (req,res) => {
		db.query(`SELECT * FROM categories`, (err, categories) => {
			if (err) res.send(err);
			res.render('admin/admin-category', { 'title': 'Admin - Redigér categoriespunkt', 'categories': categories });
		})
	});

	//admin menu route
	//POST bruger man frks.til at sende fra en kontaktformular til databasen.
	app.post('/admin/kategori', (req,res) => {
		let  success = true;
		let  errorMessage;
		if (req.fields.name === "") {
				success = false;
				errorMessage = "Navn skal vare udfyldt!";
		}

		if(req.fields.name && !/^[A-Za-z ]+$/.test(req.fields.name)){
			success = false;
			errorMessage = 'Der må kun bruges bogstaver i navne feltet!';
		}

		if (success){
			db.query(`INSERT INTO categories (name) VALUES (?) `, [req.fields.name], (err, menus) => {
				if (err) res.send(err);
				res.status(200);
				res.redirect('/admin/kategori');
			});

		} else {
			db.query(`SELECT * FROM categories`, (err, categories) => {
				if (err) res.send(err);
				res.render('admin/admin-category', { 'title': 'Admin - Redigér categoriespunkt', 'categories': categories, errorMessage });
			});
		}
	
	});

	//admin menu route
	//PATCH bruger man til at Updatere noget.
	app.patch('/admin/kategori', (req,res) => {
		db.query(`UPDATE categories SET name = ? WHERE id = ?`, [req.fields.name, req.fields.id], (err, menus) => {
			if (err) res.send(err);
			res.status(204);
			res.end();
		})
	});

	//admin menu route
	// Delete bruger man til at slette noget.
	app.delete('/admin/kategori/:id', (req, res, next) => {
		db.query(`DELETE FROM categories WHERE id = ?`, [req.params.id], (err, results) => {
			if (err) return next(err);
			res.status(200);
			res.end();
		})
    });
}