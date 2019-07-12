import React, { Component } from 'react';
import { withStyles } from "@material-ui/core/styles";
import { Resizer as styles } from './styles';

//const MIN_SIZE = 22;
//const MAX_SIZE = 1000;

function validateSize(size) {
  //if (size < MIN_SIZE) return MIN_SIZE;
  //if (size > MAX_SIZE) return MAX_SIZE;
  return size;
}

class Resizer extends Component {
  constructor(props) {
    super(props);

    this.root = React.createRef();
    this.child = React.createRef();

    this.focus = this.focus.bind(this);
    this.blur = this.blur.bind(this);

    this.startHorizontalResizing = this.startHorizontalResizing.bind(this);
    this.stopHorizontalResizing = this.stopHorizontalResizing.bind(this);
    this.horizontalResize = this.horizontalResize.bind(this);
    this.startVerticalResizing = this.startVerticalResizing.bind(this);
    this.stopVerticalResizing = this.stopVerticalResizing.bind(this);
    this.verticalResize = this.verticalResize.bind(this);
    this.startResizingBoth = this.startResizingBoth.bind(this);
    this.stopResizingBoth = this.stopResizingBoth.bind(this);
    this.resizeBoth = this.resizeBoth.bind(this);
  }

  componentWillUnmount() {
    if (this.props.focused) this.onBlur();
  }

  focus(event) {
    event.preventDefault();
    if (!this.props.focused) {
      document.addEventListener('mousedown', this.blur);
      this.props.onFocus?.();
    }
  }
  onBlur() {
    document.removeEventListener('mousedown', this.blur);
  }
  blur(event) {
    if (!this.root.current.contains(event.target)) {
      this.onBlur();
      this.props.onBlur?.();
    }
  }

  startHorizontalResizing(event) {
    event.preventDefault();
    this.original = {
      pageX: event.pageX,
      width: this.child.current.width
    };
    document.addEventListener('mousemove', this.horizontalResize);
    document.addEventListener('mouseup', this.stopHorizontalResizing);
  }
  stopHorizontalResizing(event) {
    event.preventDefault();
    this.original = undefined;
    document.removeEventListener('mousemove', this.horizontalResize);
    document.removeEventListener('mouseup', this.stopHorizontalResizing);
    this.props.onResize?.({
      width: this.child.current.width,
    });
  }
  horizontalResize(event) {
    event.preventDefault();
    this.child.current.width = this.original.width + event.pageX - this.original.pageX |> validateSize;
  }

  startVerticalResizing(event) {
    if (this.props.symmetric) return;
    event.preventDefault();
    this.original = {
      bottom: this.child.current.getBoundingClientRect().bottom,
      height: this.child.current.height
    };
    document.addEventListener('mousemove', this.verticalResize);
    document.addEventListener('mouseup', this.stopVerticalResizing);
  }
  stopVerticalResizing(event) {
    event.preventDefault();
    this.original = undefined;
    document.removeEventListener('mousemove', this.verticalResize);
    document.removeEventListener('mouseup', this.stopVerticalResizing);
    this.props.onResize?.({
      height: this.child.current.height
    });
  }
  verticalResize(event) {
    event.preventDefault();
    this.child.current.height = this.original.height + event.pageY - this.original.bottom |> validateSize;
  }

  startResizingBoth(event) {
    if (this.props.symmetric) return;
    event.preventDefault();
    this.original = {
      pageX: event.pageX,
      width: this.child.current.width,
      height: this.child.current.height,
      bottom: this.child.current.getBoundingClientRect().bottom
    };
    document.addEventListener('mousemove', this.resizeBoth);
    document.addEventListener('mouseup', this.stopResizingBoth);
  }
  stopResizingBoth(event) {
    event.preventDefault();
    this.original = undefined;
    document.removeEventListener('mousemove', this.resizeBoth);
    document.removeEventListener('mouseup', this.stopResizingBoth);
    this.props.onResize?.({
      width: this.child.current.width,
      height: this.child.current.height
    });
  }
  resizeBoth(event) {
    event.preventDefault();
    const child = this.child.current;
    child.width = this.original.width + event.pageX - this.original.pageX |> validateSize;
    child.height = this.original.height + event.pageY - this.original.bottom |> validateSize;
  }

  render() {
    const { classes, focused, children } = this.props;

    return <span className={classes.root} ref={this.root} onClick={this.focus}>
  
      {focused && <>
        <span className={classes.topBorder} />
        <span className={classes.rightBorder} onMouseDown={this.startHorizontalResizing} />
        <span className={classes.bottomBorder} onMouseDown={this.startVerticalResizing} />
        <span className={classes.leftBorder} />
  
        <span className={classes.topRightVerterx} />
        <span className={classes.bottomRightVerterx} onMouseDown={this.startResizingBoth} />
        <span className={classes.bottomLeftVerterx} />
        <span className={classes.topLeftVerterx} />
      </>}
  
      {React.cloneElement(children, {
        ref: this.child,
        className: focused ? 'resizerChild_disableSelection' : undefined
      })}
  
    </span>;
  }
}

export default withStyles(styles)(Resizer);