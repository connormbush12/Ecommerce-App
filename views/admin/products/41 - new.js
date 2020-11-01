//We need to create our view for our new products form
//First, we want to require in our basic layout and getError function from our helpers file (will use in future)
const layout = require('../layout')
const {getError} = require('../../helpers')

//Then, we export out our template. We accept an object as an argument so that we can pass through errors or anything else we might need in the future.
module.exports = ({errors}) => {
    //Then, we use our layout function, pass through an object with the key content, and pass through our HTML for our new products form.
    //In the form, first we have to make it a POST request by changing the method. Then, we include two input fields for the item title and price. Then, we include an input field with the type "file" and name "image". This will allow us to upload an image for our item. Then, we include a basic submit button.
    return layout({
        content: `
        <form method="POST">
            <input placeholder="Title" name="title" />
            <input placeholder="Price" name="price" />
            <input type="file" name="image" />
            <button>Submit</button>
        </form>
        `
    })
};