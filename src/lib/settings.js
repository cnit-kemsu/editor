export const editorSettings = {
  replaceImageSrc(src) {
    if (src.substring(0, 7) === 'file_id') return '/files/' + src.substring(8);
    return src;
  }
};