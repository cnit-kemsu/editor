import React, { Component } from 'react';
import { withStyles } from "@material-ui/core/styles";
import { Resizer as styles } from './styles';

const MIN_SIZE = 22;
const MAX_SIZE = 1000;

function validateSize(newWidth, newHeight, maxWidth) {
  if (newWidth != null) {
    if (newWidth < MIN_SIZE) return false;
    if (newWidth > maxWidth) return false;
    if (newWidth > MAX_SIZE) return false;
  }
  if (newHeight != null) {
    if (newHeight < MIN_SIZE) return false;
    if (newHeight > MAX_SIZE) return false;
  }
  return true;
}

class Resizer extends Component {
  constructor(props) {
    super(props);

    this.root = React.createRef();
    this.child = React.createRef();

    this.focus = this.focus.bind(this);
    this.blur = this.blur.bind(this);

    this.validateWidth = this.validateWidth.bind(this);
    this.validateHeight = this.validateHeight.bind(this);
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

  get maxWidth() {
    return this.editorElement.clientWidth;
  }

  validateWidth(newWidth) {
    const { width, height } = this.child.current;
    const newHeight = this.props.symmetric ? newWidth * height / width : null;
    return validateSize(newWidth, newHeight, this.maxWidth);
  }

  validateHeight(newHeight) {
    const { width, height } = this.child.current;
    const newWidth = this.props.symmetric ? newHeight * width / height : null;
    return validateSize(newWidth, newHeight, this.maxWidth);
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
      height: this.child.current.height
    });
  }
  horizontalResize(event) {
    event.preventDefault();
    const newWidth = this.original.width + event.pageX - this.original.pageX;
    if (this.validateWidth(newWidth)) this.child.current.width = newWidth;
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
      width: this.child.current.width,
      height: this.child.current.height
    });
  }
  verticalResize(event) {
    event.preventDefault();
    const newHeight = this.original.height + event.pageY - this.original.bottom;
    if (this.validateHeight(newHeight)) this.child.current.height = newHeight;
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
    const newWidth = this.original.width + event.pageX - this.original.pageX;
    const newHeight = this.original.height + event.pageY - this.original.bottom;
    const child = this.child.current;
    if (this.validateWidth(newWidth)) child.width = newWidth;
    if (this.validateHeight(newHeight)) child.height = newHeight;
  }

  componentDidMount() {
    this.editorElement = this.root.current.closest('.DraftEditor-root');
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
        className: [children.props.className, focused ? ' resizerChild_disableSelection' : ''].join(' ')
      })}
  
    </span>;
  }
}

export default withStyles(styles)(Resizer);