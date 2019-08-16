import React, { PureComponent } from 'react';
import Immutable from 'immutable';
import { RichUtils, Modifier, EditorState } from 'draft-js';
import SvgIcon from '@material-ui/core/SvgIcon';
import { withStyles } from "@material-ui/core/styles";
import { handleDroppedFiles } from '../lib/handleDroppedFiles';

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

import { getSelectionProps } from '../lib/getSelectionProps';
import { getSelectedBlocks } from '../lib/getSelectedBlocks';
import { getOverallBlocksType } from '../lib/getOverallBlocksType';
import { ToolbarContext } from './ToolbarContext';
import InlineStyleButton from './InlineStyleButton';
import BlockTypeButton from './BlockTypeButton';
import BlockDataButton from './BlockDataButton';
import ColorPickerButton from './ColorPickerButton';
import FontSizePicker from './FontSizePicker';
import FontFamilyPicker from './FontFamilyPicker';
import FileDialogButton from './FileDialogButton';
import ToolbarButton from './ToolbarButton';

import { Toolbar as styles } from './styles';

function SuperscriptIcon() {
  return <SvgIcon>
    <path d="M16,7.41L11.41,12L16,16.59L14.59,18L10,13.41L5.41,18L4,16.59L8.59,12L4,7.41L5.41,6L10,10.59L14.59,6L16,7.41M21.85,9H16.97V8L17.86,7.18C18.62,6.54 19.18,6 19.56,5.55C19.93,5.11 20.12,4.7 20.13,4.32C20.14,4.04 20.05,3.8 19.86,3.62C19.68,3.43 19.39,3.34 19,3.33C18.69,3.34 18.42,3.4 18.16,3.5L17.5,3.89L17.05,2.72C17.32,2.5 17.64,2.33 18.03,2.19C18.42,2.05 18.85,2 19.32,2C20.1,2 20.7,2.2 21.1,2.61C21.5,3 21.72,3.54 21.72,4.18C21.71,4.74 21.53,5.26 21.18,5.73C20.84,6.21 20.42,6.66 19.91,7.09L19.27,7.61V7.63H21.85V9Z" />
  </SvgIcon>;
}
SuperscriptIcon = React.memo(SuperscriptIcon);

function SubscriptIcon() {
  return <SvgIcon>
    <path d="M16,7.41L11.41,12L16,16.59L14.59,18L10,13.41L5.41,18L4,16.59L8.59,12L4,7.41L5.41,6L10,10.59L14.59,6L16,7.41M21.85,21.03H16.97V20.03L17.86,19.23C18.62,18.58 19.18,18.04 19.56,17.6C19.93,17.16 20.12,16.75 20.13,16.36C20.14,16.08 20.05,15.85 19.86,15.66C19.68,15.5 19.39,15.38 19,15.38C18.69,15.38 18.42,15.44 18.16,15.56L17.5,15.94L17.05,14.77C17.32,14.56 17.64,14.38 18.03,14.24C18.42,14.1 18.85,14 19.32,14C20.1,14.04 20.7,14.25 21.1,14.66C21.5,15.07 21.72,15.59 21.72,16.23C21.71,16.79 21.53,17.31 21.18,17.78C20.84,18.25 20.42,18.7 19.91,19.14L19.27,19.66V19.68H21.85V21.03Z" />
  </SvgIcon>;
}
SubscriptIcon = React.memo(SubscriptIcon);

function toData(block) {
  return block.getData();
}

export class Toolbar extends PureComponent {

  constructor(props) {
    super(props);

    this.toggleInlineStyle = this.toggleInlineStyle.bind(this);
    this.applyInlineStyleWithValue = this.applyInlineStyleWithValue.bind(this);
    this.toggleInlineStyleArray = this.toggleInlineStyleArray.bind(this);
    this.toggleBlockType = this.toggleBlockType.bind(this);
    this.mergeBlockData = this.mergeBlockData.bind(this);
    this.insertImage = this.insertImage.bind(this);
    this.undo = this.undo.bind(this);
    this.redo = this.redo.bind(this);
  }

  toggleInlineStyle(style) {
    const { editorState, onChange } = this.props;
    RichUtils.toggleInlineStyle(editorState, style)
    |> onChange;
  }

  applyInlineStyleWithValue(style, value) {
    const { editorState, onChange } = this.props;
    const content = editorState.getCurrentContent();
    const selection = editorState.getSelection();
    const inlineStyles = editorState.getCurrentInlineStyle().toArray();

    const removableStyle = inlineStyles.find(
      current => current.substring(0, style.length) === style
    );
    removableStyle
      && Modifier.removeInlineStyle(content, selection, removableStyle)
      || content
    |> Modifier.applyInlineStyle(#, selection, style + '=' + value)
    |> EditorState.push(editorState, #, 'change-inline-style')
    |> onChange;
  }

  toggleInlineStyleArray(styleArray) {
    const { editorState, onChange } = this.props;
    const content = editorState.getCurrentContent();
    const selection = editorState.getSelection();
    const inlineStyles = editorState.getCurrentInlineStyle().toArray();

    const removableStyle = inlineStyles.find(
      current => styleArray.includes(current)
    );
    removableStyle
      && Modifier.removeInlineStyle(content, selection, removableStyle)
      || content
    |> removableStyle === styleArray[0] && # || Modifier.applyInlineStyle(#, selection, styleArray[0])
    |> EditorState.push(editorState, #, 'change-inline-style')
    |> onChange;
  }

  toggleBlockType(type) {
    const { editorState, onChange } = this.props;
    RichUtils.toggleBlockType(editorState, type)
    |> onChange;
  }

  mergeBlockData(data) {
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
  
  render() {
    const { classes, editorState } = this.props;
    const { toggleInlineStyle, applyInlineStyleWithValue, toggleInlineStyleArray, toggleBlockType, mergeBlockData } = this;

    const undoStack = editorState.getUndoStack();
    const redoStack = editorState.getRedoStack();

    const props = getSelectionProps(editorState.getCurrentContent(), editorState.getSelection());
    const inlineStyles = editorState.getCurrentInlineStyle();
    const _styles = inlineStyles.toArray();
    const selectedBlocks = getSelectedBlocks(editorState);
    const blockType = getOverallBlocksType(selectedBlocks);
    const blocksData = selectedBlocks.map(toData);

    return <div className={classes.root}>

      <ToolbarContext.Provider value={{
        toggleInlineStyle, applyInlineStyleWithValue, toggleInlineStyleArray, toggleBlockType, mergeBlockData,
        inlineStyles, _styles, blockType, blocksData
      }}>

        <InlineStyleButton value="BOLD"><BoldIcon /></InlineStyleButton>
        <InlineStyleButton value="ITALIC"><ItalicIcon /></InlineStyleButton>
        <InlineStyleButton value="UNDERLINE"><UnderlinedIcon /></InlineStyleButton>
        <InlineStyleButton value="STRIKETHROUGH"><StrikethroughIcon /></InlineStyleButton>
        <InlineStyleButton value={['SUPERSCRIPT', 'SUBSCRIPT']}><SuperscriptIcon /></InlineStyleButton>
        <InlineStyleButton value={['SUBSCRIPT', 'SUPERSCRIPT']}><SubscriptIcon /></InlineStyleButton>

        <FontSizePicker />
        <FontFamilyPicker />

        <ColorPickerButton value="TEXT_COLOR"><ColorTextIcon /></ColorPickerButton>
        <ColorPickerButton value="FILL_COLOR"><ColorFillIcon /></ColorPickerButton>

        <BlockTypeButton value="unordered-list-item"><ListBulletedIcon /></BlockTypeButton>
        <BlockTypeButton value="ordered-list-item"><ListNumberedIcon /></BlockTypeButton>

        <BlockDataButton name="textAlign" value="left"><AlignLeftIcon /></BlockDataButton>
        <BlockDataButton name="textAlign" value="center"><AlignCenterIcon /></BlockDataButton>
        <BlockDataButton name="textAlign" value="right"><AlignRightIcon /></BlockDataButton>
        <BlockDataButton name="textAlign" value="justify"><AlignJustifyIcon /></BlockDataButton>

        <FileDialogButton onChange={this.insertImage}><InsertPhotoIcon /></FileDialogButton>

        <ToolbarButton disabled={undoStack.size === 0} onClick={this.undo}><UndoIcon /></ToolbarButton>
        <ToolbarButton disabled={redoStack.size === 0} onClick={this.redo}><RedoIcon /></ToolbarButton>
      
      </ToolbarContext.Provider>
    </div>;
  }
}

export default withStyles(styles)(Toolbar);