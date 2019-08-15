import { Modifier, EditorState } from 'draft-js';
import { parseHTML } from './parseHTML';

export function handlePastedText(html, editorState) {
  
  const parsed = parseHTML(html);
  return Modifier.replaceWithFragment(editorState.getCurrentContent(), editorState.getSelection(), parsed.blockMap)
  |> EditorState.push(editorState, #, 'insert-fragment');
}