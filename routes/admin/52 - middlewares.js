const {validationResult} = require('express-validator')

module.exports = {
    //In order to handle templates that require more information than just the errors (such as edit products template, which requires the product information), we have to add an extra callback. We'll call this dataCb (data callback)
    handleErrors(templateFunc, dataCb) {
        //This will be asynchronous, so we add async
        return async (req, res, next) => {
            const errors = validationResult(req);

            //Below, we want to get whatever data we need for our template and pass it through. There are two issues a) if we do it within our if statement, it cannt be accessed outside of our if statement (lexical scope); b) if we declare the variable and keep it undefined, it will give us some funky stuff whenever we try to use spread to put it in our object. Therefore, we define data outside of our if statements with let and start it as an empty object, so if there is no extra data and we try and spread it in, it doesn't do anything
            let data = {}
            if(!errors.isEmpty()) {
                //dataCb needs to be an optional callback function (since it isn't needed by the other uses of handleErrors), so we put it in an if statement. We only need to check dataCb if there is an error. Otherwise, we just jump to next() and it doesn't matter. So we put it within the errors if statement.
                if(dataCb) {
                    //if we do have that callback function, we execute it with the req and save whatever we return with it to data
                    data = await dataCb(req)
                }
                //Finally, we spread in data so that we pass in all of the information needed to our template function
                return res.send(templateFunc({errors, ...data}))
            }

            next();
        }
    },
    requireAuth(req, res, next) {
        if (!req.session.userID) {
            res.redirect('/signin')
        }

        next();
    }
}