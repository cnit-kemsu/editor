import React, { PureComponent } from 'react';
import Popper from '@material-ui/core/Popper';

export class Picker extends PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      target: null,
      open: false
    };
    this.canOpen = true;
    this.popper = React.createRef(); 
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
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
    if (this.props.control.current.contains(event.target)) this.canOpen = false;
    if (!this.popper.current.contains(event.target)) this.close();
  }
 
  render() {
    return <Popper ref={this.popper}
      open={this.state.open}
      anchorEl={this.state.target}
    >
      {this.props.children}
    </Popper>;
  }
}