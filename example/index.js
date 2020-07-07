import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme } from "@material-ui/core/styles";
import Editor from '@src/components/Editor';
import { parseHTML } from '@src/parseHTML';
import { createEditorStateFromContent } from '@src/createEditorStateFromContent';
import { convertEditorStateToRawContent } from '@src/convertEditorStateToRawContent';

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
  console.log('content:', rawContent);
  console.log('selection: ', editorState.getSelection());
  //console.log('blobs: ', blobs);

  return <>
    <div style={{ width: '800px' }}>
      <Editor editorKey="123"
        editorState={editorState}
        onChange={changeEditorState}
        onFocus={() => console.log('focus')}
        onBlur={() => console.log('blur')}
        //readOnly={true}
      />
    </div>
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