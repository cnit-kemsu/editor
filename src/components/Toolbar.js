import React, { PureComponent } from 'react';
import Immutable from 'immutable';
import { RichUtils, Modifier, EditorState } from 'draft-js';
import { withStyles } from "@material-ui/core/styles";
import { handleDroppedFiles } from '../internals/handleDroppedFiles';
import { getSelectedBlocks } from '../internals/getSelectedBlocks';
import { getOverallBlocksType } from '../internals/getOverallBlocksType';
import { ToolbarContext } from './ToolbarContext';
import InlineStyleButton from './InlineStyleButton';
import BlockTypeButton from './BlockTypeButton';
import BlockDataButton from './BlockDataButton';
import ColorPickerButton from './ColorPickerButton';
import URLPickerButton from './URLPickerButton';
import SelectPicker from './SelectPicker';
import FontSizeList from './FontSizeList';
import FontFamilyList from './FontFamilyList';
import FileDialogButton from './FileDialogButton';
import ToolbarButton from './ToolbarButton';
import { Toolbar as styles } from './styles';

import BoldIcon from '@material-ui/icons/FormatBold';
import ItalicIcon from '@material-ui/icons/FormatItalic';
import UnderlinedIcon from '@material-ui/icons/FormatUnderlined';
import StrikethroughIcon from '@material-ui/icons/StrikethroughS';
import ColorTextIcon from '@material-ui/icons/FormatColorText';
import ColorFillIcon from '@material-ui/icons/FormatColorFill';
import AlignLeftIcon from '@material-ui/icons/FormatAlignLeft';
import AlignCenterIcon from '@material-ui/icons/FormatAlignCenter';
import AlignRightIcon from '@material-ui/icons/FormatAlignRight';
import AlignJustifyIcon from '@material-ui/icons/FormatAlignJustify';
import ListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import ListNumberedIcon from '@material-ui/icons/FormatListNumbered';
import InsertPhotoIcon from '@material-ui/icons/InsertPhoto';
import RedoIcon from '@material-ui/icons/Redo';
import UndoIcon from '@material-ui/icons/Undo';
import SuperscriptIcon from './SuperscriptIcon';
import SubscriptIcon from './SubscriptIcon';
import VideocamIcon from '@material-ui/icons/Videocam';

function toData(block) {
  return block.getData();
}

const SUPERSCRIPT = ['SUPERSCRIPT', 'SUBSCRIPT'];
const SUBSCRIPT = ['SUBSCRIPT', 'SUPERSCRIPT'];

function isFontSizeStyle(style) {
  return style.substring(0, 9) === 'FONT_SIZE';
}

function applyFontSize(applyInlineStyle, fontSize) {
  applyInlineStyle('FONT_SIZE', fontSize + 'px');
}

function isFontFamilyStyle(style) {
  return style.substring(0, 11) === 'FONT_FAMILY';
}

function applyFontFamily(applyInlineStyle, fontFamily) {
  applyInlineStyle('FONT_FAMILY', fontFamily);
}

function leftAligned(data) { return data.get('textAlign') === 'left'; }
function centerAligned(data) { return data.get('textAlign') === 'center'; }
function rightAligned(data) { return data.get('textAlign') === 'rigth'; }
function justifyAligned(data) { return data.get('textAlign') === 'justify'; }

export class Toolbar extends PureComponent {

  constructor(props) {
    super(props);

    this.applyInlineStyle = this.applyInlineStyle.bind(this);
    this.toggleBlockType = this.toggleBlockType.bind(this);
    this.changeBlockData = this.changeBlockData.bind(this);
    this.insertImage = this.insertImage.bind(this);
    this.insertVideo = this.insertVideo.bind(this);
    this.undo = this.undo.bind(this);
    this.redo = this.redo.bind(this);
  }

  applyInlineStyle(style, value) {
    const { editorState, onChange } = this.props;
    const isSwitchableStyle = style instanceof Array;
    let newState;
    if (!isSwitchableStyle && !value) newState = RichUtils.toggleInlineStyle(editorState, style);
    else {
      const currentContent = editorState.getCurrentContent();
      const selection = editorState.getSelection();

      const removableStyle = this.inlineStyles.find(isSwitchableStyle
        ? currentStyle => style.includes(currentStyle)
        : currentStyle => currentStyle.substring(0, style.length) === style
      );

      newState = removableStyle
        && Modifier.removeInlineStyle(currentContent, selection, removableStyle)
        || currentContent
      |> isSwitchableStyle 
        && (removableStyle === style[0] && # || Modifier.applyInlineStyle(#, selection, style[0]))
        || Modifier.applyInlineStyle(#, selection, style + '=' + value)
      |> EditorState.push(editorState, #, 'change-inline-style')
    }
    onChange(newState);
  }

  toggleBlockType(type) {
    const { editorState, onChange } = this.props;
    RichUtils.toggleBlockType(editorState, type)
    |> onChange;
  }

  changeBlockData(data) {
    const { editorState, onChange } = this.props;
    Modifier.mergeBlockData(editorState.getCurrentContent(), editorState.getSelection(), new Immutable.Map(data))
    |> EditorState.push(editorState, #, 'change-block-data')
    |> onChange;
  }

  undo() {
    const { editorState, onChange } = this.props;
    EditorState.undo(editorState)
    |> onChange(#);
  }
  redo() {
    const { editorState, onChange } = this.props;
    EditorState.redo(editorState)
    |> onChange(#);
  }

  insertImage(event) {
    const { editorState, onChange } = this.props;
    const newEditorState = handleDroppedFiles(null, event.target.files, editorState);
    if (newEditorState) onChange(newEditorState);
  }

  // test
  insertVideo(url) {
 
    const { editorState, onChange } = this.props;
    const src = url;

    editorState.getCurrentContent()
    
    |> #.createEntity('VIDEO', 'IMMUTABLE', {
        src,
        symmetric: true
      })
  
    |> Modifier.insertText(
        #, editorState.getSelection(),
        '\u{1F4F7}', null, #.getLastCreatedEntityKey()
      )
  
    |> EditorState.push(editorState, #, 'insert-characters')

    |> onChange(#);
   }
  
  render() {
    const { classes, editorState } = this.props;
    const {  applyInlineStyle, toggleBlockType, changeBlockData } = this;

    const undoStack = editorState.getUndoStack();
    const redoStack = editorState.getRedoStack();

    const inlineStyles = editorState.getCurrentInlineStyle();
    this.inlineStyles = inlineStyles.toArray();
    const selectedBlocks = getSelectedBlocks(editorState);
    const blockType = getOverallBlocksType(selectedBlocks);
    const blocksData = selectedBlocks.map(toData);

    const fontSize = this.inlineStyles.find(isFontSizeStyle)
    |> # === undefined && 16 || #.split('=')[1].slice(0, -2);
    const fontFamily = this.inlineStyles.find(isFontFamilyStyle)
    |> # === undefined && 'Roboto' || #.split('=')[1];

    return <div className={classes.root}>

      <ToolbarContext.Provider value={{ applyInlineStyle, toggleBlockType, changeBlockData }}>

        <InlineStyleButton active={inlineStyles.has('BOLD')} value="BOLD"><BoldIcon /></InlineStyleButton>
        <InlineStyleButton active={inlineStyles.has('ITALIC')} value="ITALIC"><ItalicIcon /></InlineStyleButton>
        <InlineStyleButton active={inlineStyles.has('UNDERLINE')} value="UNDERLINE"><UnderlinedIcon /></InlineStyleButton>
        <InlineStyleButton active={inlineStyles.has('STRIKETHROUGH')} value="STRIKETHROUGH"><StrikethroughIcon /></InlineStyleButton>
        <InlineStyleButton active={inlineStyles.has('SUPERSCRIPT')} value={SUPERSCRIPT}><SuperscriptIcon /></InlineStyleButton>
        <InlineStyleButton active={inlineStyles.has('SUBSCRIPT')} value={SUBSCRIPT}><SubscriptIcon /></InlineStyleButton>

        <SelectPicker selectClass={classes.fontSizePicker} onPickItem={applyFontSize} value={fontSize}>{FontSizeList}</SelectPicker>
        <SelectPicker selectClass={classes.fontFamilyPicker} onPickItem={applyFontFamily} value={fontFamily}>{FontFamilyList}</SelectPicker>

        <ColorPickerButton value="TEXT_COLOR"><ColorTextIcon /></ColorPickerButton>
        <ColorPickerButton value="FILL_COLOR"><ColorFillIcon /></ColorPickerButton>

        <BlockTypeButton active={blockType === 'unordered-list-item'} value="unordered-list-item"><ListBulletedIcon /></BlockTypeButton>
        <BlockTypeButton active={blockType === 'ordered-list-item'} value="ordered-list-item"><ListNumberedIcon /></BlockTypeButton>

        <BlockDataButton active={blocksData.every(leftAligned)} name="textAlign" value="left"><AlignLeftIcon /></BlockDataButton>
        <BlockDataButton active={blocksData.every(centerAligned)} name="textAlign" value="center"><AlignCenterIcon /></BlockDataButton>
        <BlockDataButton active={blocksData.every(rightAligned)} name="textAlign" value="right"><AlignRightIcon /></BlockDataButton>
        <BlockDataButton active={blocksData.every(justifyAligned)} name="textAlign" value="justify"><AlignJustifyIcon /></BlockDataButton>

        <FileDialogButton onChange={this.insertImage}><InsertPhotoIcon /></FileDialogButton>

        {/** test */}
        <URLPickerButton action={this.insertVideo}><VideocamIcon /></URLPickerButton>

        <ToolbarButton disabled={undoStack.size === 0} onClick={this.undo}><UndoIcon /></ToolbarButton>
        <ToolbarButton disabled={redoStack.size === 0} onClick={this.redo}><RedoIcon /></ToolbarButton>
      
      </ToolbarContext.Provider>
    </div>;
  }
}

export default withStyles(styles)(Toolbar);