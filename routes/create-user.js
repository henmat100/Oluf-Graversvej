const db = require('../config/database')();
const bcrypt = require('bcryptjs');

module.exports = function (app) {
    app.get('/create-user', (req,res) => {
        res.render('create-user', {'title': 'Registrering'} );
    });

    app.post('/create-user', (req, res) => {
        let success = true;
        let errorMessage = '';
        let regex = /^[A-Za-zæøåÆØÅ0-9 ]+$/;

        if (req.fields) {
            if (!regex.test(req.fields.username) || !req.fields.username || req.fields.username.length <= 0) {
                success = false;
                //errorMessage = 'Udfyld Brugernavn!';
                req.flash('error', 'Udfyld Brugernavn!');
            }

            if (!req.fields.password || req.fields.password.length <= 3) {
                success = false;
                errorMessagePass = 'Adgangskoden skal have mindst 4 tegn!';
            }

        } else {
            success = false;
            errorMessage = 'Alt er galt';
        }

        if (!success) {
            res.render('create-user', {'title': 'Registrering', 'content': 'Opret en profil', 'errorMessage': errorMessage} );
        }
        let hashed_kodeord = bcrypt.hashSync(req.fields.password, 10);
        if (success) {
            db.query(`INSERT INTO users SET username = ?, password = ?, fk_role = (SELECT id FROM roles WHERE level = 50)`, [req.fields.username, hashed_kodeord], function (err, result) {
                if (err) {
                    return res.send(err);
                }
                req.session.user = result.insertId
                res.redirect('/profile');
            })
        }
    });
};