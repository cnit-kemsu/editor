import React, { PureComponent } from 'react';
import Button from '@material-ui/core/Button';
import Popper from '@material-ui/core/Popper';
import { withStyles } from "@material-ui/core/styles";
import { HSLToRGB } from '../lib/HSLToRGB';
import { ToolbarContext } from './ToolbarContext';
import ColorPalette from './ColorPalette';
import { ToolbarButton as styles } from './styles';

function preventDefault(event) {
  event.preventDefault();
}

export class ColorPickerButton extends PureComponent {
  static contextType = ToolbarContext;

  constructor(props) {
    super(props);

    this.state = {
      target: null,
      open: false
    };
    
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.applyColor = this.applyColor.bind(this);

    this.popper = React.createRef();
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  open(event) {
    event.preventDefault();
    if (!this.state.open) {
      this.setState({
        target: event.currentTarget,
        open: true
      });
      document.addEventListener('mousedown', this.handleClickOutside);
    }
  }
  close() {
    this.onClose();
    this.setState({ target: null, open: false });
  }

  componentWillUnmount() {
    if (this.state.open) this.onClose();
  }
  onClose() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }
  handleClickOutside(event) {
    if (!this.popper.current.contains(event.target)) this.close();
  }

  applyColor(color) {
    this.close();
    const [r, g, b] = HSLToRGB(...color);
    this.context.applyInlineStyleWithValue(this.props.value, `rgb(${r}, ${g}, ${b})`);
  }
  
  render() {
    const { classes, children } = this.props;
    const { target, open } = this.state;

    return <>

      <Button className={classes.root} color="default"
        onMouseDown={preventDefault} onClick={this.open}
      >
        {children}
      </Button>

      <Popper ref={this.popper} open={open} anchorEl={target}>
        <ColorPalette onPickColor={this.applyColor} />
      </Popper>
    </>;
  }
}

export default withStyles(styles)(ColorPickerButton);