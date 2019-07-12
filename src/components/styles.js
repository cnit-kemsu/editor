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

export const Resizer = {
  root: {
    position: 'relative',
    display: 'inline-block',
    cursor: 'move',
    userSelect: 'text'
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
    bottom: '2px',
    left: '0',
    right: '0',
    height: borderWidth,
    borderBottom: borderStyle,
    cursor: ({ symmetric }) => symmetric ? undefined : 's-resize'
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
    bottom: '-1px',
    right: '-3px',
    cursor: ({ symmetric }) => symmetric ? undefined : 'se-resize'
  },
  bottomLeftVerterx: {
    ...vertex,
    bottom: '-1px',
    left: '-3px'
  },
  topLeftVerterx: {
    ...vertex,
    top: '-3px',
    left: '-3px'
  }
};

export const Image = {
  image: {
    minWidth: '22px',
    minHeight: '22px',
    maxWidth: '1000px',
    maxHeight: '1000px'
  },
  text: {
    visibility: 'hidden !important',
    marginLeft: '-22px'
  }
};

export const Toolbar = {
  root: {
    borderBottom: '1px solid #ddd',
    paddingBottom: '8px'
  },
  button: {
    minWidth: '0px'
  }
};

export const ToolbarButton = {
  root: {
    minWidth: '0px'
  }
};

export const Editor = {
  root: {
    border: '1px solid #ddd',
    padding: '8px 16px 16px 16px'
  },
  content: {
    paddingTop: '16px'
  }
};

export const ColorPalette = makeStyles({
  root: {
    width: 'fit-content'
  },
  colorUnit: {
    width: '16px',
    height: '16px',
    display: 'inline-block',
    marginRight: '4px',
    cursor: 'pointer'
  }
});