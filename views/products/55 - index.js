//We need to create a view for our home page that shows all of our products.
//First, we modulus.exports. We accept an object witih products destructured out of it. We use an object so that we can easily add more to it
module.exports = ({products}) => {
    //We create a long HTML string of our products and set it equal to a variable
    //We use .map on our products to create an array. We iterate over each product and return a string that includes a list item tag, our product title, and our product price
    const renderedProducts = products.map((product) => {
        return `
        <li>${product.title} - ${product.price}</li>
        `;
    //We want one long string, not an array, so we use .join and separate by nothing to get all of our info in one long HTML string
    }).join('');
    //Then, we return all of our product info within an unordered list
    return `
    <ul>
        ${renderedProducts}
    </ul>
    `
}