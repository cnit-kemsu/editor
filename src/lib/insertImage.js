import { Modifier, EditorState } from 'draft-js';

export function insertImage(src, editorState, selection) {
 
  return editorState.getCurrentContent()
  
  |> #.createEntity('IMAGE', 'IMMUTABLE', {
      src,
      symmetric: true
    })

  |> Modifier.insertText(
      #, selection || editorState.getSelection(),
      '\u{1F4F7}', null, #.getLastCreatedEntityKey()
    )

  |> EditorState.push(editorState, #, 'insert-characters');
 }