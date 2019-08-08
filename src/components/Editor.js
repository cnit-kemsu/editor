import React, { PureComponent } from 'react';
import { Editor as DraftEditor } from 'draft-js';
import { withStyles } from "@material-ui/core/styles";
import { handlePastedText } from '../lib/handlePastedText';
import { handleDrop } from '../lib/handleDrop';
import { handleKeyCommand } from '../lib/handleKeyCommand';
import { handleDroppedFiles } from '../lib/handleDroppedFiles';
import { blockStyleFn } from '../lib/blockStyleFn';
import { customStyleFn } from '../lib/customStyleFn';
import { EditorContext } from './EditorContext';
import Toolbar from '../components/Toolbar';

import { Editor as styles } from './styles';

import './draft_editor_styles.css';

class Editor extends PureComponent {
  //preventNativeChangeEvent = false;

  constructor(props) {
    super(props);

    this.getEditorState = this.getEditorState.bind(this);
    this.onChange = this.onChange.bind(this);
    this.nativeOnChange = this.nativeOnChange.bind(this);
    this.handlePastedText = this.handlePastedText.bind(this);
    this.handleKeyCommand = handleKeyCommand.bind(this);
    this.handleDroppedFiles = this.handleDroppedFiles.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
  }
  
  getEditorState() {
    return this.props.editorState;
  }

  onChange(editorState, /*preventNativeChangeEvent = false*/) {
    //this.preventNativeChangeEvent = preventNativeChangeEvent;
    this.props.onChange?.(editorState);
  }

  nativeOnChange(editorState) {
    // if (this.preventNativeChangeEvent) {
    //   this.preventNativeChangeEvent = false;
    // } else this.onChange(editorState);
    this.onChange(editorState);
  }

  handlePastedText(text, html, editorState) {
    if (!html) return false;
    handlePastedText(html, editorState)
    |> this.onChange(#);
    return true;
  }

  handleDrop(selection, dataTransfer) {
    const html = dataTransfer.getHTML();
    if (!html) return false;
    handleDrop(selection, html, this.props.editorState)
    |> this.onChange(#);
    return true;
  }

  handleDroppedFiles(selection, files) {
    const editorState = handleDroppedFiles(selection, files, this.props.editorState);
    if (editorState) this.onChange(editorState);
  }

  render() {
    const { classes, editorState, onFocus, onBlur } = this.props;

    return <div className={classes.root}>

      <Toolbar editorState={editorState} onChange={this.onChange} />
      
      <EditorContext.Provider value={{ onChange: this.onChange, getEditorState: this.getEditorState }}>
        <div className={classes.content}>
          <DraftEditor
            editorState={editorState}
            onChange={this.nativeOnChange}
            handleKeyCommand={this.handleKeyCommand}
            handlePastedText={this.handlePastedText}
            handleDrop={this.handleDrop}
            handleDroppedFiles={this.handleDroppedFiles}
            blockStyleFn={blockStyleFn}
            customStyleFn={customStyleFn}
            onFocus={onFocus}
            onBlur={onBlur}
            handleReturn={() => undefined}
          />
        </div>
      </EditorContext.Provider>
      
    </div>;
  }
}

export default withStyles(styles)(Editor);

