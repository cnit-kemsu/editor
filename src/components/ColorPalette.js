import React from 'react';
import colors from '../internals/colors';
import { preventDefault } from '../internals/preventDefault';
import { ColorPalette as useStyles } from './styles';


function ColorPalette({ onPickColor }) {

  const classes = useStyles();
  return <div className={classes.root}>
    {colors.map(
      (_colors, index) => <div key={index}>
        
        {_colors.map(
          (color, _index) => <span key={_index}
            className={classes.colorUnit}
            style={{ backgroundColor: color }}
            onMouseDown={preventDefault}
            onClick={() => onPickColor(color)}
          />
        )}

      </div>
    )}
  </div>;
}

export default React.memo(ColorPalette);