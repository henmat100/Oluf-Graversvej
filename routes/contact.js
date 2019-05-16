const db = require('../config/database')();

module.exports = function (app) {

app.get('/kontakt', (req, res) => {
	db.query(`SELECT * FROM menu ORDER BY position`, (err, menus) =>{
		if (err) res.send(err);
		res.render('contact', { 'title': 'Kontakt', 'content': 'Send os en besked', 'menus': menus});
	})
	
});

app.post('/kontakt', (req, res) => {
	let succes = true;
	let errorMessage;
	let regexpNavn = /^[A-Za-z]+$/;
	let regexpBesked = /^[A-Za-zÆØÅæøå0-9-_., ]+$/;
	let regexpMail = /^[A-Za-zÆØÅæøå0-9_.]+[@]{1}[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;

	if (req.body) {
		if (!req.body.navn || !regexpNavn.test(req.body.navn) || req.body.navn.length <= 1) {
			succes = false;
			errorMessage = 'Ugyldigt navn';
		}
		if (!req.body.email || !regexpMail.test(req.body.email)) {
			succes = false;
			errorMessage = 'Ugyldig Email';
		}
		if (!req.body.textmessage || !regexpBesked.test(req.body.textmessage) || req.body.textmessage.length <= 1) {
			succes = false;
			errorMessage = 'Ugyldig besked';
		}
	} else {
		succes = false;
		errorMessage = 'Alt er galt';
	}

	if (succes) {
		let message;
		fs.writeFile(`./public/message/${new Date().getTime()}.json`, JSON.stringify(req.body), (error) => {
			if (error) {
				message = `Noget gik galt: ${error}`;
			} else {
				message = 'Tak for din besked, vi vender tilbage hurtigst muligt';
			}
			res.render('confirmation', { 'title': 'Kontakt', 'content': message});
		});
	} else {
		res.render('contact', { ...req.body, 'title': 'Kontakt', 'content': 'FEJL', 'errorMessage': errorMessage});
	}
});

};