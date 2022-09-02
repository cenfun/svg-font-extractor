const fs = require('fs');
const path = require('path');
const EC = require('eight-colors');
const CG = require('console-grid');
const { parseDocument, DomUtils } = require('htmlparser2');

const defaultOptions = {
    input: '',
    output: 'output',
    nameMap: {}
};

const formatPath = function(str) {
    if (str) {
        str = str.replace(/\\/g, '/');
    }
    return str;
};

const relativePath = function(p) {
    p = `${p}`;
    const root = process.cwd();
    let rp = path.relative(root, p);
    rp = formatPath(rp);
    return rp;
};

const generateMetadata = (options, root) => {

    const metadata = {
        width: 512,
        height: 512,
        viewBox: '0 0 512 512'
    };


    return metadata;
};

const generateSvg = (options, svgData) => {
    const list = [];

    const {
        name, viewBox, d
    } = svgData;

    list.push(`<svg viewBox="${viewBox}" xmlns="http://www.w3.org/2000/svg">`);
    list.push(`<path fill="currentColor" d="${d}" />`);
    list.push('</svg>');

    const svgContent = list.join('');

    fs.writeFileSync(path.resolve(options.output, `${name}.svg`), svgContent);
};

module.exports = (_options) => {
    const options = {
        ... defaultOptions,
        ... _options
    };

    if (!fs.existsSync(options.input)) {
        EC.logRed(`ERROR: Invalid svg font input: ${options.input}`);
        return;
    }

    if (!fs.existsSync(options.output)) {
        fs.mkdirSync(options.output, {
            recursive: true
        });
    }

    const content = fs.readFileSync(options.input, {
        encoding: 'utf-8'
    });

    const root = parseDocument(content, {});

    const metadata = generateMetadata(options, root);

    const glyphs = DomUtils.getElementsByTagName('glyph', root);
    glyphs.forEach((glyph, i) => {
        const props = glyph.attribs;
        //console.log(i, props);
        const name = options.nameMap[props.unicode] || i;
        const svgData = {
            name,
            ... metadata,
            ... props
        };
        generateSvg(options, svgData);
    });

    console.log('svg font extracted:');
    CG({
        options: {
            headerVisible: false
        },
        columns: [{
            name: '',
            align: 'right'
        }, {
            name: '',
            maxWidth: 80
        }],
        rows: [
            ['Input', relativePath(options.input)],
            ['Output', relativePath(options.output)],
            ['SVGs', EC.green(glyphs.length)]
        ]
    });

};
