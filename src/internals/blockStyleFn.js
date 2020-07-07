export function blockStyleFn(contentBlock) {
  const type = contentBlock.getType();
  const data = contentBlock.getData();
  const classes = [];
  
  if (type === 'unstyled') {
    const textAlign = data.get('textAlign');
    if (textAlign === 'left') classes.push('unstyled_textAlign_left');
    if (textAlign === 'center') classes.push('unstyled_textAlign_center');
    if (textAlign === 'right') classes.push('unstyled_textAlign_right');
    if (textAlign === 'justify') classes.push('unstyled_textAlign_justify');
  }

  if (type === 'unordered-list-item' || type === 'ordered-list-item') {
    const textAlign = data.get('textAlign');
    if (textAlign === 'left') classes.push('listItem_textAlign_left');
    if (textAlign === 'center') classes.push('listItem_textAlign_center');
    if (textAlign === 'right') classes.push('listItem_textAlign_right');
    if (textAlign === 'justify') classes.push('listItem_textAlign_justify');
  }

  if (classes.length > 0) return classes.join(' ');
}