import { convertFromHTML, convertToRaw, convertFromRaw, ContentState } from 'draft-js';
import { replaceImageEntities } from './replaceImageEntities';

function adjustBlockText(block) {
  const text = block.text;
  const lastIndex = text.length - 1;
  if (text[lastIndex] !== '\n') return;
  block.text = text.substring(0, lastIndex);
}

const stylesMap = {
  'color': value => 'TEXT_COLOR=' + value,
  'background-color': value => 'FILL_COLOR=' + value,
  'textDecoration': value => value === 'line-through' ? 'STRIKETHROUGH' : 'UNDERLINE',
  'vertical-align': value => value === 'super' ? 'SUPERSCRIPT' : 'SUBSCRIPT',
};

const defaultValues = {
  'color': 'rgb(0, 0, 0)'
};

function parseInlineStyles(html) {

  const findStyleProp = /(?<name>\S*?)\s*?:\s*?(?<value>\S.*?)\s*?;/g;
  const inlineStyles = [];
  let styleProp = findStyleProp.exec(html);
  while (styleProp !== null) {
    const { name, value } = styleProp.groups;
    const inlineStyle = stylesMap[name];
    if (inlineStyle !== undefined && defaultValues[name] !== value) {
      typeof inlineStyle === 'function' && inlineStyle(value) || inlineStyle
      |> inlineStyles.push(#);
    }
    styleProp = findStyleProp.exec(html);
  }
  return inlineStyles.length === 0 ? null : inlineStyles;
}

const findStyle = /style="(?<style>.*?)"/;

function adjustBlockInlineStyleRanges(block, fragment, offset) {

  const { text } = fragment.groups;
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
    const findBlock = /<div data-block="true".*?>.*?<div.*?>(?<content>.*?)<\/div>.*?<\/div>/g;
    for (let index = 0; index < totalBlocks; index++) {
      const blockHTMLContent = findBlock.exec(_html).groups.content;
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