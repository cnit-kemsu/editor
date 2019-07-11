import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import { Editor as DraftJSEditor, EditorState, CompositeDecorator } from 'draft-js';
import { withStyles } from "@material-ui/core/styles";
import { findImageEntities } from '../lib/findImageEntities';
import { handlePastedText } from '../lib/handlePastedText';
import { handleDrop } from '../lib/handleDrop';
import { handleKeyCommand } from '../lib/handleKeyCommand';
import { handleDroppedFiles } from '../lib/handleDroppedFiles';
import { insertImage } from '../lib/insertImage';
import { blockStyleFn } from '../lib/blockStyleFn';
import Image from '../components/Image';
import Toolbar from '../components/Toolbar';

import { Editor as styles } from './styles';

import './draft_editor_styles.css';

class Editor extends PureComponent {

  constructor(props) {
    super(props);

    const decorator = new CompositeDecorator([{
      strategy: findImageEntities,
      component: React.memo(this.renderImage.bind(this))
    }]);

    this.state = {
      editorState: this.props.content == null
        ? EditorState.createEmpty(decorator)
        : EditorState.createWithContent(this.props.content, decorator)
    };

    this.editor = React.createRef();

    this.getEditorState = this.getEditorState.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onChangeCallback = this.onChangeCallback.bind(this);
    this.handlePastedText = this.handlePastedText.bind(this);
    this.handleKeyCommand = handleKeyCommand.bind(this);
    this.handleDroppedFiles = this.handleDroppedFiles.bind(this);
    this.insertImage = this.insertImage.bind(this);

    this.handleDrop = this.handleDrop.bind(this);
    //this.undo = this.undo.bind(this);
  }
  
  componentDidMount() {
    this.contentNode = ReactDOM.findDOMNode(this.editor.current).querySelector('.public-DraftEditor-content');
  }

  getEditorState() {
    return this.state.editorState;
  }

  onChange(editorState) {
    this.setState({
      editorState
    }, this.onChangeCallback);
  }

  onChangeCallback() {
    this.props.onChange?.(this.state.editorState);
  }

  renderImage(props) {
    return <Image {...props}
      onChange={this.onChange}
      getEditorState={this.getEditorState}
    />;
  }

  handlePastedText(text, html, editorState) {
    if (!html) return false;
    this.setState({
      editorState: handlePastedText(html, editorState)
    }, this.onChangeCallback);
    return true;
  }

  handleDrop(selection, dataTransfer) {
    const html = dataTransfer.getHTML();
    if (!html) return false;
    this.setState({
      editorState: handleDrop(selection, html, this.state.editorState)
    }, this.onChangeCallback);
    return true;
  }

  handleDroppedFiles(selection, files) {
    const editorState = handleDroppedFiles(selection, files, this.state.editorState);
    if (editorState) this.setState({ editorState }, this.onChangeCallback);
  }

  insertImage(src) {
    this.setState(
      ({ editorState }) => ({
        editorState: insertImage(src, editorState)
      }),
      this.onChangeCallback
    );
  }

  // undo(e) {
  //   e.preventDefault();

  //   this.setState({
  //     editorState: EditorState.undo(this.state.editorState)
  //   });
  // }

  render() {
    const { classes } = this.props;

    return <div className={classes.root}>
      {/* <div>
        <button onClick={this.undo}>undo</button>
      </div> */}
      <Toolbar editorState={this.state.editorState} onChange={this.onChange} />
      <div className={classes.content}>
        <DraftJSEditor ref={this.editor}
          editorState={this.state.editorState}
          onChange={this.onChange}
          handleKeyCommand={this.handleKeyCommand}
          handlePastedText={this.handlePastedText}
          handleDroppedFiles={this.handleDroppedFiles}
          blockStyleFn={blockStyleFn}
          handleDrop={this.handleDrop}
        />
      </div>
      
    </div>;
  }
}

export default withStyles(styles)(Editor);

