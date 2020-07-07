const inlineStylesMap = {
  TEXT_COLOR(value) {
    return { color: value };
  },
  FILL_COLOR(value) {
    return { backgroundColor: value };
  },
  FONT_SIZE(value) {
    return { fontSize: value };
  },
  FONT_FAMILY(value) {
    return { fontFamily: value + ', sans-serif' };
  },
  STRIKETHROUGH(value, style) {
    return {textDecoration: (style.textDecoration || '') + ' line-through' };
  },
  UNDERLINE(value, style) {
    return {textDecoration: (style.textDecoration || '') + ' underline' };
  },
  SUPERSCRIPT() {
    return { verticalAlign: 'super' };
  },
  SUBSCRIPT() {
    return { verticalAlign: 'sub' };
  }
};

export function customStyleFn(styles) {
  const inlineStyles = styles.toArray();

  return inlineStyles.reduce(
    (style, currentInlineStyle) => {
      const [name, value] = currentInlineStyle.split('=');
      const toStyleProps = inlineStylesMap[name];
      return !toStyleProps ? style : {
        ...style,
        ...toStyleProps(value, style)
      };
    }
  , {});
}