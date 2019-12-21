import React, { useState } from 'react';
import './Control.scss';
import IconButton from '@material-ui/core/IconButton';
import RefreshIcon from '@material-ui/icons/Refresh';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import AntSwitch from './Switch';

function Control({ changeBg, changeLang, changeUnits }) {
  const [isChecked, setChecked] = useState(false);

  function handleChange() {
    const newIsChecked = !isChecked;
    setChecked(newIsChecked);
    changeUnits(newIsChecked);
  }

  return (
    <div className="Control">
      <div className="refresh-icon">
        <IconButton className="button" onClick={changeBg}>
          <RefreshIcon />
        </IconButton>
      </div>
      <FormControl
        className="langInput"
        classes={{
          root: {
            backgroundColor: 'white',
            color: 'white',
          },
        }}
      >
        <InputLabel id="demo-simple-select-label">Language</InputLabel>
        <Select
          className="select"
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          onChange={changeLang}
        >
          <MenuItem value="en">English</MenuItem>
          <MenuItem value="ru">Russian</MenuItem>
          <MenuItem value="by">Belorussian</MenuItem>
        </Select>
      </FormControl>
      <Typography component="div" style={{ marginBottom: '-20px' }}>
        <Grid component="label" container alignItems="center" spacing={1}>
          <Grid style={{ color: 'white', fontSize: '20px' }} item>°C</Grid>
          <Grid item>
            <AntSwitch
              checked={isChecked}
              onChange={handleChange}
              value="checkedC"
            />
          </Grid>
          <Grid style={{ color: 'white', fontSize: '20px' }} item>°F</Grid>
        </Grid>
      </Typography>
    </div>
  );
}

export default Control;
