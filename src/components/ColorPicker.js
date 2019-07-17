import React, { PureComponent } from 'react';
import Popover from '@material-ui/core/Popover';
import ColorPalette from './ColorPalette';

export class ColorPicker extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      target: null
    };

    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.onPickColor = this.onPickColor.bind(this);
  }

  open(target) {
    this.setState({ target });
  }
  close() {
    this.setState({ target: null });
  }

  onPickColor(color) {
    this.props.onPickColor(color);
    this.close();
  }

  render() {
    const { state: { target }, close, onPickColor, ...props } = this;
    return <Popover
      open={Boolean(target)}
      anchorEl={target}
      onClose={close}
      {...props}
    >
      <ColorPalette onPickColor={onPickColor} />
    </Popover>;
  }
}