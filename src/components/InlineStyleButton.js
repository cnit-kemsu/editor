import React, { PureComponent } from 'react';
import Button from '@material-ui/core/Button';
import { withStyles } from "@material-ui/core/styles";
import { ToolbarContext } from './ToolbarContext';
import { ToolbarButton as styles } from './styles';

export class InlineStyleButton extends PureComponent {
  static contextType = ToolbarContext;

  constructor(props) {
    super(props);

    const [styleName, styleValue] = this.props.value.split('=');
    if (styleValue !== undefined) this.applyInlineStyle = () => this.context.applyInlineStyleWithValue(styleName, styleValue);
    else this.applyInlineStyle = () => this.context.toggleInlineStyle(styleName, styleValue);

    this.toggleInlineStyle = this.toggleInlineStyle.bind(this);
  }

  toggleInlineStyle(event) {
    event.preventDefault();
    this.applyInlineStyle();
  }
  
  render() {
    const { classes, value, children } = this.props;

    return <Button className={classes.root}
      color={this.context.inlineStyles.has(value) ? 'primary' : 'default'}
      onMouseDown={this.toggleInlineStyle}
    >
      {children}
    </Button>;
  }
}

export default withStyles(styles)(InlineStyleButton);