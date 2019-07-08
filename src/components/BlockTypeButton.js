import React, { PureComponent } from 'react';
import Button from '@material-ui/core/Button';
import { withStyles } from "@material-ui/core/styles";
import { ToolbarContext } from './ToolbarContext';
import { ToolbarButton as styles } from './styles';

export class BlockTypeButton extends PureComponent {
  static contextType = ToolbarContext;

  constructor(props) {
    super(props);
    this.toggleBlockType = this.toggleBlockType.bind(this);
  }

  toggleBlockType(event) {
    event.preventDefault();
    this.context.toggleBlockType(this.props.value);
  }
  
  render() {
    const { classes, value, children } = this.props;

    return <Button className={classes.root}
      color={this.context.blockType === value ? 'primary' : 'default'}
      onMouseDown={this.toggleBlockType}
    >
      {children}
    </Button>;
  }
}

export default withStyles(styles)(BlockTypeButton);