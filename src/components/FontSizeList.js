import React from 'react';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import { fontSizeArray } from '../lib/fontSizeArray';
import { preventDefault } from '../lib/preventDefault';
import { PickerList as useStyles } from './styles';


function FontSizeList({ onPickItem }) {

  const classes = useStyles();
  return <MenuList>
    {fontSizeArray.map(
      (fontSize, index) => <MenuItem key={index} className={classes.menuItem}
        onMouseDown={preventDefault}
        onClick={() => onPickItem(fontSize)}
      >
        {fontSize}
      </MenuItem>
    )}
  </MenuList>;
}

export default React.memo(FontSizeList);