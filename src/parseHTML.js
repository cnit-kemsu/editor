import { convertFromRaw } from 'draft-js';
import { parseColor } from './internals/color-parser';
import { fontFamilyArray } from './internals/fontFamilyArray';
import { fontSizeArray } from './internals/fontSizeArray';

const inlineStyleMap = {
  color(value) {
    return 'TEXT_COLOR=' + value;
  },
  backgroundColor(value) {
    return 'FILL_COLOR=' + value;
  },
  fontSize(value) {
    return 'FONT_SIZE=' + value;
  },
  fontFamily(value) {
    return 'FONT_FAMILY=' + value;
  },
  fontStyle() {
    return 'ITALIC';
  },
  fontWeight() {
    return 'BOLD';
  },
  textDecoration(value) {
    if (value === 'underline') return 'UNDERLINE';
    if (value === 'line-through') return 'STRIKETHROUGH';
    if (value === 'underline line-through') return ['UNDERLINE', 'STRIKETHROUGH'];
  },
  verticalAlign(value) {
    if (value === 'super') return 'SUPERSCRIPT';
    if (value === 'sub') return 'SUBSCRIPT';
  }
};
const inlineStyleMap_entries = Object.entries(inlineStyleMap);

const blockDataMap = {
  textAlign(value) {
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
const fontSizeUnitDefaults = {
  'px': 16,
  'pt': 12,
  'em': 1,
  '%': 100
};

const extractFontSize = /(?<size>\d+)(?<unit>px|pt|em|%)/ |> (input => #.exec(input)?.groups);

const styleValueHandlers = {
  textAlign(value) {
    if (!value) return;
    if (value === 'center' || value === 'right' || value === 'justify') return value;
  },
  color(value) {
    if (!value) return;
    const color = parseColor(value);
    if (!color) return;
    const [red, green, blue, alpha] = color;
    if (red !== 0 || green !== 0 && blue !== 0) return `rgba(${red},${green},${blue},${alpha})`;
  },
  backgroundColor(value) {
    if (!value) return;
    const color = parseColor(value);
    if (!color) return;
    const [red, green, blue, alpha] = color;
    return `rgba(${red},${green},${blue},${alpha})`;
  },
  fontSize(value) {
    if (!value) return;
    let _size = fontSizeNames[value];
    if (_size !== undefined) {
      if (_size === 16) return;
      return _size + 'px';
    }

    const fontSize = extractFontSize(value);
    if (!fontSize) return;
    const { size, unit } = fontSize;
    _size = Number(size);
    const defaultFontSize = fontSizeUnitDefaults[unit];
    if (!defaultFontSize) return;
    if (unit !== 'px') _size = Math.floor(_size * 16 / defaultFontSize);
    
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
    if (_size === 16) return;
    return _size + 'px';
  },
  fontFamily(value) {
    if (!value) return;
    const _value = value.replace(/"/g, '').split(',')[0];
    if (_value === 'Roboto') return;
    if (fontFamilyArray.includes(_value)) return _value;
  },
  fontWeight(value) {
    if (value === 'bold' || value >= 600) return 'bold';
  },
  fontStyle(value) {
    if (value === 'italic') return 'italic';
  },
  textDecoration(value) {
    if (!value) return;
    const underline = value.includes('underline');
    const strikethrough = value.includes('line-through');
    if (underline && strikethrough) return 'underline line-through';
    if (underline) return 'underline';
    if (strikethrough) return 'line-through';
  },
  verticalAlign(value) {
    if (value === 'sub' || value === 'super') return value;
  }
};

function handleStyleValue(propName, style) {
  return styleValueHandlers[propName]?.(style[propName]);
}

function computeStyle(currentNodeStyle, parentNodeStyle) {
  const computedStyle = { ...parentNodeStyle };
  if (currentNodeStyle) for (const propName in styleValueHandlers) {
    const propValue = currentNodeStyle[propName];
    if (propValue && propValue !== 'inherit') computedStyle[propName] = propValue;
  }
  return computedStyle;
}

function extractBlockData(nodeStyle) {
  let data = {};
  if (nodeStyle !== undefined) for (const [propName, toDataProps] of blockDataMap_entries) {
    const propValue = handleStyleValue(propName, nodeStyle);
    if (propValue !== undefined) data = {
      ...data,
      ...toDataProps(propValue)
    };
  }
  return data;
}

function extractInlineStyleRanges(offset, length, style) {
  const inlineStyleRanges = [];
  for (const [propName, toInlineStyles] of inlineStyleMap_entries) {
    const propValue = handleStyleValue(propName, style);
    if (propValue !== undefined) {
      const inlineStyles = toInlineStyles(propValue);
      if (inlineStyles instanceof Array) for (const inlineStyle of inlineStyles) inlineStyleRanges.push({ offset, length, style: inlineStyle });
      else inlineStyleRanges.push({ offset, length, style: inlineStyles });
    }
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

function extractBlockProps(filesAndUrls, entities, node, parentStyle = {}, offset = 0) {

  if (node instanceof Image) {
    const { 'data-src': src, 'data-video': dataVideo, 'data-symmetric': symmetric } = getAttributes(node);
    if (dataVideo) {
      let { width, height } = node.style;
      if (width.substr(-2) === 'px') width = width.slice(0, -2); else width = undefined;
      if (height.substr(-2) === 'px') height = height.slice(0, -2); else height = undefined;
      const props = {};
      if (src) props.src = src;
      if (width) props.width = width;
      if (height) props.height = height;
      entities.push({
        type: 'VIDEO',
        mutability: 'IMMUTABLE',
        data: {
          symmetric: symmetric !== 'false',
          ...props
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
  }

  if (node instanceof Image) {
    const { 'data-file-source-key': fileSourceKey, 'data-file-index': fileIndex, 'data-symmetric': symmetric, src, width, height } = getAttributes(node);
    if (src.substring(0, 4) === 'file') return {
      text: '',
      inlineStyleRanges: [],
      entityRanges: [],
      length: 0
    };
    const props = {};
    if (fileSourceKey) props.fileSourceKey = fileSourceKey;
    else if (fileIndex) props.file = filesAndUrls[fileIndex][0];
    else if (src) props.src = src;
    if (width) props.width = width;
    if (height) props.height = height;
    entities.push({
      type: 'IMAGE',
      mutability: 'IMMUTABLE',
      data: {
        symmetric: symmetric !== 'false',
        ...props
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

  if (node instanceof Text || node.tagName === 'CODE') {
    let text = node.data || node.innerText;
    text = text.replace(/\n/g, ' '); // ms-office clipboard bug
    const length = text.length;
    const style = computeStyle(node.style, parentStyle);
    return {
      text,
      inlineStyleRanges: extractInlineStyleRanges(offset, length, style),
      entityRanges: [],
      length
    };
  }

  let text = '';
  let length = 0;
  const style = computeStyle(node.style, parentStyle);
  const inlineStyleRanges = [];
  const entityRanges = [];
  for (const childNode of node.childNodes) {
    const {
      text: _text,
      inlineStyleRanges: _inlineStyleRanges,
      entityRanges: _entityRanges,
      length: _length
    } = extractBlockProps(filesAndUrls, entities, childNode, style, offset + length);
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

function createBlocksFromNode(filesAndUrls, entities, node, blockType) {
  if (node.tagName === 'UL') return createBlocksFromNodeArray(filesAndUrls, entities, node.childNodes, 'unordered-list-item');
  if (node.tagName === 'OL') return createBlocksFromNodeArray(filesAndUrls, entities, node.childNodes, 'ordered-list-item');
  const style = computeStyle(node.style);
  const data = extractBlockData(style);
  const { text, inlineStyleRanges, entityRanges } = extractBlockProps(filesAndUrls, entities, node, style);
  return {
    type: blockType,
    data,
    text,
    inlineStyleRanges,
    entityRanges
  };
}

function createBlocksFromNodeArray(filesAndUrls, entities, nodeArray, blockType = 'unstyled') {
  const blocks = [];
  for (const node of nodeArray) {
    createBlocksFromNode(filesAndUrls, entities, node, blockType)
    |> # instanceof Array && blocks.push(...#) || blocks.push(#);
  }
  return blocks;
}

function getNodeArray(fragment) {
  let allSpans = true;
  for (const node of fragment.childNodes) {
    // if (node.tagName !== 'SPAN' && !(node instanceof Text)) {
    //   allSpans = false;
    //   break;
    // }
    if (node.tagName === 'DIV' || node.tagName === 'P') {
      allSpans = false;
      break;
    }
  }
  if (allSpans) return [{ childNodes: fragment.childNodes }];

  const nodeArray = [];
  for (const node of fragment.childNodes) {
    if (!(node instanceof Text)) nodeArray.push(node); // ms-office clipboard bug
    //nodeArray.push(node);
  }
  return nodeArray;
}

export function parseHTML(html, filesAndUrls) {

  const startIndex = '<!--StartFragment-->' |> html.search(#) + #.length;
  const endIndex = html.search('<!--EndFragment-->');
  const htmlFragment = (endIndex === -1 ? html : html.substring(startIndex, endIndex)) |> #.replace(/(?:\r\n|\r|\n|\t|  )/g, '');
  const fragment = document.createRange().createContextualFragment(htmlFragment);

  const entities = [];
  const blocks = getNodeArray(fragment) |> createBlocksFromNodeArray(filesAndUrls, entities, #);
  const entityMap = {};
  for (const key in entities) entityMap[key] = entities[key];

  // DEBUG
  // console.log('fragment:', fragment);
  // console.log('fragment:', fragment.childNodes);
  // console.log('blocks:', blocks);
  // console.log('entityMap:', entityMap);

  return convertFromRaw({ blocks, entityMap });
}