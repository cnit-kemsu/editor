import { convertFromRaw } from 'draft-js';
import { getColor } from './getColor';
import { fontFamilyArray } from './fontFamilyArray';
import { fontSizeArray } from '../lib/fontSizeArray';

const inlineStyleMap = {
  'color'(value) {
    return 'TEXT_COLOR=' + value;
  },
  'background-color'(value) {
    return 'FILL_COLOR=' + value;
  },
  'font-size'(value) {
    return 'FONT_SIZE=' + value;
  },
  'font-family'(value) {
    return 'FONT_FAMILY=' + value;
  },
  'text-decoration': [
    function (value) {
      if (value.includes('line-through')) return 'STRIKETHROUGH';
    },
    function (value) {
      if (value.includes('underline')) return 'UNDERLINE';
    }
  ],
  'vertical-align'(value) {
    if (value === 'super') return 'SUPERSCRIPT';
    if (value === 'sub') return 'SUBSCRIPT';
  }
};
const inlineStyleMap_entries = Object.entries(inlineStyleMap);

const blockDataMap = {
  'text-align'(value) {
    return { textAlign: value };
  }
};
const blockDataMap_entries = Object.entries(blockDataMap);

const fontSizeNames = {
  'medium': 16,
  'large': 18,
  'larger': 19,
  'x-large': 24,
  'xx-large': 32,
  'small': 13,
  'smaller': 13,
  'x-small': 10,
  'xx-small': 9
};
const fontSizeMap = {
  'px': 16,
  'pt': 12,
  'em': 1,
  '%': 100
};
const extractFontSize = /(?<size>\d+)(?<units>px|pt|em|%)/;

const _parseStyleValue = {
  'color'(value) {
    if (!value) return;
    const _value = getColor(value);
    if (_value === undefined) return;
    const [r, g, b] = _value;
    if (r !== 0 || g !== 0 && b !== 0) return `rgb(${r},${g},${b})`;
  },
  'background-color'(value) {
    if (!value) return;
    const _value = getColor(value);
    if (_value === undefined) return;
    const [r, g, b] = _value;
    return `rgb(${r},${g},${b})`;
  },
  'text-align'(value) {
    if (!value) return;
    if (value === 'center' || value === 'right' || value === 'justify') return value;
  },
  'font-size'(value) {
    if (!value) return;
    const _value = fontSizeNames[value];
    if (_value !== undefined) {
      if (_value === 16) return;
      return _value + 'px';
    }

    const fontSize = extractFontSize.exec(value)?.groups;
    if (fontSize === undefined) return;
    const { size, units } = fontSize;
    let _size = Number(size);
    if (units !== 'px') _size = Math.floor(size * fontSizeMap['px'] / fontSizeMap[units]);
    if (_size === 16) return;
    
    const firstSize = fontSizeArray[0];
    const lastSize = fontSizeArray[fontSizeArray.length];
    if (_size < firstSize) _size = firstSize;
    else if (_size > lastSize) _size = lastSize;
    else if (_size !== firstSize)  {
      for (let index = 0; index < fontSizeArray.length - 2; index++) {
        const size1 = fontSizeArray[index];
        const size2 = fontSizeArray[index + 1];
        if (_size === size2) break;
        else if (_size > size1 && _size < size2) _size = (_size - size1) >= (size2 - _size) ? size2 : size1;
      }
    }
    return _size + 'px';
  },
  'font-family'(value) {
    if (!value) return;
    const _value = value.replace(/"/g, '').split(',')[0];
    if (_value === 'Roboto') return;
    if (fontFamilyArray.includes(_value)) return _value;
  },
  'vertical-align'(value) {
    if (!value) return;
    if (value === 'sub' || value === 'super') return value;
  }
};

function parseStyleValue(propName, style) {
  if (style === undefined) return;
  const parse = _parseStyleValue[propName];
  if (parse === undefined) return;
  return parse(style[propName]);
}

function extractBlockData(node) {
  let data = {};
  for (const [propName, toDataProps] of blockDataMap_entries) {
    const propValue = parseStyleValue(propName, node.style);
    if (propValue !== undefined) data = {
      ...data,
      ...toDataProps(propValue)
    };
  }
  return data;
}

function computeStyle(node, parentStyle) {
  const style = { ...parentStyle };
  for (const [propName] of inlineStyleMap_entries) {
    const propValue = parseStyleValue(propName, node.style);
    if (propValue !== undefined) style[propName] = propValue;
  }
  return style;
}

function pushInlineStyleRanges(inlineStyleRanges, offset, length, toInlineStyle, propValue) {
  if (toInlineStyle instanceof Array) {
    for (const _toInlineStyle of toInlineStyle) pushInlineStyleRanges(inlineStyleRanges, offset, length, _toInlineStyle, propValue);
  }
  inlineStyleRanges.push({
    offset, length,
    style: toInlineStyle(propValue)
  });
}

function toInlineStyleRanges(offset, length, style) {
  const inlineStyleRanges = [];
  if (style !== undefined) for (const [propName, toInlineStyle] of inlineStyleMap_entries) {
    const propValue = style[propName];
    if (propValue) pushInlineStyleRanges(inlineStyleRanges, offset, length, toInlineStyle, propValue);
  }
  return inlineStyleRanges;
}

function getAttributes(node) {
  const attributes = {};
  for (let index = 0; index < node.attributes.length; index++) {
    const { name, value } = node.attributes[index];
    attributes[name] = value;
  }
  return attributes;
}

function extractBlockProps(entities, node, offset = 0, parentStyle) {

  if (node instanceof Image) {
    const { 'data-src': dataSrc, 'data-symmetric': dataSymmetric, src, width, height } = getAttributes(node);
    entities.push({
      type: 'IMAGE',
      mutability: 'IMMUTABLE',
      data: {
        symmetric: dataSymmetric !== false,
        src: dataSrc || src,
        width,
        height
      }
    });
    return {
      text: '\u{1F4F7}',
      inlineStyleRanges: [],
      entityRanges: [{
        offset,
        length: 1,
        key: entities.length - 1
      }],
      length: 1
    };
  }

  if (node instanceof Text) {
    const { data: text } = node;
    const length = text.length;
    return {
      text,
      inlineStyleRanges: toInlineStyleRanges(offset, length, parentStyle),
      entityRanges: [],
      length
    };
  }

  let text = '';
  let length = 0;
  const style = computeStyle(node, parentStyle);
  const inlineStyleRanges = [];
  const entityRanges = [];
  for (const childNode of node.childNodes) {
    const {
      text: _text,
      inlineStyleRanges: _inlineStyleRanges,
      entityRanges: _entityRanges,
      length: _length
    } = extractBlockProps(entities, childNode, offset + length, style);
    text += _text;
    length += _length;
    inlineStyleRanges.push(..._inlineStyleRanges);
    entityRanges.push(..._entityRanges);
  }
  return {
    text,
    inlineStyleRanges,
    entityRanges,
    length
  };
}

function createBlocksFromNode(entities, node, blockType) {
  if (node.tagName === 'UL') return createBlocksFromNodeArray(entities, node.childNodes, 'unordered-list-item');
  if (node.tagName === 'OL') return createBlocksFromNodeArray(entities, node.childNodes, 'ordered-list-item');
  const data = extractBlockData(node);
  const { text, inlineStyleRanges, entityRanges } = extractBlockProps(entities, node);
  return {
    type: blockType,
    data,
    text,
    inlineStyleRanges,
    entityRanges
  };
}

function createBlocksFromNodeArray(entities, nodeArray, blockType = 'unstyled') {
  const blocks = [];
  for (const node of nodeArray) {
    createBlocksFromNode(entities, node, blockType)
    |> # instanceof Array && blocks.push(...#) || blocks.push(#);
  }
  return blocks;
}

export function parseHTML(html) {

  //console.log(html); //DEBUG
  const startIndex = '<!--StartFragment-->' |> html.search(#) + #.length;
  const endIndex = html.search('<!--EndFragment-->');
  const htmlFragment = html.substring(startIndex, endIndex);
  //console.log(htmlFragment); //DEBUG
  const fragment = document.createRange().createContextualFragment(htmlFragment);
  console.log(fragment); //DEBUG

  console.log(fragment.childNodes);
  const entities = [];
  const blocks = createBlocksFromNodeArray(entities, fragment.childNodes);
  console.log(blocks); //DEBUG
  const entityMap = {};
  for (const entityKey of Object.keys(entities)) {
    entityMap[entityKey] = entities[entityKey];
  }
  console.log(entityMap); //DEBUG

  const content = convertFromRaw({ blocks, entityMap });
  return content;
}