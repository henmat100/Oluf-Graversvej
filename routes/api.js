const db = require('../config/database')();
const fs = require('fs');

module.exports = function (app) {

    //admin product route
    //GET bruger man til at få noget ind på siden, i dette eks. i input felterne.
	app.get('/api/categories', (req,res) => {
		db.query(`SELECT * FROM categories`, (err, results) => {
			if (err) res.send(err);
			res.json(results);
		})
	});
	
	 //admin product route
    //GET bruger man til at få noget ind på siden, i dette eks. i input felterne.
	app.get('/api/roles', (req,res) => {
		db.query(`SELECT * FROM roles`, (err, results) => {
			if (err) res.send(err);
			res.json(results);
		})
    });
}

