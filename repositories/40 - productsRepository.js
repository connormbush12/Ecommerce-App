//Now, we create our ProductsRepository. Right now, we have no ProductsRepository-specific methods that we need to use, so we simply require in our base Repository class, create the ProductsRepository by extending Repository, and then export an instance of the class out to a new file called products.json
const Repository = require('./repository')

class ProductsRepository extends Repository {}

module.exports = new ProductsRepository('products.json')