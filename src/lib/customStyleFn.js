const inlineStylesMap = {
  TEXT_COLOR: value => ({
    color: value
  }),
  FILL_COLOR: value => ({
    backgroundColor: value
  }),
  FONT_SIZE: value => ({
    fontSize: value
  }),
  FONT_FAMILY: value => ({
    fontFamily: value + ', sans-serif'
  }),
  STRIKETHROUGH: (value, style) => ({
    textDecoration: style.textDecoration === undefined ? 'line-through' : style.textDecoration + ' line-through'
  }),
  UNDERLINE: (value, style) => ({
    textDecoration: style.textDecoration === undefined ? 'underline' : style.textDecoration + ' underline'
  }),
  SUPERSCRIPT: {
    verticalAlign: 'super'
  },
  SUBSCRIPT: {
    verticalAlign: 'sub'
  }
};

export function customStyleFn(styles) {
  const inlineStyles = styles.toArray();

  return inlineStyles.reduce(
    (style, currentInlineStyle) => {
      const [name, value] = currentInlineStyle.split('=');
      const styleProps = inlineStylesMap[name];
      return styleProps === undefined ? style : {
        ...style,
        ...typeof styleProps === 'function' ? styleProps(value, style) : styleProps
      };
    }
  , {});
}