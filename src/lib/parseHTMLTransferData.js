import { convertFromHTML, convertToRaw, convertFromRaw, ContentState } from 'draft-js';
import { replaceImageEntities } from './replaceImageEntities';

function adjustBlockText(block) {
  const text = block.text;
  const lastIndex = text.length - 1;
  if (text[lastIndex] !== '\n') return;
  block.text = text.substring(0, lastIndex);
}

const fontSizeNames = {
  'medium': '16',
  'large': '18',
  'larger': '19',
  'x-large': '24',
  'xx-large': '32',
  'small': '13',
  'smaller': '13',
  'x-small': '10',
  'xx-small': '9'
};

const verticalAlign = {
  'super': 'SUPERSCRIPT',
  'sub': 'SUBSCRIPT'
};

function parseFontSize(value) {
  let _value = fontSizeNames[value];
  if (_value === undefined && value.substring(2) === 'px') {
    _value = value.slice(0, -2);
  }
  if (_value == null && _value === '16') return null;
  return 'FONT_SIZE=' + _value;
}

function parseFontFamily(value) {
  const _value = value.split(',')[0];
  if (_value === 'Roboto') return null;
  return 'FONT_FAMILY=' + _value;
}

const stylesMap = {
  'color': value => 'TEXT_COLOR=' + value,
  'background-color': value => 'FILL_COLOR=' + value,
  'font-size': parseFontSize,
  'font-family': parseFontFamily,
  'text-decoration': [
    value => {
      if (value.includes('line-through')) return 'STRIKETHROUGH';
    },
    value => {
      if (value.includes('underline')) return 'UNDERLINE';
    }
  ],
  'vertical-align': value => verticalAlign[value]
};

const dataMap = {
  'text-align': value => ({ textAlign: value })
};

const defaultStyleValues = {
  'color': 'rgb(0, 0, 0)',
  'font-size': 'medium',
  'font-family': 'Roboto, sans-serif'
};

const defaultDataValues = {
  'text-align': 'left'
};

function getInlineStyle(inlineStyle, value) {
  return typeof inlineStyle === 'function'
    ? inlineStyle(value)
    : inlineStyle;
}

function parseInlineStyles(html) {

  const findStyleProp = /(?<name>\S*?)\s*?:\s*?(?<value>\S.*?)\s*?;/g;
  const inlineStyles = [];
  let styleProp = findStyleProp.exec(html);
  while (styleProp !== null) {
    const { name, value } = styleProp.groups;
    const inlineStyle = stylesMap[name];
    if (inlineStyle !== undefined && defaultStyleValues[name] !== value) {
      const _inlineStyle = inlineStyle instanceof Array
        ? inlineStyle.map(_style => getInlineStyle(_style, value))
        : [getInlineStyle(inlineStyle, value)];
      for(const _style of _inlineStyle) {
        if (_style != null) inlineStyles.push(_style);
      }
    }
    styleProp = findStyleProp.exec(html);
  }
  return inlineStyles.length === 0 ? null : inlineStyles;
}

function adjustBlockData(block, html) {
  if (!html) return;

  const findStyleProp = /(?<name>\S*?)\s*?:\s*?(?<value>\S.*?)\s*?;/g;
  let data = {};
  let styleProp = findStyleProp.exec(html);
  while (styleProp !== null) {
    const { name, value } = styleProp.groups;

    const dataProps = dataMap[name];
    if (dataProps !== undefined && defaultDataValues[name] !== value) {
      data = { ...data, ...dataProps(value) };
    }

    styleProp = findStyleProp.exec(html);
  }
  block.data = { ...block.data, ...data };
}

const findStyle = /style="(?<style>.*?)"/;

function adjustBlockInlineStyleRanges(block, fragment, offset) {

  const { text, dataEmpty } = fragment.groups;

  if (dataEmpty === "true") block.text = '';

  if (text.substring(0, 4) === '<img') return 1;
  const styleHTML = findStyle.exec(fragment[0])?.groups.style;
  const length = text.length;
  if (styleHTML) {
    const inlineStyles = parseInlineStyles(styleHTML);
    if (inlineStyles) {
      const inlineStyleRanges = inlineStyles.map(
        style => ({
          style,
          offset,
          length
        })
      );
      block.inlineStyleRanges.push(...inlineStyleRanges);
    }
  }
  return length;
}

function adjustBlock(block, html) {
  adjustBlockText(block);

  let offset = 0;
  const findTextFragment = /<span data-offset-key=".*?>.*?<span.*?data-empty="(?<dataEmpty>.*?)".*?>(?<text>.*?)<\/span>.*?<\/span>/g;
  let fragment = findTextFragment.exec(html);
  if (fragment === null) {
    fragment = /<span.*?>(?<text>.*?)<\/span>/g.exec(html);
    if (fragment) adjustBlockInlineStyleRanges(block, fragment, offset);
    return;
  }
  while (fragment !== null) {
    offset += adjustBlockInlineStyleRanges(block, fragment, offset);
    fragment = findTextFragment.exec(html);
  }
}

function adjustContent({ blocks, entityMap }, html) {

  const _html = html.replace(/&quot;/g, '');
  const totalBlocks = blocks.length;
  if (totalBlocks === 1) adjustBlock(blocks[0], _html);
  else {
    const findBlock = /<(div|li).*?data-block="true".*?>.*?<div.*?>(?<content>.*?)<\/div>.*?<\/(div|li)>/g;
    for (let index = 0; index < totalBlocks; index++) {
      const _block = findBlock.exec(_html);
      if (_block == null && index === totalBlocks - 1) break;

      const styleHTML = findStyle.exec(_block[0])?.groups.style;
      adjustBlockData(blocks[index], styleHTML);

      const blockHTMLContent = _block.groups.content;
      adjustBlock(blocks[index], blockHTMLContent);
    }
  }
  return {
    blocks,
    entityMap: replaceImageEntities(entityMap, html)
  };
}

const inlineStyleMap = {
  'color'(value) {
    return 'TEXT_COLOR=' + value;
  },
  'background-color'(value) {
    return 'FILL_COLOR=' + value;
  },
};
const inlineStyleMap_entries = Object.entries(inlineStyleMap);

const blockDataMap = {
  'text-align'(value) {
    return { textAlign: value };
  }
};
const blockDataMap_entries = Object.entries(blockDataMap);

const defaultStyle = {
  'color': 'rgb(0, 0, 0)',
  'text-align': 'left'
};

function extractBlockData(node) {
  let data = {};
  for (const [propName, toDataProps] of blockDataMap_entries) {
    const propValue = node.style[propName];
    if (propValue !== defaultStyle[propName]) data = {
      ...data,
      ...toDataProps(propValue)
    };
  }
  return data;
}

function computeStyle(node, parentStyle) {
  const style = { ...parentStyle };
  for (const [propName] of inlineStyleMap_entries) {
    const propValue = node.style[propName];
    if (propValue && propValue !== defaultStyle[propName]) style[propName] = propValue;
  }
  return style;
}

function toInlineStyleRanges(offset, length, style) {
  const inlineStyleRanges = [];
  for (const [propName, toInlineStyle] of inlineStyleMap_entries) {
    const propValue = style[propName];
    if (propValue) inlineStyleRanges.push({
      offset, length,
      style: toInlineStyle(style[propName])
    });
  }
  return inlineStyleRanges;
}

function extractBlockProps(entities, node, offset = 0, parentStyle) {

  if (node instanceof Image) {
    const { 'data-src': dataSrc, 'data-symmetric': dataSymmetric, src, width, height } = node;
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