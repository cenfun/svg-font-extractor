const path = require('path');

const SFE = require('../lib');

const list = [{
    input: '../node_modules/themify-icons/themify-icons/fonts/themify.svg',
    output: 'output/themify-icons'
}];


list.forEach((item) => {

    const nameMap = {};

    SFE({
        input: path.resolve(__dirname, item.input),
        output: path.resolve(__dirname, item.output),
        nameMap
    });

});
