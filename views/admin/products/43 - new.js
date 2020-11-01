const layout = require('../layout')
const {getError} = require('../../helpers')

module.exports = ({errors}) => {
    return layout({
        //For our new product form, we dont want to use the default encoded type for forms, which is to urlencode the information. Image files cannot be urleconded. Therefore, we have to use a multipart/form-data enctype so that we can handle each piece of information separately
        content: `
        <form method="POST" enctype="multipart/form-data">
            <input placeholder="Title" name="title" />
            <input placeholder="Price" name="price" />
            <input type="file" name="image" />
            <button>Submit</button>
        </form>
        `
    })
};