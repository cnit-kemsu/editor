import { Modifier, EditorState } from 'draft-js';

export function insertImage(file, editorState, selection) {
 
  return editorState.getCurrentContent()
  
  |> #.createEntity('IMAGE', 'IMMUTABLE', {
      file,
      symmetric: true
    })

  |> Modifier.insertText(
      #, selection || editorState.getSelection(),
      '\u{1F4F7}', null, #.getLastCreatedEntityKey()
    )

  |> EditorState.push(editorState, #, 'insert-characters');
 }