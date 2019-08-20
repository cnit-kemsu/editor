import { Modifier, EditorState } from 'draft-js';
import { parseHTML } from './parseHTML';

export function handlePastedText(html, editorState, filesAndUrls) {
  
  const parsed = parseHTML(html, filesAndUrls);
  return Modifier.replaceWithFragment(editorState.getCurrentContent(), editorState.getSelection(), parsed.blockMap)
  |> EditorState.push(editorState, #, 'insert-fragment');
}