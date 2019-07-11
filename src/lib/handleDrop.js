import { Modifier, EditorState } from 'draft-js';
import { parseHTMLTransferData } from './parseHTMLTransferData';

export function handleDrop(selection, html, editorState) {
  const { anchorKey, anchorOffset } = selection;
  const movableSelection = editorState.getSelection();
  const endKey = movableSelection.getEndKey();
  const endOffset = movableSelection.getEndOffset();

  const content = editorState.getCurrentContent();
  const movableContent = parseHTMLTransferData(html);

  const newContent = anchorKey === endKey && anchorOffset > endOffset
    ? Modifier.replaceWithFragment(content, selection, movableContent.blockMap)
      |> Modifier.removeRange(#, movableSelection)
    : Modifier.removeRange(content, movableSelection)
      |> Modifier.replaceWithFragment(#, selection, movableContent.blockMap);
  
  return EditorState.push(editorState, newContent, 'insert-fragment');
}