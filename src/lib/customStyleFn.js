export function customStyleFn(style, block) {
  const inlineStyles = style.toArray();
  console.log(style);
  console.log(style.toArray());
  //console.log(block);

  let color = inlineStyles.find(_style => _style.substring(0, 5) === 'COLOR');
  if (color) color = color.substring(5, color.length);

  const output = {};
  if (color) output.color = color;

  return output;
}