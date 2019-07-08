import React, { PureComponent } from 'react';
import Button from '@material-ui/core/Button';
import { withStyles } from "@material-ui/core/styles";
import { ToolbarContext } from './ToolbarContext';
import { ToolbarButton as styles } from './styles';

export class BlockDataButton extends PureComponent {
  static contextType = ToolbarContext;

  constructor(props) {
    super(props);
    this.toggleBlockData = this.toggleBlockData.bind(this);
    this.equalsToCurrentValue = this.equalsToCurrentValue.bind(this);
  }

  equalsToCurrentValue(data) {
    const { name, value } = this.props;
    return data.get(name) === value;
  }

  toggleBlockData(event) {
    event.preventDefault();
    const { name, value } = this.props;
    this.context.mergeBlockData({ [name]: this.isActive ? null : value });
  }
  
  render() {
    const { classes, children } = this.props;
    this.isActive = this.context.blocksData.every(this.equalsToCurrentValue);

    return <Button className={classes.root}
      color={this.isActive ? 'primary' : 'default'}
      onMouseDown={this.toggleBlockData}
    >
      {children}
    </Button>;
  }
}

export default withStyles(styles)(BlockDataButton);