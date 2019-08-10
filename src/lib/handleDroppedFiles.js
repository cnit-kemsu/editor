import { insertImage } from './insertImage';

const imageTypes = [
  'image/jpeg',
  'image/png'
];

export const blobs = {};

export function handleDroppedFiles(selection, files, editorState) {
  const file = files[0];
  if (!imageTypes.includes(file.type)) return;

  const src = URL.createObjectURL(file);
  blobs[src] = file;
  return insertImage(src, editorState, selection);
}