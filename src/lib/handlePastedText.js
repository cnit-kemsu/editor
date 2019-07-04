import { convertFromHTML, convertToRaw, convertFromRaw, ContentState, Modifier, EditorState } from 'draft-js';
import { replaceImageEntities } from './replaceImageEntities';

function removeLastCharacterFromBlock(block) {
  return block.text
  |> #.substring(0, #.length - 1)
  |> block.set('text', #);
} 

export function handlePastedText(html, editorState) {
  
  return convertFromHTML(html)
  
  |> ContentState.createFromBlockArray(
      #.contentBlocks.map(removeLastCharacterFromBlock),
      #.entityMap
    )
  
  |> convertToRaw(#)
  |> convertFromRaw({
      blocks: #.blocks,
      entityMap: replaceImageEntities(#.entityMap, html)
    })
  
  |> Modifier.replaceWithFragment(editorState.getCurrentContent(), editorState.getSelection(), #.blockMap)
  |> EditorState.push(editorState, #, 'insert-fragment');
}