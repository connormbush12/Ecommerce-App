//We create a showCartTemplate page to generate the HTML for our cart page
//First, as always, we require in our layout.
const layout = require('../layout')

//Then, we module.exports our function. We destructure out items from the object we pass through.
module.exports = ({items}) => {
    //We create a renderedItems variable. This will be one long string of HTML.
    //To create this long string of HTML, first we use .map() to create an array of HTML string.
    const renderedItems = items.map((item) => {
        //For each item, we return a string that contains one <div> element with the item's title and price. Remember, this info is saved on the product property of the item, so we have to do item.product.title, etc.
        return `<div>${item.product.title} - \$${item.product.price}</div>`
        //Following .map(), we have an array of HTML strings for each item. At the end, we use .join(), only passing through an empty string, so that we join them together into one long string that is separated by no space.
    }).join('')
    //Finally, we return our layout with our content object passed through (since we destructure out 'content' in our layout function). As the value of our content property, we simply do an <h1> tag with the renderedItems passed through.
    return layout({
        content : `
        <h1>${renderedItems}</h1>
        `
    })
}