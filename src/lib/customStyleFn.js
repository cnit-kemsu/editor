const inlineStylesMap = {
  TEXT_COLOR: value => ({
    color: value
  }),
  FILL_COLOR: value => ({
    backgroundColor: value
  }),
  FONT_SIZE: value => ({
    fontSize: value + 'px'
  }),
  FONT_FAMILY: value => ({
    fontFamily: value
  }),
  STRIKETHROUGH: {
    textDecoration: 'line-through'
  },
  SUPERSCRIPT: {
    verticalAlign: 'super',
    fontSize: '80%'
  },
  SUBSCRIPT: {
    verticalAlign: 'sub',
    fontSize: '80%'
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
        ...typeof styleProps === 'function' ? styleProps(value) : styleProps
      };
    }
  , {});
}