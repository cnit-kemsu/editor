import React, { PureComponent } from 'react';
import Select from '@material-ui/core/Select';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from "@material-ui/core/styles";
import { preventDefault } from '../internals/preventDefault';
import { ToolbarContext } from './ToolbarContext';
import { Picker } from './Picker';
import { SelectPicker as styles } from './styles';

export class SelectPicker extends PureComponent {
  static contextType = ToolbarContext;

  constructor(props) {
    super(props);

    this.open = this.open.bind(this);
    this.onPickItem = this.onPickItem.bind(this);

    this.picker = React.createRef();
    this.select = React.createRef();

    this.childProps = {
      onPickItem: this.onPickItem
    };
    this.selectProps = {
      onMouseDown: preventDefault,
      onClick: this.open
    };
  }

  open(event) {
    this.picker.current.open(event);
  }

  onPickItem(value) {
    this.picker.current.close();
    this.props.onPickItem?.(this.context.applyInlineStyle, value);
  }
  
  render() {
    const { classes, selectClass, children, value } = this.props;

    return <>

      <Select ref={this.select}
        className={classes.select + ' ' + selectClass}
        SelectDisplayProps={this.selectProps}
        value={value}
      >
        <MenuItem value={value}>{value}</MenuItem>
      </Select>

      <Picker ref={this.picker} control={this.select}>
        <Paper>
          {React.createElement(children, this.childProps)}
        </Paper>
      </Picker>

    </>;
  }
}

export default withStyles(styles)(SelectPicker);