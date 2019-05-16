const db = require('../config/database')();
const fs = require('fs');

module.exports = function (app) {

    //admin Annonce-liste route
    //GET bruger man til at få noget ind på siden, i dette eks. i input felterne.
	app.get('/admin/annoncer', (req,res) => {
		db.query(`SELECT * FROM ads `, (err, annoncer) => {
			if (err) res.send(err);
			res.render('admin/admin-annonce', { 'title': 'Admin - Redigér annoncer', 'annoncer': annoncer });
		})
	});
	
	
    //admin rediger-annonce route
    //GET bruger man til at få noget ind på siden, i dette eks. i input felterne.
	app.get('/admin/rediger-annonce/:id', (req,res) => {
		db.query(`SELECT * FROM ads WHERE id = ? `, [req.params.id], (err, annoncer) => {
			if (err) res.send(err);
			res.render('admin/admin-edit-annonce', { 'title': 'Admin - Redigér annoncer', 'annonce': annoncer[0] });
		})
	});
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//admin annonce route
	//PATCH bruger man til at Updatere noget.
	//POST bruger man frks.til at sende fra en kontaktformular til databasen.
	app.post('/admin/annoncer', (req,res, next) => {
		db.query(`INSERT INTO ads (name, quantity, price, image) VALUES (?, ?, ?, ?) `, [req.fields.name, req.fields.quantity,  req.fields.price, req.files.image.name], (err, annoncer) => {

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
					res.redirect('/admin/annoncer');
				});
			});
		})
	});
	
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //admin product route
	//PATCH bruger man til at Updatere noget.
	app.patch('/admin/annoncer', (req, res) => {
		db.query(`UPDATE ads SET name = ?, quantity = ?, price = ? WHERE id = ?`, [req.fields.name, req.fields.quantity, req.fields.price, req.fields.id], (err, annoncer) => {
			if (err) res.send(err);
			res.status(204);
			res.end();
		})
	});
	
	// Opdatere billede i redigere produkt
	app.patch('/admin/ads/image/:id', (req, res, next) => {
		const file = req.files.photo; //Her for vi fat i billedet fra admin-edit-event formen.
		const renameFilename = `${Date.now()}_${file.name}`; //Her omdøber vi filnavnet så der er ekstra tal foran, så man ikke har to ene filnavne.

		let erroMessage;

		if (file.type.indexOf('image') === -1) { //Her kan man kun uploade billedefiler.
			erroMessage = 'Du har ikke valgt en korekt filtype';
			success = false;
				res.status(400);
				res.json( {
					erroMessage
				});
				return;
		}
		fs.readFile(file.path, (err, data) => {
			if (err) {
				return res.status(500).json({message:'kan ikke læse temp fil'});
			}
			fs.writeFile(`./public/media/${renameFilename}`, data, err => {
				if (err) {
					return res.status(500).json({message: 'kan ikke skrive nye fil'});
				}
				const sql = 'SELECT image FROM ads WHERE id = ?';
				db.query(sql, [req.params.id], (err, results) => {
					fs.unlink(`./public/media/${results[0].image}`, function (err, data) {
						if (err) {
							console.log(err)
							return res.status(500).json({message: 'kan ikke slette gammel fil'})
						}
						db.query('UPDATE ads SET image = ? WHERE id = ?', [renameFilename, req.params.id], (err, results) => {
							if (err) {
								return res.status(500);
							}
							res.status(200);
							res.json({
								image: renameFilename
							});
						});
					});
				});
			});
		});
	});

	
		
	 
        
	
        

	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    	//admin menu route
	// Delete bruger man til at slette noget.
	app.delete('/admin/annonce/:id', (req, res, next) => {
		db.query(`DELETE FROM ads WHERE id = ?`, [req.params.id], (err, results) => {
			if (err) return next(err);
			res.status(200);
			res.end();
		})
	});
}