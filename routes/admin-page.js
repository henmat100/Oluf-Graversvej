const db = require('../config/database')();
const fs = require('fs');

module.exports = function (app) {

    //admin product route
    //GET bruger man til at få noget ind på siden, i dette eks. i input felterne.
	app.get('/admin/side', (req,res) => {
		db.query(`SELECT image, pages.name, pages.id, categories.name AS category FROM pages
			INNER JOIN categories ON pages.fk_category = categories.id`, (err, pages) => {
			if (err) res.send(err);
			res.render('admin/admin-page', { 'title': 'Admin - Redigér sider', 'pages': pages });
		})
	});
	
	
    //admin product route
    //GET bruger man til at få noget ind på siden, i dette eks. i input felterne.
	app.get('/admin/rediger-side/:id', (req,res) => {
		db.query(`SELECT * FROM pages WHERE id = ? `, [req.params.id], (err, pages) => {
			if (err) res.send(err);
			res.render('admin/admin-edit-page', { 'title': 'Admin - Redigér side', 'page': pages[0] });
		})
    });

	//admin product route
	//POST bruger man frks.til at sende fra en kontaktformular til databasen.
	app.post('/admin/side', (req,res, next) => {
		console.log(req.fields);
		
		db.query(`INSERT INTO pages (name, content, fk_category, image) VALUES (?, ?, ?, ?) `, [req.fields.name, req.fields.content, req.fields.categoryUpdate, req.files.image.name], (err, pages) => {

            //Dette kode skal bruges hvis man skal oploade et billede
			if (err) {
				return next(err);
			} else if (!req.files || !req.files.image) {
				return next(new Error('Der var ingen fil med formularen'));
			}
			fs.readFile(req.files.image.path, (err, data) => {
				if (err) {
					return next(new Error('Den midlertidige fil kunne ikke læses'))
				}
				fs.writeFile(`./public/media/${req.files.image.name}`, data, (err) => {
					if (err) {
						return next(new Error('Filen kunne ikke gemmes'));
					}
					res.redirect('/admin/side');
				});
			});
		})
	});
    
    //admin product route
	//PATCH bruger man til at Updatere noget.
	app.patch('/admin/side', (req, res) => {
		console.log(req.fields);
		
		db.query(`UPDATE pages SET name = ?, content = ?, fk_category = ? WHERE id = ?`, [req.fields.name, req.fields.content, req.fields.category, req.fields.id], (err, pages) => {
			if (err) res.send(err);
			res.status(204);
			res.end();
		})
    });
    
    	//admin menu route
	// Delete bruger man til at slette noget.
	app.delete('/admin/side/:id', (req, res, next) => {
		db.query(`DELETE FROM pages WHERE id = ?`, [req.params.id], (err, results) => {
			if (err) return next(err);
			res.status(200);
			res.end();
		})
	});
}