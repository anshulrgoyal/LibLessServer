'use strict'

const path = require('path');
const fs = require('fs');

const include = (pathUrl) => {
    return render(pathUrl, {})
}
const render = (pathUrl, data) => {
    if (path) {
        const f = fs.readFileSync(path.resolve(pathUrl)).toString('utf-8')
        return eval('`' + f + '`')
    }
    else {
        return null;
    }
}

module.exports = render;