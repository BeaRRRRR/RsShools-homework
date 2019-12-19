import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import './Form.scss';

function Form(props) {
  return (
    <div className="form">
      <form onSubmit={props.getWeather}>
        <TextField
          className="search"
          label="New York, US"
          variant="outlined"
          type="text"
          id="address"
          name="address"
          style={{color : 'white'}}
        />
        <Button variant="outlined" className="submit" type="submit">Submit</Button>
      </form>
    </div>
  );
}
export default Form;
