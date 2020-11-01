const {validationResult} = require('express-validator')

module.exports = {
    handleErrors(templateFunc) {
        return (req, res, next) => {
            const errors = validationResult(req);

            if(!errors.isEmpty()) {
                return res.send(templateFunc({errors}))
            }

            next();
        }
    },
    //Now, we create another middleware for requiring authorization to see our admin pages. For handleErrors, we returned a function because we needed to pass through an argument to customize what we executed (with the template). For this, we don't reqiure any customization, so we can simply go straight into our middleware with the req, res, and next functions
    requireAuth(req, res, next) {
        //All we do is check to see if the userID is defined. If it isn't, then we force them to go to the sign in page.
        if (!req.session.userID) {
            res.redirect('/signin')
        }
        //If their userID is defined, that means they are signed in and we simply pass them to the next middleware
        next();
    }
}