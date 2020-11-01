const layout = require('../layout');

module.exports = ({ products }) => {
  const renderedProducts = products
  //In our products page, we do a simialr thing to what we did for editing a product. However, there are a few differences. First, deleting will be a post request, while editing was a get request to get to the edit page. Therefore, we want to wrap our delete button in a form so we can specify it as a post method. Another key difference is we define the action property of the form. The action property defaults to the current path, which would be admin/products. However, we need to get the product ID information to delete it, so we want to specify a new path. Therefore, we use action and set it equal to "/admin/products/${product.id}/delete"
    .map(product => {
      return `
      <tr>
        <td>${product.title}</td>
        <td>${product.price}</td>
        <td>
          <a href="/admin/products/${product.id}/edit">
            <button class="button is-link">
              Edit
            </button>
          </a>
        </td>
        <td>
          <form method="POST" action="/admin/products/${product.id}/delete">
          <button class="button is-danger">Delete</button>
          </form>
        </td>
      </tr>
    `;
    })
    .join('');

  return layout({
    content: `
      <div class="control">
        <h1 class="subtitle">Products</h1>  
        <a href="/admin/products/new" class="button is-primary">New Product</a>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          ${renderedProducts}
        </tbody>
      </table>
    `
  });
};
