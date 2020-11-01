const layout = require('../layout')
//Finally, we show our error messages the same way we have with our other templates. First we require in getError from our helpers function
const {getError} = require('../../helpers')

//We also need to make sure we destructure out errors. The order doesn't matter here because we are destructuring both out of our object we passed through. Similar to before, we use getError below the input and pass through our errors and the name of the data input
module.exports = ({product, errors}) => {
    return layout({
        content : `
        <form method="POST">
            <input name="title" value="${product.title}"/>
            ${getError(errors, 'title')}
            <input name="price" value="${product.price}"/>
            ${getError(errors, 'price')}
            <input name="image" type="file"/>
            <button>Submit</button>
        </form>
        `
    })
}