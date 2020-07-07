export function getSelectedKeys(editorState) {
  const content = editorState.getCurrentContent();
  const selection = editorState.getSelection();

  let currentKey = selection.getStartKey();
  const endKey = selection.getEndKey();
  const keys = [currentKey];

  if (currentKey === endKey) return keys;
  while (currentKey !== endKey) {
    currentKey = content.getKeyAfter(currentKey);
    keys.push(currentKey);
  }
  return keys;
}