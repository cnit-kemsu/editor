import React, { PureComponent } from 'react';
import { Modifier, EditorState, SelectionState } from 'draft-js';
import { withStyles } from "@material-ui/core/styles";
import { printAttributes } from '@lib/printAttributes';
import { Resizer } from './Resizer';
import { Image as styles } from './styles';

const dataAttributeMap = {
  symmetric: 'data-symmetric'
};

class Image extends PureComponent {

  constructor(props) {
    super(props);

    this.copyToClipboard = this.copyToClipboard.bind(this);
    this.focus = this.focus.bind(this);
    this.blur = this.blur.bind(this);
    this.resize = this.resize.bind(this);
    this.remove = this.remove.bind(this);
    this.handleKeyCommand = this.handleKeyCommand.bind(this);
  }

  handleKeyCommand(event) {
    event.preventDefault();
    const { ctrlKey, which } = event;

    if (ctrlKey) {
      if (which === 90) this.undo();
      else if (which === 89) this.redo();
      else if (which === 67) this.copy();
      else if (which === 88) this.cut();
    } else {
      if (which === 8) this.remove();
      if (which === 46) this.remove();
    }
  }

  copyToClipboard(event) {
    event.preventDefault();
    //event.clipboardData.setData('text/plain', '');
    const attributes = printAttributes(this.data, dataAttributeMap);
    event.clipboardData.setData('text/html', `<img ${attributes} />1`); // TODO: find a bug
  }

  focus() {
    document.addEventListener('keydown', this.handleKeyCommand);
    document.addEventListener('copy', this.copyToClipboard);
    this.props.onFocus?.();
  }
  onBlur() {
    document.removeEventListener('keydown', this.handleKeyCommand);
    document.removeEventListener('copy', this.copyToClipboard);
  }
  blur() {
    this.onBlur();
    this.props.onBlur?.();
  }

  getOffset() {
    const { getEditorState, entityKey, blockKey } = this.props;
    return getEditorState()
      .getCurrentContent().getBlockForKey(blockKey)
      .getCharacterList().findIndex(character => character.entity === entityKey);
  }

  getSelection(offset, focusLength = 0) {
    const { blockKey } = this.props;

    return SelectionState.createEmpty(blockKey).merge({
      anchorOffset: offset,
      focusOffset: offset + focusLength
    });
  }

  resize({ width, height }) {
    const { getEditorState, entityKey, onChange } = this.props;
    const editorState = getEditorState();
    const offset = this.getOffset();
    const { symmetric, src } = editorState.getCurrentContent().getEntity(entityKey).getData();

    editorState.getCurrentContent()
    |> #.createEntity('IMAGE', 'IMMUTABLE', { symmetric, src, width, height })
    |> Modifier.applyEntity(#, this.getSelection(offset, 2), #.getLastCreatedEntityKey())
    |> EditorState.push(editorState, #, 'apply-entity')
    |> onChange;
  }

  remove() {
    this.onBlur();

    const { getEditorState, onChange } = this.props;
    const editorState = getEditorState();
    const offset = this.getOffset();

    editorState.getCurrentContent()
    |> Modifier.removeRange(#, this.getSelection(offset, 2), 'forward')
    |> EditorState.push(editorState, #, 'remove-range')
    |> EditorState.forceSelection(#, this.getSelection(offset))
    |> onChange;
  }

  copy() {
    document.execCommand('copy');
  }
  cut() {
    this.copy();
    this.remove();
  }
  undo() {
    const { getEditorState, onChange } = this.props;
    getEditorState()
    |> EditorState.undo
    |> onChange;
  }
  redo() {
    const { getEditorState, onChange } = this.props;
    getEditorState()
    |> EditorState.redo
    |> onChange;
  }

  render() {
    const { classes, contentState, offsetKey, entityKey } = this.props;
    const { focus, blur, resize } = this;
    this.data = contentState.getEntity(entityKey).getData();
    const { symmetric, src, width, height } = this.data;

    return <>
      <span data-offset-key={offsetKey} contentEditable={false}>
          <Resizer {...{ symmetric, onFocus: focus, onBlur: blur, onResize: resize }}>
            <img className={classes.image} data-symmetric={symmetric} {...{ src, width, height }} />
          </Resizer>
          <span className={classes.text}>{'\u{1F4F7}'}</span>
      </span>
    </>;
  }
}

export default withStyles(styles)(Image);