import React, { PureComponent } from 'react';
import { Modifier, EditorState, SelectionState } from 'draft-js';
import { withStyles } from "@material-ui/core/styles";
import { getSelectedKeys } from '../lib/getSelectedKeys';
import Resizer1 from './Resizer1';
import { EditorContext } from './EditorContext';
import { Video as styles } from './styles';

class Video extends PureComponent {
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
  }

  onFocus() {
    if (this.context.readOnly) return;
    this.setState({ focused: true });
    this.forceSelection();
  }

  onBlur() {
    if (this.context.readOnly) return;
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
    const { symmetric, src } = currentContent.getEntity(this.props.entityKey).getData();
    const selection = this.getCurrentSelection();

    //const size = symmetric ? { width } : { width, height };
    const size = { width, height };
    
    this.context.editorState = currentContent.createEntity('VIDEO', 'IMMUTABLE', { symmetric, src, ...size })
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
    const { src, ...data } = this.props.contentState.getEntity(this.props.entityKey).getData();
    this.src = src;
    if (data.width) data.width = data.width + 'px'; else delete data.width;
    if (data.height) data.height = data.height + 'px'; else delete data.height;
    return data;
  }

  render() {

    const { classes, offsetKey } = this.props;
    const { state: { focused }, onFocus, onBlur, resize, context: { readOnly } } = this;
    const { symmetric, width, height } = this.getData();
    const rootProps = focused ? undefined : { contentEditable: false };

    return <span data-offset-key={offsetKey} draggable={true} ref={this.root}
      onDragStart={readOnly ? undefined : this.onDragStart} {...rootProps}
    >
      <Resizer1 {...{ symmetric, focused, onFocus, onBlur, onResize: resize, readOnly }}>
        <span style={{ width, height, display: 'block' }}>
          {!readOnly && <img className={classes.video}
            data-symmetric={symmetric}
            data-video={true}
            data-src={this.src}
            draggable={true}
            src={emptyImageURL}
            style={{ position: 'absolute', top: '0px', left: '0px', width: '100%', height: '100%' }}
          />}
          <iframe style={{ width: '100%', height: '100%' }} src={this.src} frameBorder="0" allowFullScreen />
        </span>
      </Resizer1>
      <span className={classes.text} data-text={true}>{'\u{1F4F7}'}</span>
    </span>;
  }
}

export default withStyles(styles)(Video);

const __canvas = document.createElement("canvas");
__canvas.width=100;
__canvas.height=100;
const emptyImageURL = __canvas.toDataURL();