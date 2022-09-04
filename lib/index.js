const fs = require('fs');
const path = require('path');
const EC = require('eight-colors');
const CG = require('console-grid');
const { parseDocument } = require('htmlparser2');
const { SVGPathData, SVGPathDataTransformer } = require('svg-pathdata');

const Util = require('./util.js');

const defaultOptions = {
    input: '',
    output: 'output',
    onSVGItem: function(item) {
        return item;
    }
};


const initSvgSettings = (options, font) => {

    //https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/SVG_fonts
    const settings = {
        width: 0,
        height: 0,

        //https://en.wikipedia.org/wiki/Ascender_(typography)
        ascent: 0,
        descent: 0
    };

    settings.width = Util.toNum(Util.getAttr(font, 'horiz-adv-x'));

    const fontFace = Util.getElement(font, 'font-face');
    if (fontFace) {
        settings.ascent = Util.toNum(Util.getAttr(fontFace, 'ascent'));
        settings.descent = Util.toNum(Util.getAttr(fontFace, 'descent'));
        settings.height = settings.ascent + Math.abs(settings.descent);
    }

    //console.log(settings);

    options.settings = settings;
};

const getSvgViewBox = (options, props) => {
    const settings = options.settings;
    const w = props['horiz-adv-x'] || settings.width;
    const h = settings.height;
    return `0 0 ${w} ${h}`;
};

const generatePathD = (options, d) => {
    if (!d) {
        return '';
    }
    const settings = options.settings;

    const pathD = new SVGPathData(d)
        .transform(SVGPathDataTransformer.Y_AXIS_SYMMETRY(settings.height))
        .translate(0, settings.descent)
        .encode();

    //console.log('d1', d);
    //console.log('d2', pd);

    return pathD;
};

const generateSvg = (options, item) => {

    const {
        viewBox, fill, d
    } = item;

    const list = [];

    list.push(`<svg viewBox="${viewBox}" xmlns="http://www.w3.org/2000/svg">`);
    if (d) {
        list.push(`<path fill="${fill}" d="${d}" />`);
    }
    list.push('</svg>');

    const svgContent = list.join('');

    const filename = item.name || item['glyph-name'] || item.index;
    fs.writeFileSync(path.resolve(options.output, `${filename}.svg`), svgContent);

    options.svgCount += 1;

};


const svgItemHandler = (options, props, i) => {

    const viewBox = getSvgViewBox(options, props);
    const d = generatePathD(options, props.d);

    let item = {
        ... props,
        index: i,
        viewBox,
        fill: 'currentColor',
        d
    };

    if (typeof options.onSVGItem === 'function') {
        item = options.onSVGItem.call(options, item);
    }

    if (!item) {
        return;
    }

    generateSvg(options, item);

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
    const font = Util.getElement(root, 'font');
    //console.log(font);

    initSvgSettings(options, font);

    options.svgCount = 0;

    const glyphs = Util.getElements(font, 'glyph');
    glyphs.forEach((glyph, i) => {
        svgItemHandler(options, glyph.attribs, i);
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
            ['Input', Util.relativePath(options.input)],
            ['Output', Util.relativePath(options.output)],
            ['SVGs', EC.green(options.svgCount)]
        ]
    });

};
