import { RichUtils } from 'draft-js';

export function handleKeyCommand(command, editorState) {
  return RichUtils.handleKeyCommand(editorState, command);
}