import React from 'react';
import { ResizingFrame as useStyles } from './styles';

function ResizingFrame({ focused, symmetric, onClick, startHorizontalResizing, startVerticalResizing, startResizingBoth, children }, ref) {
  const classes = useStyles(symmetric);
  return <span className={classes.root} {...{ ref, onClick }}>

    {focused && <span className={classes.borderFrame}>

      <span className={classes.topBorder} />
      <span className={classes.rightBorder} onMouseDown={startHorizontalResizing} />
      <span className={classes.bottomBorder} onMouseDown={symmetric ? undefined : startVerticalResizing} />
      <span className={classes.leftBorder} />

      <span className={classes.topRightVerterx} />
      <span className={classes.bottomRightVerterx} onMouseDown={symmetric ? undefined: startResizingBoth} />
      <span className={classes.bottomLeftVerterx} />
      <span className={classes.topLeftVerterx} />

    </span>}

    {children}

  </span>;
}
export default React.forwardRef(ResizingFrame);