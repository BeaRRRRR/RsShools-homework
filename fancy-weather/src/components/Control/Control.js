import React from 'react';
import './Control.scss';
import IconButton from '@material-ui/core/IconButton';
import RefreshIcon from '@material-ui/icons/Refresh';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

function Control(props) {
  return (
    <div className="Control">
      <div className="refresh-icon">
        <IconButton className="button">
          <RefreshIcon />
        </IconButton>
      </div>
      <FormControl className="langInput">
        <InputLabel id="demo-simple-select-label">Age</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value=""
          onChange={props.handleChange}
        >
          <MenuItem value="en">English</MenuItem>
          <MenuItem value="ru">Russian</MenuItem>
          <MenuItem value="by">Belorussian</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}

export default Control;
