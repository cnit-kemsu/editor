import React, { PureComponent } from 'react';
import Popper from '@material-ui/core/Popper';
import Select from '@material-ui/core/Select';
import Paper from '@material-ui/core/Paper';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from "@material-ui/core/styles";
import { ToolbarContext } from './ToolbarContext';
import { Picker as styles } from './styles';

function preventDefault(event) {
  event.preventDefault();
}

function isFontSizeStyle(style) {
  return style.substring(0, 9) === 'FONT_SIZE';
}

const fontSizeArray = [
  8, 9, 10, 11, 12,
  14, 16, 18, 20, 22, 24, 26, 28,
  36, 48, 72
];

export class FontSizePicker extends PureComponent {
  static contextType = ToolbarContext;

  constructor(props) {
    super(props);

    this.state = {
      target: null,
      open: false
    };
    
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.applyFontSize = this.applyFontSize.bind(this);

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

  applyFontSize(fontSize) {
    this.close();
    this.context.applyInlineStyleWithValue('FONT_SIZE', fontSize);
  }
  
  render() {
    const { classes } = this.props;
    const { target, open } = this.state;
    const { _styles } = this.context;
    const value = _styles.find(isFontSizeStyle)
    |> # === undefined && 16 || #.substring(10, #.length);

    return <>

      <Select className={classes.select} SelectDisplayProps={{ onMouseDown: preventDefault, onClick: this.open }} value={value}>
        <MenuItem value={value}>{value}</MenuItem>
      </Select>

      <Popper ref={this.popper} open={open} anchorEl={target}>
        <Paper>
          <MenuList>
            {fontSizeArray.map(
              (fontSize, index) => <MenuItem key={index}
                onMouseDown={preventDefault}
                onClick={event => {
                  //event.preventDefault();
                  this.applyFontSize(fontSize);
                }}
              >
                {fontSize}
              </MenuItem>
            )}
          </MenuList>
        </Paper>
      </Popper>

    </>;
  }
}

export default withStyles(styles)(FontSizePicker);