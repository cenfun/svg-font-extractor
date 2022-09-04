# svg-font-extractor
> Extract all glyphs in the svg font to separate svg icon files

## Install
```sh
npm i svg-font-extractor
```

## Usage
```js
const SFE = require('svg-font-extractor');
SFE({
    input: "path/to/svg-font.svg",
    output: "path/to/output/dir",
    onSVGItem: function(item) {
        // update item name if no glyph-name
        // item.name = youNameMap[item.unicode]
        return item;
    }
});

```
see [test/test/js](/test/test.js)

## Changelog
