import React, { PureComponent } from 'react';
import Button from '@material-ui/core/Button';
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import { preventDefault } from '../lib/preventDefault';
import { ToolbarContext } from './ToolbarContext';
import { Picker } from './Picker';
import { ToolbarButton as styles } from './styles';

export class URLPickerButton extends PureComponent {
  static contextType = ToolbarContext;

  constructor(props) {
    super(props);

    this.state = {
      value: ''
    };
   
    this.open = this.open.bind(this);
    this.onClick = this.onClick.bind(this);
    this.onValueChange = this.onValueChange.bind(this);

    this.picker = React.createRef();
    this.button = React.createRef();
  }

  open(event) {
    this.picker.current.open(event);
  }

  onClick() {
    this.picker.current.close();
    if (this.state.value) this.props?.action?.(this.state.value);
  }

  onValueChange({ currentTarget: { value } }) {
    this.setState({ value });
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
        <div style={{
          width: 'fit-content',
          minWidth: '400px',
          padding: '16px 8px 8px 16px',
          backgroundColor: '#f5f5f5'
        }}>
          <TextField style={{ width: '100%', marginBottom: '8px' }} label="URL видео" value={this.state.value} onChange={this.onValueChange} />
          <Button color="primary" variant="contained" onClick={this.onClick}>Добавить</Button>
        </div>
      </Picker>
    </>;
  }
}

export default withStyles(styles)(URLPickerButton);