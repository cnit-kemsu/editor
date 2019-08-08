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

function isFontFamilyStyle(style) {
  return style.substring(0, 11) === 'FONT_FAMILY';
}

const fontFamilyArray = [
  'Roboto',
  'Open Sans',
  'Arial',
  //'Helvetica',
  'Times New Roman',
  'Courier New',
  'Verdana',
  'Georgia',
  'Garamond',
  'Comic Sans MS',
  'Trebuchet MS',
  //'Arial Black',
  //'Impact'
];

export class FontFamilyPicker extends PureComponent {
  static contextType = ToolbarContext;

  constructor(props) {
    super(props);

    this.state = {
      target: null,
      open: false
    };

    this.canOpen = true;
    
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.applyFontFamily = this.applyFontFamily.bind(this);

    this.popper = React.createRef();
    this.button = React.createRef();

    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  open(event) {
    event.preventDefault();
    if (this.canOpen && !this.state.open) {
      this.setState({
        target: event.currentTarget,
        open: true
      });
      document.addEventListener('mousedown', this.handleClickOutside);
    }
    this.canOpen = true;
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
    if (this.button.current.contains(event.target)) this.canOpen = false;
    if (!this.popper.current.contains(event.target)) this.close();
  }

  applyFontFamily(fontFamily) {
    this.close();
    this.context.applyInlineStyleWithValue('FONT_FAMILY', fontFamily instanceof Array ? fontFamily.join(', ') : fontFamily);
  }
  
  render() {
    const { classes } = this.props;
    const { target, open } = this.state;
    const { _styles } = this.context;
    const value = _styles.find(isFontFamilyStyle)
    |> # === undefined && 'Roboto' || #.substring(12, #.length).split(',')[0];

    return <>

      <Select ref={this.button} className={classes.select} style={{ minWidth: '170px' }} SelectDisplayProps={{ onMouseDown: preventDefault, onClick: this.open }} value={value}>
        <MenuItem value={value}>{value}</MenuItem>
      </Select>

      <Popper ref={this.popper} open={open} anchorEl={target}>
        <Paper>
          <MenuList>
            {fontFamilyArray.map(
              (fontFamily, index) => <MenuItem key={index} className={classes.menuItem}
                onMouseDown={preventDefault}
                onClick={event => {
                  //event.preventDefault();
                  this.applyFontFamily(fontFamily);
                }}
              >
                {fontFamily instanceof Array ? fontFamily[0] : fontFamily}
              </MenuItem>
            )}
          </MenuList>
        </Paper>
      </Popper>

    </>;
  }
}

export default withStyles(styles)(FontFamilyPicker);