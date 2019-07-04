import { makeStyles } from "@material-ui/core/styles";

const border = {
  position: 'absolute'
};
const borderStyle = '2px solid cornflowerblue';
const borderWidth = '4px';

const vertex = {
  position: 'absolute',
  width: '6px',
  height: '6px',
  borderRadius: '3px',
  border: '1px solid cornflowerblue',
  background: 'lightblue'
};

export const ResizingFrame = makeStyles({
  root: {
    position: 'relative',
    display: 'inline-block'
  },
  borderFrame: {
    position: 'absolute',
    width: '100%',
    height: 'calc(100% - 4px)',
    cursor: 'move'
  },
  topBorder: {
    ...border,
    top: '0',
    left: '0',
    right: '0',
    height: borderWidth,
    borderTop: borderStyle
  },
  rightBorder: {
    ...border,
    top: '0',
    right: '0',
    bottom: '0',
    width: borderWidth,
    borderRight: borderStyle,
    cursor: 'e-resize'
  },
  bottomBorder: {
    ...border,
    bottom: '0',
    left: '0',
    right: '0',
    height: borderWidth,
    borderBottom: borderStyle,
    cursor: symmetric => symmetric ? undefined : 's-resize'
  },
  leftBorder: {
    ...border,
    top: '0',
    left: '0',
    bottom: '0',
    width: borderWidth,
    borderLeft: borderStyle
  },
  topRightVerterx: {
    ...vertex,
    top: '-3px',
    right: '-3px'
  },
  bottomRightVerterx: {
    ...vertex,
    bottom: '-3px',
    right: '-3px',
    cursor: symmetric => symmetric ? undefined : 'se-resize'
  },
  bottomLeftVerterx: {
    ...vertex,
    bottom: '-3px',
    left: '-3px'
  },
  topLeftVerterx: {
    ...vertex,
    top: '-3px',
    left: '-3px'
  }
});