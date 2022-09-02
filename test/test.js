const fs = require('fs');
const path = require('path');
const EC = require('eight-colors');

const SFE = require('../lib');

const list = [{
    input: path.resolve(__dirname, '../node_modules/themify-icons/themify-icons/fonts/themify.svg'),
    output: path.resolve(__dirname, 'output/themify-icons'),
    getNameMap: function() {
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

        const total = EC.yellow(Object.keys(nameMap).length);

        console.log('nameMap', total);

        return nameMap;
    },

    onSVGItem: function(item) {

        if (!item.d) {
            return;
        }

        if (!this.nameMap) {
            this.nameMap = this.getNameMap();
        }

        item.name = this.nameMap[item.unicode] || item['glyph-name'] || item.index;

        return item;
    }
}];


list.forEach((item) => {
    SFE(item);
});
