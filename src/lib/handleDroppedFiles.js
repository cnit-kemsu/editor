import { insertImage } from '@lib/insertImage';

const imageTypes = [
  'image/jpeg',
  'image/png'
];

export function handleDroppedFiles(selection, files, editorState) {
  const file = files[0];
  if (!imageTypes.includes(file.type)) return;

  const src = URL.createObjectURL(file);
  return insertImage(src, editorState, selection);
}