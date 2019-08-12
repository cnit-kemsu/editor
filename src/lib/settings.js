export const editorSettings = {
  replaceImageSrc(src) {
    if (src.substring(0, 4) === 'file') return '/files/' + src.substring(5);
    return src;
  }
};