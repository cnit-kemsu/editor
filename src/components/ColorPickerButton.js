import React, { PureComponent } from 'react';
import Button from '@material-ui/core/Button';
import { withStyles } from "@material-ui/core/styles";
import { preventDefault } from '../lib/preventDefault';
import { ToolbarContext } from './ToolbarContext';
import ColorPalette from './ColorPalette';
import { Picker } from './Picker';
import { ToolbarButton as styles } from './styles';

export class ColorPickerButton extends PureComponent {
  static contextType = ToolbarContext;

  constructor(props) {
    super(props);
   
    this.open = this.open.bind(this);
    this.applyColor = this.applyColor.bind(this);

    this.picker = React.createRef();
    this.button = React.createRef();
  }

  open(event) {
    this.picker.current.open(event);
  }

  applyColor(color) {
    this.picker.current.close();
    this.context.applyInlineStyle(this.props.value, color);
  }
  
  render() {
    const { classes, children } = this.props;

    return <>
      <Button ref={this.button}
        className={classes.root}
        color="default"
        onMouseDown={preventDefault}
        onClick={this.open}
      >
        {children}
      </Button>

      <Picker ref={this.picker} control={this.button}>
        <ColorPalette onPickColor={this.applyColor} />
      </Picker>
    </>;
  }
}

export default withStyles(styles)(ColorPickerButton);