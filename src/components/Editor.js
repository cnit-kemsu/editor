import React, { PureComponent } from 'react';
import { Editor as DraftEditor, EditorState, CompositeDecorator } from 'draft-js';
import { withStyles } from "@material-ui/core/styles";
import { findImageEntities } from '../lib/findImageEntities';
import { handlePastedText } from '../lib/handlePastedText';
import { handleDrop } from '../lib/handleDrop';
import { handleKeyCommand } from '../lib/handleKeyCommand';
import { handleDroppedFiles } from '../lib/handleDroppedFiles';
import { insertImage } from '../lib/insertImage';
import { blockStyleFn } from '../lib/blockStyleFn';
import { customStyleFn } from '../lib/customStyleFn';
import Image from '../components/Image';
import Toolbar from '../components/Toolbar';

import { Editor as styles } from './styles';

import './draft_editor_styles.css';

class Editor extends PureComponent {

  constructor(props) {
    super(props);

    this.decorator = new CompositeDecorator([{
      strategy: findImageEntities,
      component: React.memo(this.renderImage.bind(this))
    }]);

    this.getEditorState = this.getEditorState.bind(this);
    this.onChange = this.onChange.bind(this);
    this.handlePastedText = this.handlePastedText.bind(this);
    this.handleKeyCommand = handleKeyCommand.bind(this);
    this.handleDroppedFiles = this.handleDroppedFiles.bind(this);
    this.insertImage = this.insertImage.bind(this);

    this.handleDrop = this.handleDrop.bind(this);
  }
  
  get value() {
    const { value } = this.props;
    if (value == null) return EditorState.createEmpty(this.decorator);
    return value instanceof EditorState
      ? value
      : EditorState.createWithContent(value, this.decorator);
  } 

  getEditorState() {
    return this.value;
  }

  onChange(editorState) {
    this.props.onChange(editorState);
  }

  renderImage(props) {
    return <Image {...props}
      onChange={this.onChange}
      getEditorState={this.getEditorState}
    />;
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
    handleDrop(selection, html, this.value)
    |> this.onChange(#);
    return true;
  }

  handleDroppedFiles(selection, files) {
    const editorState = handleDroppedFiles(selection, files, this.value);
    if (editorState) this.onChange(editorState);
  }

  insertImage(src) {
    insertImage(src, this.value)
    |> this.onChange(#);
  }

  render() {
    const { classes } = this.props;

    return <div className={classes.root}>

      <Toolbar editorState={this.value} onChange={this.onChange} />
      
      <div className={classes.content}>
        <DraftEditor
          editorState={this.value}
          onChange={this.onChange}
          handleKeyCommand={this.handleKeyCommand}
          handlePastedText={this.handlePastedText}
          handleDrop={this.handleDrop}
          handleDroppedFiles={this.handleDroppedFiles}
          blockStyleFn={blockStyleFn}
          customStyleFn={customStyleFn}
        />
      </div>
      
    </div>;
  }
}

export default withStyles(styles)(Editor);

