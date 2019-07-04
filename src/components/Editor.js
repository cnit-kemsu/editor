import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import { Editor as DraftJSEditor, EditorState, CompositeDecorator } from 'draft-js';
import { findImageEntities } from '@lib/findImageEntities';
import { handlePastedText } from '@lib/handlePastedText';
import { handleKeyCommand } from '@lib/handleKeyCommand';
import { insertImage } from '@lib/insertImage';
import { Image } from '@components/Image';

export class Editor extends PureComponent {

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

    this.disable = this.disable.bind(this);
    this.enable = this.enable.bind(this);
    this.getEditorState = this.getEditorState.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onChangeCallback = this.onChangeCallback.bind(this);
    this.handlePastedText = this.handlePastedText.bind(this);
    this.handleKeyCommand = handleKeyCommand.bind(this);
    this.insertImage = this.insertImage.bind(this);

    //this.undo = this.undo.bind(this);
  }
  
  componentDidMount() {
    this.contentNode = ReactDOM.findDOMNode(this.editor.current).querySelector('.public-DraftEditor-content');
    // this.contentNode.addEventListener('mousedown', (event) => {
    //   //event.preventDefault();
    //   const { clientX, clientY } = event;
    //   const element = document.elementFromPoint(clientX, clientY);
    //   console.log(element);
    //   console.log('lalala');
    // });
  }

  disable() {
    this.contentNode.setAttribute('contenteditable', 'false');
    //this.contentNode.style.userSelect = 'none';
  }

  enable() {
    this.contentNode.setAttribute('contenteditable', 'true');
    //this.contentNode.style.userSelect = 'text';
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
      onFocus={this.disable}
      onBlur={this.enable}
    />;
  }

  handlePastedText(text, html, editorState) {
    this.setState({
      editorState: handlePastedText(html, editorState)
    }, this.onChangeCallback);
    return true;
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

    return <>
      {/* <div>
        <button onClick={this.undo}>undo</button>
      </div> */}
      <DraftJSEditor ref={this.editor}
        editorState={this.state.editorState}
        onChange={this.onChange}
        handleKeyCommand={this.handleKeyCommand}
        handlePastedText={this.handlePastedText}
      />
    </>;
  }
}

