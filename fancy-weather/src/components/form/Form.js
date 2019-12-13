import React from 'react'

const Form = (props) => {
    return (
        <form onSubmit={props.getWeather}>
            <input
                type='text'
                placeholder='New York, US'
                name='address'
            />
            <button>Submit</button>
        </form>
    )
};

export default Form;
