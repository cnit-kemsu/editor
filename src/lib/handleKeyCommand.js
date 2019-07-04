import { RichUtils } from 'draft-js';

export function handleKeyCommand(command, editorState) {
  const newState = RichUtils.handleKeyCommand(editorState, command);
  if (newState) {
    this.onChange(newState);
    return 'handled';
  }
  return 'not-handled';
}