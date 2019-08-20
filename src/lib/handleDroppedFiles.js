import { insertImage } from './insertImage';

const imageTypes = [
  'image/jpeg',
  'image/png'
];

export function handleDroppedFiles(selection, files, editorState) {
  const file = files[0];
  if (!imageTypes.includes(file.type)) return;

  return insertImage(file, editorState, selection);
}