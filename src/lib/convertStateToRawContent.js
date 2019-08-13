import { convertToRaw } from 'draft-js';

function adjustContent(content) {
  const blocks = content.blocks;
  for (const block of blocks) {
    const { data } = block;
    delete block.key;
    for (const key of Object.keys(data)) {
      if (data[key] == null) delete data[key];
    }
  }
  return content;
}

export function convertStateToRawContent(editorState) {
  return editorState.getCurrentContent()
  |> convertToRaw
  |> adjustContent;
}