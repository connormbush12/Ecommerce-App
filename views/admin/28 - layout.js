//Instead of retyping our standard layout over and over again, we can create a function for it and reuse it again and again.
//We export out our direct string of our HTML content; however, as the argument, we pass through an object, destructure out the content key, and then we put the content into the body of the HTML file
//Now, we can use the layout function's template as the bsae for the HTML and use other body only layouts with it
module.exports = ({content}) => {
    return `
    <!DOCTYPE html>
    <html>
        <head>
        </head>
        <body>
            ${content}
        </body>
    </html>
    `
}