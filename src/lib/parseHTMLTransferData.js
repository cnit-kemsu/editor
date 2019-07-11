import { convertFromHTML, convertToRaw, convertFromRaw, ContentState } from 'draft-js';
import { replaceImageEntities } from './replaceImageEntities';

function adjustBlockText(block) {
  const text = block.text;
  const lastIndex = text.length - 1;
  if (text[lastIndex] !== '\n') return;
  block.text = text.substring(0, lastIndex);
} 

function adjustContent({ blocks, entityMap }, html) {
  blocks.forEach(adjustBlockText);
  return {
    blocks,
    entityMap: replaceImageEntities(entityMap, html)
  };
}

export function parseHTMLTransferData(html) {
  
  return convertFromHTML(html)
  |> ContentState.createFromBlockArray
  |> convertToRaw
  |> adjustContent(#, html)
  |> convertFromRaw;
}