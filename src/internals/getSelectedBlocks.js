export function getSelectedBlocks(editorState) {
  const content = editorState.getCurrentContent();
  const selection = editorState.getSelection();

  let blockKey = selection.getStartKey();
  const endKey = selection.getEndKey();
  const blocks = [content.getBlockForKey(blockKey)];

  if (blockKey === endKey) return blocks;
  while (blockKey !== endKey) {
    const nextBlock = content.getBlockAfter(blockKey);
    blocks.push(nextBlock);
    blockKey = nextBlock.getKey();
  }
  return blocks;
}