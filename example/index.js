import React, { useRef } from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme } from "@material-ui/core/styles";
import { convertToRaw } from 'draft-js';
import { Editor } from '@components/Editor';
import { createContentFromHTML } from '@lib/createContentFromHTML';

const imgUrl = 'https://images.pexels.com/photos/67636/rose-blue-flower-rose-blooms-67636.jpeg?auto';

const content = createContentFromHTML(`
  <div>111111<img src="${imgUrl}" width="100px" />222222</div>
  <div>333333444444</div>
  <ul>
    <li>aaaaaa</li>
    <li>bbbbbb</li>
  </ul>
`);

function App() {

  console.log('render App');

  const editor = useRef();

  const addImage = () => {
    const imageUrl = window.prompt("Paste Image Url", imgUrl);
    editor.current.insertImage(imageUrl);
  };

  const logEditorState = (editorState) => {
    console.log(convertToRaw(editorState.getCurrentContent()));
  };

  return <>
    <div>
      <button onClick={addImage}>add image</button>
    </div>
    <Editor ref={editor} content={content} onChange={logEditorState} />
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