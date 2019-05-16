const db = require('../config/database')();
const fs = require('fs');

const roleCheck = require('../middleware/role-check');

module.exports = function (app) {
	
	//admin route
	//GET bruger man til at få noget ind på siden.
	app.get('/admin', [roleCheck.admins, roleCheck.superadmins], (req,res) => {
		res.render('admin/admin', { 'title': 'Admin - Her kan du rediger eller oprette et nyt menupunkt på forsiden. Du kan også rediger eller oprette en ny artikel, samt vælge eller rediger et billede. Vælg det punkt i menuen du gerne vil ændre.'});
	});
};
