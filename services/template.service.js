
const handleBar = require("handlebars")
const fs = require("fs")

module.exports = (name, data) => {
    const tempContent = fs.readFileSync(`${__dirname}/templates/${name}.html`).toString();

    const template = handleBar.compile(tempContent);

    return template(data);
}