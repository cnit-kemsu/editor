import React, { PureComponent } from 'react';
import { Editor as DraftEditor } from 'draft-js';
import { withStyles } from "@material-ui/core/styles";
import { handleKeyCommand } from '../lib/handleKeyCommand';
import { handlePastedText } from '../lib/handlePastedText';
import { handleDrop } from '../lib/handleDrop';
import { handleDroppedFiles } from '../lib/handleDroppedFiles';
import { blockStyleFn } from '../lib/blockStyleFn';
import { customStyleFn } from '../lib/customStyleFn';
import { createEditorStateFromContent } from '../lib/createEditorStateFromContent';
import { EditorContext } from './EditorContext';
import Toolbar from './Toolbar';
import { Editor as styles } from './styles';
import './draft_editor_styles.css';

class Editor extends PureComponent {
  constructor(props) {
    super(props);
    this.root = React.createRef();

    this.onChange = this.onChange.bind(this);
    this.handleKeyCommand = this.handleKeyCommand.bind(this);
    this.handlePastedText = this.handlePastedText.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
    this.handleDroppedFiles = this.handleDroppedFiles.bind(this);

    const getEditorState = () => this.props.editorState;
    const setEditorState = this.onChange;
    this.editorContext = {
      get editorState() {
        return getEditorState();
      },
      set editorState(value) {
        setEditorState(value);
      },
      filesAndUrls: []
    };
  }
  
  onChange(editorState) {
    this.props.onChange?.(editorState);
  }

  handleKeyCommand(command, editorState) {
    const newState = handleKeyCommand(command, editorState);
    if (newState) {
      this.onChange(newState);
      return 'handled';
    }
    return 'not-handled';
  }

  handlePastedText(text, html, editorState) {
    if (!html) return false;
    handlePastedText(html, editorState, this.editorContext.filesAndUrls)
    |> this.onChange(#);
    return true;
  }

  handleDrop(selection, dataTransfer) {
    const html = dataTransfer.getHTML();
    if (!html) return false;
    handleDrop(selection, html, this.props.editorState, this.editorContext.filesAndUrls)
    |> this.onChange(#);
    return true;
  }

  handleDroppedFiles(selection, files) {
    const newState = handleDroppedFiles(selection, files, this.props.editorState);
    if (newState) this.onChange(newState);
    //return true;
  }

  render() {
    const { classes, editorState, onFocus, onBlur, readOnly = false } = this.props;

    return <div className={readOnly ? undefined : classes.root}>

      {!readOnly && <Toolbar editorState={editorState} onChange={this.onChange} />}
      
      <div ref={this.root} className={classes.content}>
        <EditorContext.Provider value={this.editorContext}>
          <DraftEditor
            editorState={editorState || createEditorStateFromContent()}
            onChange={this.onChange}
            handleKeyCommand={this.handleKeyCommand}
            handlePastedText={this.handlePastedText}
            handleDrop={this.handleDrop}
            handleDroppedFiles={this.handleDroppedFiles}
            blockStyleFn={blockStyleFn}
            customStyleFn={customStyleFn}
            onFocus={onFocus}
            onBlur={onBlur}
            readOnly={readOnly}
          />
        </EditorContext.Provider>
      </div>
      
    </div>;
  }
}

export default withStyles(styles)(Editor);

