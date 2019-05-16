module.exports = (function () {
    function loggedIn(session) {
        if (!session)
            return false;
        return session.user && session.role;
    }

    function superadmins(req, res, next) {
        if (!loggedIn(req.session) || !req.session.role >= 90)
            return res.redirect('/login');
        next();
    }

    function admins(req, res, next) {
        if (!loggedIn(req.session) || (!req.session.role >= 80 && !req.session.role < 90))
            return res.redirect('/login');
        next();
    }

    function editors(req, res, next) {
        if (!loggedIn(req.session) || (!req.session.role >= 70 && !req.session.role < 80))
            return res.redirect('/login');
        next();
    }

    function moderators(req, res, next) {
        if (!loggedIn(req.session) || (!req.session.role >= 60 && !req.session.role < 70))
            return res.redirect('/login');
        next();
    }

    function customers(req, res, next) {
        if (!loggedIn(req.session) || (!req.session.role >= 50 && !req.session.role < 60))
            return res.redirect('/login');
        next();
    }

    function guests(req, res, next) {
        if (!loggedIn(req.session) || (!req.session.role >= 10 && !req.session.role < 20))
            return res.redirect('/login');
        next();
    }

    return {
        superadmins,
        admins,
        editors,
        moderators,
        customers,
        guests
    }
})();