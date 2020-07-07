import React from 'react';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import { fontFamilyArray } from '../internals/fontFamilyArray';
import { preventDefault } from '../internals/preventDefault';
import { PickerList as useStyles } from './styles';


function FontFamilyList({ onPickItem }) {

  const classes = useStyles();
  return <MenuList>
    {fontFamilyArray.map(
      (fontFamily, index) => <MenuItem key={index} className={classes.menuItem}
        onMouseDown={preventDefault}
        onClick={() => onPickItem(fontFamily)}
      >
        {fontFamily}
      </MenuItem>
    )}
  </MenuList>;
}

export default React.memo(FontFamilyList);