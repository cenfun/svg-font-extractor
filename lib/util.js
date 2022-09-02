const path = require('path');

const Util = {

    toNum: function(num, toInt) {
        if (typeof num !== 'number') {
            num = parseFloat(num);
        }
        if (isNaN(num)) {
            num = 0;
        }
        if (toInt) {
            num = Math.round(num);
        }
        return num;
    },

    formatPath: function(str) {
        if (str) {
            str = str.replace(/\\/g, '/');
        }
        return str;
    },

    relativePath: function(p) {
        p = `${p}`;
        const root = process.cwd();
        let rp = path.relative(root, p);
        rp = Util.formatPath(rp);
        return rp;
    },

    getElement: (parent, tagName) => {
        const children = parent.children;
        if (!children) {
            return;
        }
        const elem = children.find((it) => it.type === 'tag' && it.name === tagName);
        if (elem) {
            return elem;
        }

        for (let i = 0, l = children.length; i < l; i++) {
            const child = children[i];
            if (child.type !== 'tag') {
                continue;
            }
            const el = Util.getElement(child, tagName);
            if (el) {
                return el;
            }
        }
    },

    getElements: (parent, tagName) => {
        const children = parent.children;
        if (!children) {
            return [];
        }
        return children.filter((it) => it.type === 'tag' && it.name === tagName);
    },

    getAttr: (elem, name) => {
        return elem && elem.attribs && elem.attribs[name];
    }

};

module.exports = Util;
