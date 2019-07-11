import { Modifier, EditorState } from 'draft-js';
import { parseHTMLTransferData } from './parseHTMLTransferData';

export function handlePastedText(html, editorState) {
  
  return parseHTMLTransferData(html)
  |> Modifier.replaceWithFragment(editorState.getCurrentContent(), editorState.getSelection(), #.blockMap)
  |> EditorState.push(editorState, #, 'insert-fragment');
}