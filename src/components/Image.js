import React, { PureComponent } from 'react';
import { Modifier, EditorState, SelectionState } from 'draft-js';
import { withStyles } from "@material-ui/core/styles";
import { getSelectedKeys } from '../lib/getSelectedKeys';
import { editorSettings } from '../lib/settings';
import Resizer from './Resizer';
import { EditorContext } from './EditorContext';
import { Image as styles } from './styles';

class Image extends PureComponent {
  static contextType = EditorContext;

  constructor(props) {
    super(props);
    this.state = { focused: false };
    this.root = React.createRef();

    this.isCurrentEntityKey = this.isCurrentEntityKey.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.resize = this.resize.bind(this);
    this.onDragStart = this.onDragStart.bind(this);
    this.getData = this.getData.bind(this);
    this.isCurrentFile = this.isCurrentFile.bind(this);
    this.findCurrentSrc = this.findCurrentSrc.bind(this);
  }

  onFocus() {
    this.setState({ focused: true });
    this.forceSelection();
  }

  onBlur() {
    this.setState({ focused: false });
  }

  isCurrentEntityKey(character) {
    return character.entity === this.props.entityKey;
  }

  getCurrentSelection() {
    const { blockKey } = this.props;

    const offset = this.context.editorState
      .getCurrentContent().getBlockForKey(blockKey)
      .getCharacterList().findIndex(this.isCurrentEntityKey);

    return SelectionState.createEmpty(blockKey).merge({
      anchorOffset: offset,
      focusOffset: offset + 2,
      hasFocus: true
    });
  }

  resize({ width, height }) {
    const editorState = this.context.editorState;
    const currentContent = editorState.getCurrentContent();
    const { symmetric, src, file, fileSourceKey } = currentContent.getEntity(this.props.entityKey).getData();
    const selection = this.getCurrentSelection();

    const size = symmetric ? { width } : { width, height };
    const props = {};
    if (fileSourceKey) props.fileSourceKey = fileSourceKey;
    else if (file) props.file = file;
    else if (src) props.src = src;
    
    this.context.editorState = currentContent.createEntity('IMAGE', 'IMMUTABLE', { symmetric, ...props, ...size })
    |> Modifier.applyEntity(#, selection, #.getLastCreatedEntityKey())
    |> EditorState.push(editorState, #, 'apply-entity')
    |> EditorState.forceSelection(#, selection);
  }

  forceSelection() {
    const editorState = this.context.editorState;
    const selection = this.getCurrentSelection();

    if (selection.getAnchorOffset() === 0) {
      const _selection = window.getSelection();
      _selection.removeAllRanges();
      const range = document.createRange();
      range.setStart(this.root.current, 0);
      _selection.addRange(range);
      //_selection.extend(this.root.current, 2);
    }

    this.context.editorState = EditorState.forceSelection(editorState, selection);
  }

  onDragStart() {
    const editorState = this.context.editorState;

    const selectedKeys = getSelectedKeys(editorState);
    const currentIndex = selectedKeys.indexOf(this.props.blockKey);
    if (currentIndex === -1) this.forceSelection();
    if (currentIndex > 0 && currentIndex < selectedKeys.length - 1) return;

    const selection = editorState.getSelection();
    const currentSelection = this.getCurrentSelection();

    if (currentIndex === 0) {
      const startOffset = selection.getStartOffset();
      const currentStartOffset = currentSelection.getStartOffset();
      if (selectedKeys.length === 1) {
        const endOffset = selection.getEndOffset();
        const currentEndOffset = currentSelection.getEndOffset();
        if (startOffset <= currentStartOffset && endOffset >= currentEndOffset) return;
      }
      else if (startOffset <= currentStartOffset) return;
    } else {
      const endOffset = selection.getEndOffset();
      const currentEndOffset = currentSelection.getEndOffset();
      if (endOffset >= currentEndOffset) return;
    }

    this.context.editorState = EditorState.forceSelection(editorState, currentSelection);
  }

  getData() {
    const { src, file, fileSourceKey, ...data } = this.props.contentState.getEntity(this.props.entityKey).getData();
    this.file = file;
    this.src = src;
    this.fileSourceKey = fileSourceKey;
    return data;
  }

  isCurrentFile([file]) {
    return file === this.file;
  }

  findCurrentSrc() {
    if (this.src) return { src: this.src };
    if (this.fileSourceKey) return {
      src: editorSettings.handleFileSourceKey(this.fileSourceKey),
      fileSourceKey: this.fileSourceKey
    };
    if (!this.file) return {};
    const { filesAndUrls } = this.context;
    let currentIndex = filesAndUrls.findIndex(this.isCurrentFile);
    if (currentIndex === -1) {
      const src = URL.createObjectURL(this.file);
      filesAndUrls.push([this.file, src]);
      currentIndex = filesAndUrls.length - 1;
      return {
        src,
        fileIndex: currentIndex
      };
    }
    return {
      src: filesAndUrls[currentIndex][1],
      fileIndex: currentIndex
    };
  }

  render() {

    const { classes, offsetKey } = this.props;
    const { state: { focused }, onFocus, onBlur, resize } = this;
    const { symmetric, width, height } = this.getData();
    const rootProps = focused ? undefined : { contentEditable: false };
    
    const { src, fileSourceKey, fileIndex } = this.findCurrentSrc();

    return <span data-offset-key={offsetKey} draggable={true} ref={this.root}
      onDragStart={this.onDragStart} {...rootProps}
    >
      <Resizer {...{ symmetric, focused, onFocus, onBlur, onResize: resize }}>
        <img className={classes.image}
          data-file-source-key={fileSourceKey}
          data-file-index={fileIndex}
          data-symmetric={symmetric}
          {...{ src, width, height }}
        />
      </Resizer>
      <span className={classes.text} data-text={true}>{'\u{1F4F7}'}</span>
    </span>;
  }
}

export default withStyles(styles)(Image);