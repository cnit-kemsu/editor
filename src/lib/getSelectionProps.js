function handleBooleanProp(props, name, styles) {
  if (props[name] !== null) {
    if (styles.includes(name)) {
      if (props[name] === false) props[name] = null;
      else props[name] = true;
    }
    else {
      if (props[name] === true) props[name] = null;
      else props[name] = false;
    }
  }
}

const searchProps = {
  FONT_SIZE(value) { return value.substring(0, 9) === 'FONT_SIZE'; },
  FONT_FAMILY(value) { return value.substring(0, 11) === 'FONT_FAMILY'; }
};

function handlePropWithValue(props, name, styles, defaultValue) {
  if (props[name] !== null) {
    const prop = styles.find(searchProps[name]);
    if (prop) {
      const value = prop.substring(name.length + 1);
      if (props[name] === undefined) props[name] = value;
      else if (props[name] !== value) props[name] = null;
    } else {
      if (props[name] !== undefined && props[name] !== defaultValue) props[name] = null;
      else props[name] = defaultValue;
    }
  }
}

function finalizeBooleanProp(props, name) {
  if (props[name] === undefined) props[name] = false;
}

function finalizePropWithValue(props, name, value) {
  if (props[name] === undefined) props[name] = value;
}

function handleBlock(block, startOffset, endOffset, isStartBlock, isEndBlock, props) {
  const characters = block.getCharacterList();
  let startIndex = 0;
  let endIndex = characters.size;
  if (isStartBlock && isEndBlock) {
    if (startOffset === endOffset) {
      if (startOffset === 0) {
        startIndex = 0;
        endIndex = 1;
      } else {
        startIndex = startOffset - 1;
        endIndex = startOffset;
      }
    } else {
      startIndex = startOffset;
      endIndex = endOffset;
    }
  } else if (isStartBlock) {
    startIndex = startOffset;
  } else if (isEndBlock) {
    endIndex = endOffset;
  }
  for (let index = startIndex; index < endIndex; index++) {
    const styles = characters.get(index).style.toArray();
    handleBooleanProp(props, 'BOLD', styles);
    handleBooleanProp(props, 'ITALIC', styles);
    handleBooleanProp(props, 'UNDERLINE', styles);
    handleBooleanProp(props, 'STRIKETHROUGH', styles);
    handlePropWithValue(props, 'FONT_SIZE', styles, '16px');
    handlePropWithValue(props, 'FONT_FAMILY', styles, 'Roboto');
    handleBooleanProp(props, 'SUPERSCRIPT', styles);
    handleBooleanProp(props, 'SUBSCRIPT', styles);
  }
}

export function getSelectionProps(currentContent, selection) {
  let currentKey = selection.getStartKey();
  const endKey = selection.getEndKey();
  const startOffset = selection.getStartOffset();
  const endOffset = selection.getEndOffset();
  console.log(startOffset);

  const props = {
    BOLD: undefined,
    ITALIC: undefined,
    UNDERLINE: undefined,
    STRIKETHROUGH: undefined,
    TEXT_COLOR: null,
    FILL_COLOR: null,
    FONT_SIZE: undefined,
    FONT_FAMILY: undefined,
    SUPERSCRIPT: null,
    SUBSCRIPT: null,
    TEXT_ALIGN: null,
    blockType: null
  };

  let currentBlock;
  let isStartBlock = true;
  let isEndBlock = false;
  while(currentKey !== endKey) {
    currentBlock = currentContent.getBlockForKey(currentKey);

    handleBlock(currentBlock, startOffset, endOffset, isStartBlock, isEndBlock, props);

    currentKey = currentContent.getKeyAfter(currentKey);
    isStartBlock = false;
  }
  currentBlock = currentContent.getBlockForKey(currentKey);
  isEndBlock = true;

  handleBlock(currentBlock, startOffset, endOffset, isStartBlock, isEndBlock, props);

  finalizeBooleanProp(props, 'BOLD');
  finalizeBooleanProp(props, 'ITALIC');
  finalizeBooleanProp(props, 'UNDERLINE');
  finalizeBooleanProp(props, 'STRIKETHROUGH');
  finalizePropWithValue(props, 'FONT_SIZE', '16px');
  finalizePropWithValue(props, 'FONT_FAMILY', 'Roboto');
  console.log('FONT_SIZE:', props.FONT_SIZE);
  console.log('FONT_FAMILY:', props.FONT_FAMILY);

  console.log(props);
  return props;
}