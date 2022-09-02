const fs = require('fs');
const path = require('path');
const EC = require('eight-colors');

const SFE = require('../lib');

const list = [{
    input: '../node_modules/themify-icons/themify-icons/fonts/themify.svg',
    output: 'output/themify-icons',
    getNameMap: () => {
        const file = path.resolve(__dirname, '../node_modules/themify-icons/themify-icons/_icons.scss');
        const content = fs.readFileSync(file, {
            encoding: 'utf-8'
        });

        const nameMap = {};
        content.split(/\r|\n/g).forEach((line) => {
            const str = line.trim();
            //console.log(str);
            if (!str) {
                return;
            }
            const name = str.split(':')[0].replace(/\.icon-/g, '');
            //console.log(name);
            const v = str.split('"')[1].split('"')[0];

            const code = v.replace('\\', '');

            const u = parseInt(code, 16);

            const x = String.fromCharCode(u);

            //console.log(u);

            nameMap[x] = name;
        });

        //console.log(nameMap);

        console.log('nameMap', Object.keys(nameMap).length);

        return nameMap;
    }
}];


list.forEach((item) => {

    SFE({
        input: path.resolve(__dirname, item.input),
        output: path.resolve(__dirname, item.output),
        nameMap: item.getNameMap()
    });

});
