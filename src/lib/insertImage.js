import { Modifier, EditorState } from 'draft-js';

export function insertImage(src, editorState) {
 
  return editorState.getCurrentContent()
  
  |> #.createEntity('IMAGE', 'IMMUTABLE', {
      src,
      symmetric: true
    })

  |> Modifier.insertText(
      #, editorState.getSelection(),
      '\u{1F4F7}', null, #.getLastCreatedEntityKey()
    )

  |> EditorState.push(editorState, #, 'insert-characters');
 }