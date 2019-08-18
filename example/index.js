import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme } from "@material-ui/core/styles";
import Editor from '@components/Editor';
import { parseHTML } from '@lib/parseHTML';
import { createEditorStateFromContent } from '@lib/createEditorStateFromContent';
import { convertEditorStateToRawContent } from '@lib/convertEditorStateToRawContent';
import { blobs } from '@lib/handleDroppedFiles';

const imgUrl = 'https://images.pexels.com/photos/67636/rose-blue-flower-rose-blooms-67636.jpeg?auto';

const initEditorState = parseHTML(`
  <div>111111<img src="${imgUrl}" width="100px" />222222</div>
  <div>333333444444</div>
  <ul>
    <li>aaaaaa</li>
    <li>bbbbbb</li>
  </ul>
`) |> createEditorStateFromContent(#);

function App() {

  const [editorState, changeEditorState] = useState(initEditorState);

  console.log('render App');

  const rawContent = convertEditorStateToRawContent(editorState);
  // console.log('content:', rawContent);
  // console.log('selection: ', editorState.getSelection());
  // console.log('blobs: ', blobs);

  return <>
    <Editor editorKey="123"
      editorState={editorState}
      onChange={changeEditorState}
      onFocus={() => console.log('focus')}
      onBlur={() => console.log('blur')}
    />
    {/* <hr />
    <Editor editorKey="asd"
      editorState={createEditorStateFromContent(rawContent)}
      readOnly={true}
    /> */}
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