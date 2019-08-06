import { Modifier, EditorState, SelectionState } from 'draft-js';
import { parseHTMLTransferData } from './parseHTMLTransferData';

export function handleDrop(selection, html, editorState) {
  const { anchorKey, anchorOffset } = selection;
  const movableSelection = editorState.getSelection();
  const endKey = movableSelection.getEndKey();
  const endOffset = movableSelection.getEndOffset();

  const content = editorState.getCurrentContent();
  const movableContent = parseHTMLTransferData(html);

  const isMovingForwardInsideBlock = anchorKey === endKey && anchorOffset > endOffset;

  const newContent = isMovingForwardInsideBlock
    ? Modifier.replaceWithFragment(content, selection, movableContent.blockMap)
      |> Modifier.removeRange(#, movableSelection)
    : Modifier.removeRange(content, movableSelection)
      |> Modifier.replaceWithFragment(#, selection, movableContent.blockMap);

  
  
  let newState = EditorState.push(editorState, newContent, 'insert-fragment');
  if (isMovingForwardInsideBlock) {
    const nextBlockKey = content.getKeyAfter(endKey);
    const blockKey = nextBlockKey == null
    ? newContent.getLastBlock().getKey()
    : newContent.getKeyBefore(nextBlockKey);
    newState = SelectionState.createEmpty(blockKey)
    |> #.set('anchorOffset', anchorOffset)
    |> #.set('focusOffset', anchorOffset)
    |> EditorState.forceSelection(newState, #);
  }
  return newState;
}