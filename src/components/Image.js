import React, { PureComponent } from 'react';
import { Modifier, EditorState, SelectionState } from 'draft-js';
import { withStyles } from "@material-ui/core/styles";
import { editorSettings } from '../lib/settings';
import { getSelectedKeys } from '../lib/getSelectedKeys';
import Resizer from './Resizer';
import { EditorContext } from './EditorContext';
import { Image as styles } from './styles';

class Image extends PureComponent {
  static contextType = EditorContext;

  constructor(props) {
    super(props);

    this.state = { focused: false };

    this.isCurrentEntityKey = this.isCurrentEntityKey.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.resize = this.resize.bind(this);
    this.onDragStart = this.onDragStart.bind(this);

    this.root = React.createRef();
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
  getSelection() {
    const { blockKey } = this.props;

    const offset = this.context.getEditorState()
      .getCurrentContent().getBlockForKey(blockKey)
      .getCharacterList().findIndex(this.isCurrentEntityKey);

      return SelectionState.createEmpty(blockKey).merge({
      anchorOffset: offset,
      focusOffset: offset + 2,
      hasFocus: true
    });
  }

  resize({ width, height }) {
    const { entityKey } = this.props;
    const editorState = this.context.getEditorState();
    const { symmetric, src } = editorState.getCurrentContent().getEntity(entityKey).getData();
    const currentSelection = this.getSelection();

    editorState.getCurrentContent()
    |> #.createEntity('IMAGE', 'IMMUTABLE', { symmetric, src, width, height })
    |> Modifier.applyEntity(#, currentSelection, #.getLastCreatedEntityKey())
    |> EditorState.push(editorState, #, 'apply-entity')
    |> EditorState.forceSelection(#, currentSelection)
    |> this.context.onChange(#);
  }

  forceSelection() {
    const editorState = this.context.getEditorState();
    const currentSelection = this.getSelection();

    if (currentSelection.getAnchorOffset() === 0) {
      const selection = window.getSelection();
      selection.removeAllRanges();
      const range = document.createRange();
      range.setStart(this.root.current, 0);
      selection.addRange(range);
      //selection.extend(this.root.current, 2);
    }

    EditorState.forceSelection(editorState, currentSelection)
    |> this.context.onChange(#);
  }

  onDragStart() {
    const { blockKey } = this.props;
    const editorState = this.context.getEditorState();

    const selectedKeys = getSelectedKeys(editorState);
    const currentIndex = selectedKeys.indexOf(blockKey);
    if (currentIndex === -1) this.forceSelection();
    if (currentIndex > 0 && currentIndex < selectedKeys.length - 1) return;

    const selection = editorState.getSelection();
    const currentSelection = this.getSelection();

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

    EditorState.forceSelection(editorState, currentSelection)
    |> this.context.onChange(#);
  }

  render() {

    const { classes, contentState, offsetKey, entityKey } = this.props;
    const { state: { focused }, onFocus, onBlur, resize } = this;
    const { symmetric, src, width, height } = contentState.getEntity(entityKey).getData();
    const rootProps = focused ? undefined : { contentEditable: false };
    const _src = editorSettings.replaceImageSrc(src);

    return <span data-offset-key={offsetKey} draggable={true} ref={this.root}
      onDragStart={this.onDragStart} {...rootProps}
    >
      <Resizer {...{ symmetric, focused, onFocus, onBlur, onResize: resize }}>
        <img className={classes.image}
          data-symmetric={symmetric}
          {...{ src: _src, width, height }}
        />
      </Resizer>
      <span data-text={true} className={classes.text}>{'\u{1F4F7}'}</span>
    </span>;
  }
}

export default withStyles(styles)(Image);