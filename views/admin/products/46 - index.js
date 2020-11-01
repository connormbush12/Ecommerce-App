//We want to create the view for when we are listing all of our products.
//First, we want to use our layout creator, so we require in layout
const layout = require('../layout')

//Then, we will export a function. We need all of the products, so we pass that through within an object. We always use an object so that we can add more pieces of info in the future if we need to
module.exports = ({products}) => {
    //We need to loop over our array of products and create some custom HTML for each one. Therefore, we can use .map() to go over all of our products and return new pieces of information
    const renderedProducts = products.map((product) => {
        //We return a really simple string of HTML that lists each product's title
        return `
        <div>${product.title}</div>
        `
        //At the end, we want to join these all in one long string of HTML so that we can put it into our template easily. Therefore, we will use .join() to join all of the HTML strings in our new array and separate it by a non-space
    }).join('')
    //Finally, we return the HTML. We use our layout function we required in above, and set the content to simply be a header that states "Products" along with our long HTML string of product titles we just created
    return layout({
        content : `
        <h1>Products</h1>
        ${renderedProducts}
        `
    })
}