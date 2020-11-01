//We create a new template for our edit product page and require in our layout as always
const layout = require('../layout')

//We accept in the product we want to edit within our object we pass through
module.exports = ({product}) => {
    return layout({
        //This form looks very similar to our new products form with a few exceptions. First, because we already have information about our product, we want those pre-populated. We put that information into the "value" property for our inputs.
        //In addition, we cannot have the image pre-populated. We don't store the image itself in our products.json file, but rather we convert it into a base64 string for storage. Therefore, we do not pre-populate the image. Rather, we show it as blank and we don't change the existing image unless a new one is included in the form
        content : `
        <form method="POST">
            <input name="title" value="${product.title}"/>
            <input name="price" value="${product.price}"/>
            <input name="image" type="file"/>
            <button>Submit</button>
        </form>
        `
    })
}