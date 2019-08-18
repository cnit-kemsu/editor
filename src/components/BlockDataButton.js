import React, { PureComponent } from 'react';
import Button from '@material-ui/core/Button';
import { withStyles } from "@material-ui/core/styles";
import { ToolbarContext } from './ToolbarContext';
import { ToolbarButton as styles } from './styles';

export class BlockDataButton extends PureComponent {
  static contextType = ToolbarContext;

  constructor(props) {
    super(props);
    this.changeBlockData = this.changeBlockData.bind(this);
  }

  changeBlockData(event) {
    event.preventDefault();
    const { name, value, active } = this.props;
    this.context.changeBlockData({ [name]: active ? null : value });
  }
  
  render() {
    const { classes, active, children } = this.props;

    return <Button className={classes.root}
      color={active ? 'primary' : 'default'}
      onMouseDown={this.changeBlockData}
    >
      {children}
    </Button>;
  }
}

export default withStyles(styles)(BlockDataButton);