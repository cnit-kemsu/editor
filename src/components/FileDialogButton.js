import React, { PureComponent } from 'react';
import Button from '@material-ui/core/Button';
import { withStyles } from "@material-ui/core/styles";
import { ToolbarContext } from './ToolbarContext';
import { ToolbarButton as styles } from './styles';

export class FileDialogButton extends PureComponent {
  static contextType = ToolbarContext;

  constructor(props) {
    super(props);

    this.fileDialog = document.createElement('input');
    this.fileDialog.type = 'file';
    this.fileDialog.onchange = this.props.onChange;

    this.open = this.open.bind(this);
  }

  open(event) {
    event.preventDefault();
    this.fileDialog.click();
  }
  
  render() {
    const { classes, children } = this.props;

    return <Button className={classes.root}
      onMouseDown={this.open}
    >
      {children}
    </Button>;
  }
}

export default withStyles(styles)(FileDialogButton);