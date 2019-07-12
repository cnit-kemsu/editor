import React, { PureComponent } from 'react';
import Immutable from 'immutable';
import { RichUtils, Modifier, EditorState } from 'draft-js';
import { withStyles } from "@material-ui/core/styles";

import BoldIcon from '@material-ui/icons/FormatBold';
import ItalicIcon from '@material-ui/icons/FormatItalic';
import UnderlinedIcon from '@material-ui/icons/FormatUnderlined';
//import ColorFillIcon from '@material-ui/icons/FormatColorFill';
//import ColorTextIcon from '@material-ui/icons/FormatColorText';
import AlignLeftIcon from '@material-ui/icons/FormatAlignLeft';
import AlignCenterIcon from '@material-ui/icons/FormatAlignCenter';
import AlignRightIcon from '@material-ui/icons/FormatAlignRight';
import AlignJustifyIcon from '@material-ui/icons/FormatAlignJustify';
import ListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import ListNumberedIcon from '@material-ui/icons/FormatListNumbered';
import InsertPhotoIcon from '@material-ui/icons/InsertPhoto';
import RedoIcon from '@material-ui/icons/Redo';
import UndoIcon from '@material-ui/icons/Undo';

import { getSelectedBlocks } from '../lib/getSelectedBlocks';
import { getBlockType } from '../lib/getBlockType';
import { ToolbarContext } from './ToolbarContext';
import InlineStyleButton from './InlineStyleButton';
import BlockTypeButton from './BlockTypeButton';
import BlockDataButton from './BlockDataButton';

import { Toolbar as styles } from './styles';

function toData(block) {
  return block.getData();
}

export class Toolbar extends PureComponent {

  constructor(props) {
    super(props);

    this.toggleInlineStyle = this.toggleInlineStyle.bind(this);
    this.applyInlineStyleWithData = this.applyInlineStyleWithData.bind(this);
    this.toggleBlockType = this.toggleBlockType.bind(this);
    this.mergeBlockData = this.mergeBlockData.bind(this);
  }

  toggleInlineStyle(style) {
    const { editorState, onChange } = this.props;
    RichUtils.toggleInlineStyle(editorState, style)
    |> onChange;
  }

  applyInlineStyleWithData(style, data) {
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
    |> Modifier.applyInlineStyle(#, selection, style + data)
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
  
  render() {
    const { classes, editorState } = this.props;
    const { toggleInlineStyle, applyInlineStyleWithData, toggleBlockType, mergeBlockData } = this;

    const inlineStyles = editorState.getCurrentInlineStyle();
    const selectedBlocks = getSelectedBlocks(editorState);
    const blockType = getBlockType(selectedBlocks);
    const blocksData = selectedBlocks.map(toData);

    return <div className={classes.root}>

      <ToolbarContext.Provider value={{
        toggleInlineStyle, applyInlineStyleWithData, toggleBlockType, mergeBlockData,
        inlineStyles, blockType, blocksData
      }}>

        <InlineStyleButton value="BOLD"><BoldIcon /></InlineStyleButton>
        <InlineStyleButton value="ITALIC"><ItalicIcon /></InlineStyleButton>
        <InlineStyleButton value="UNDERLINE"><UnderlinedIcon /></InlineStyleButton>

        <BlockTypeButton value="unordered-list-item"><ListBulletedIcon /></BlockTypeButton>
        <BlockTypeButton value="ordered-list-item"><ListNumberedIcon /></BlockTypeButton>

        <BlockDataButton name="textAlign" value="left"><AlignLeftIcon /></BlockDataButton>
        <BlockDataButton name="textAlign" value="center"><AlignCenterIcon /></BlockDataButton>
        <BlockDataButton name="textAlign" value="right"><AlignRightIcon /></BlockDataButton>
        <BlockDataButton name="textAlign" value="justify"><AlignJustifyIcon /></BlockDataButton>

        <InlineStyleWithDataButton value="COLOR" data="red"><BoldIcon /></InlineStyleWithDataButton>
        <InlineStyleWithDataButton value="COLOR" data="green"><BoldIcon /></InlineStyleWithDataButton>
      
      </ToolbarContext.Provider>
    </div>;
  }
}

export default withStyles(styles)(Toolbar);

import Button from '@material-ui/core/Button';

class InlineStyleWithDataButton extends PureComponent {
  static contextType = ToolbarContext;

  constructor(props) {
    super(props);
    this.applyInlineStyle = this.applyInlineStyle.bind(this);
  }

  applyInlineStyle(event) {
    event.preventDefault();
    this.context.applyInlineStyleWithData(this.props.value, this.props.data);
  }
  
  render() {
    const { children } = this.props;

    return <Button 
      color="default"
      onMouseDown={this.applyInlineStyle}
    >
      {children}
    </Button>;
  }
}