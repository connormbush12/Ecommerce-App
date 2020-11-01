const layout = require('../layout');

module.exports = ({ products }) => {
  const renderedProducts = products
    .map(product => {
      //Within our HTML, our Add to cart button is within the <footer> tag. When we copied in this HTML for better styling, they already added a form within that footer button. It has a method of POST and it has a defined action to direct it to /cart/products.
      //When we click on the add to cart button, we want to communicate what product we are trying to add to the cart. Therefore, we need to append that information onto the form. To do that, we add an <input> tag to our form. We make it invisible by simply adding 'hidden' to it. We give it a value of the product.id, as well as a name of "productID". Now, when we submit that form via a POST request, we can grab that product ID out of the request via the req.body.productID
      return `
        <div class="column is-one-quarter">
          <div class="card product-card">
            <figure>
              <img src="data:image/png;base64, ${product.image}"/>
            </figure>
            <div class="card-content">
              <h3 class="subtitle">${product.title}</h3>
              <h5>$${product.price}</h5>
            </div>
            <footer class="card-footer">
              <form action="/cart/products" method="POST">
                <input hidden value="${product.id}" name="productID" />
                <button class="button has-icon is-inverted">
                  <i class="fa fa-shopping-cart"></i> Add to cart
                </button>
              </form>
            </footer>
          </div>
        </div>
      `;
    })
    .join('\n');

  return layout({
    content: `
      <section class="banner">
        <div class="container">
          <div class="columns is-centered">
            <img src="/images/banner.jpg" />
          </div>
        </div>
      </section>
      
      <section>
        <div class="container">
          <div class="columns">
            <div class="column "></div>
            <div class="column is-four-fifths">
              <div>
                <h2 class="title text-center">Featured Items</h2>
                <div class="columns products">
                  ${renderedProducts}  
                </div>
              </div>
            </div>
            <div class="column "></div>
          </div>
        </div>
      </section>
    `
  });
};
