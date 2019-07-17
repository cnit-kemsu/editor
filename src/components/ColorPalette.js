import React from 'react';
import colors from '../lib/colorPalette';
import { ColorPalette as useStyles } from './styles';

function preventDefault(event) {
  event.preventDefault();
}

function hsl([h, s, l]) {
  return `hsl(${h}, ${s}%, ${l}%)`;
}

function ColorPalette({ onPickColor }) {

  const classes = useStyles();
  return <div className={classes.root}>
    {colors.map(
      (colorSet, index) => <div key={index}>
        
        {colorSet.map(
          (color, _index) => <span key={_index}
            className={classes.colorUnit}
            style={{ backgroundColor: hsl(color) }}
            onMouseDown={preventDefault}
            onClick={event => {
              //event.preventDefault();
              onPickColor(color);
            }}
          />
        )}

      </div>
    )}
  </div>;
}

export default React.memo(ColorPalette);