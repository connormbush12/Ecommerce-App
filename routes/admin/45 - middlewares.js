//We use our code to handle errors from our validation checks in three separate spots so far (signup, signin, and new products), so that means we should refactor it out into its own file.

//First, we requre express-validator and destructure out validationResult

const {validationResult} = require('express-validator')

//Then, we will module.exports an object (similar to what we did with our validators) that includes any middleware we have
module.exports = {
    //We add a middleware for handling errors. The code within this is consistent for all three scenarios above except for one component: the HTML template we pass through. Therefore, we want to pass through whatever template we want to use as our argument
    handleErrors(templateFunc) {
        //We immediately return a function to be executed. When we write middlewares, they always have a req, res, and next arguments
        return (req, res, next) => {
            //Now, we simply repeat our error handling code we've used before
            const errors = validationResult(req);

            if(!errors.isEmpty()) {
                //we use the templateFunc and pass through the errors here
                return res.send(templateFunc({errors}))
            }
            //Finally, we have to use next(); at the end. Basically, if there are no errors, then the if statement above doesn't get triggered, so the next() is our way of sending it to the next middleware or the callback and saying that everything is good.
            next();
        }
    }
}