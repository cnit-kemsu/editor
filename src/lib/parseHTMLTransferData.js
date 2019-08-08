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
  'vertical-align': value => verticalAlign[value],
};

const defaultValues = {
  'color': 'rgb(0, 0, 0)',
  'font-size': 'medium',
  'font-family': 'Roboto, sans-serif'
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
    if (inlineStyle !== undefined && defaultValues[name] !== value) {
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

const findStyle = /style="(?<style>.*?)"/;

function adjustBlockInlineStyleRanges(block, fragment, offset) {

  const { text } = fragment.groups;
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
  const findTextFragment = /<span data-offset-key=".*?>.*?<span.*?>(?<text>.*?)<\/span>.*?<\/span>/g;
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
      const blockHTMLContent = _block.groups.content;
      adjustBlock(blocks[index], blockHTMLContent);
    }
  }
  return {
    blocks,
    entityMap: replaceImageEntities(entityMap, html)
  };
}

export function parseHTMLTransferData(html) {
  
  return convertFromHTML(html)
  //|> ContentState.createFromBlockArray
  |> ContentState.createFromBlockArray(#.contentBlocks, #.entityMap)
  |> convertToRaw
  |> adjustContent(#, html)
  |> convertFromRaw;
}