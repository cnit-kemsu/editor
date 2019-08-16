import React, { useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme } from "@material-ui/core/styles";
import Editor from '@components/Editor';
import { createContentFromHTML } from '@lib/createContentFromHTML';
import { createEditorStateWithContent } from '@lib/createEditorStateWithContent';
import { convertStateToRawContent } from '@lib/convertStateToRawContent';
import { blobs } from '@lib/handleDroppedFiles';

const imgUrl = 'https://images.pexels.com/photos/67636/rose-blue-flower-rose-blooms-67636.jpeg?auto';

const initEditorState = createContentFromHTML(`
  <div>111111<img src="${imgUrl}" width="100px" />222222</div>
  <div>333333444444</div>
  <ul>
    <li>aaaaaa</li>
    <li>bbbbbb</li>
  </ul>
`) |> createEditorStateWithContent(#);

function App() {

  const [editorState, changeEditorState] = useState(initEditorState);

  console.log('render App');

  const editor = useRef();

  const onChange = (_editorState) => {
    changeEditorState(_editorState);
  };

  // console.log('content:', convertStateToRawContent(editorState));
  // console.log('selection: ', editorState.getSelection());
  // console.log('blobs: ', blobs);

  return <>
    <Editor ref={editor}
      editorState={editorState}
      onChange={onChange}
      onFocus={() => console.log('focus')}
      onBlur={() => console.log('blur')}
    />
    <div>
      <div>asd<span style={{ color: 'red' }}>123</span></div>
      <div>asd<span style={{ color: 'red' }}>123</span></div>
      <div>asd<span style={{ color: 'red' }}>123</span></div>
    </div>
  </>;
}

const theme = createMuiTheme({});

const Root = () => (
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>
);

ReactDOM.render(
  <Root />,
  document.getElementById('root')
);