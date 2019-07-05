import React, { PureComponent } from 'react';
import Button from '@material-ui/core/Button';
import { withStyles } from "@material-ui/core/styles";

import BoldIcon from '@material-ui/icons/FormatBold';
import ItalicIcon from '@material-ui/icons/FormatItalic';
import UnderlinedIcon from '@material-ui/icons/FormatUnderlined';
import ColorFillIcon from '@material-ui/icons/FormatColorFill';
import ColorTextIcon from '@material-ui/icons/FormatColorText';
import AlignLeftIcon from '@material-ui/icons/FormatAlignLeft';
import AlignCenterIcon from '@material-ui/icons/FormatAlignCenter';
import AlignRightIcon from '@material-ui/icons/FormatAlignRight';
import AlignJustifyIcon from '@material-ui/icons/FormatAlignJustify';
import ListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import ListNumberedIcon from '@material-ui/icons/FormatListNumbered';
import InsertPhotoIcon from '@material-ui/icons/InsertPhoto';
import RedoIcon from '@material-ui/icons/Redo';
import UndoIcon from '@material-ui/icons/Undo';

import { Toolbar as styles } from './styles';

function color(isTrue) {
  return isTrue ? 'primary' : 'default';
}

export class Toolbar extends PureComponent {

  constructor(props) {
    super(props);

  }

  render() {
    const { classes, editorState } = this.props;
    const inlineStyles = editorState.getCurrentInlineStyle();
    const isBold = inlineStyles.has('BOLD');
    const isItalic = inlineStyles.has('ITALIC');
    const isUnderlined = inlineStyles.has('UNDERLINE');

    // const is = inlineStyles.has('') ? 'primary' : 'default';

    // const is = inlineStyles.has('') ? 'primary' : 'default';
    // const is = inlineStyles.has('') ? 'primary' : 'default';
    // const is = inlineStyles.has('') ? 'primary' : 'default';
    // const is = inlineStyles.has('') ? 'primary' : 'default';

    return <div>
      <Button className={classes.button} color={color(isBold)}><BoldIcon /></Button>
      <Button className={classes.button} color={color(isItalic)}><ItalicIcon /></Button>
      <Button className={classes.button} color={color(isUnderlined)}><UnderlinedIcon /></Button>
    </div>;
  }
}

export default withStyles(styles)(Toolbar);