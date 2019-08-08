import React, { PureComponent } from 'react';
import Button from '@material-ui/core/Button';
import { withStyles } from "@material-ui/core/styles";
import { ToolbarContext } from './ToolbarContext';
import { ToolbarButton as styles } from './styles';

export class ToolbarButton extends PureComponent {
  static contextType = ToolbarContext;

  constructor(props) {
    super(props);
    this.onMouseDown = this.onMouseDown.bind(this);
  }

  onMouseDown(event) {
    event.preventDefault();
    this.props.onClick?.(event);
  }
 
  render() {
    const { classes, children, disabled } = this.props;

    return <Button disabled={disabled} className={classes.root} onMouseDown={this.onMouseDown}>
      {children}
    </Button>;
  }
}

export default withStyles(styles)(ToolbarButton);