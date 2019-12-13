import React from 'react'
import './Weather.scss'

const Weather = ({data}) => {
  return (
    <div>
      {data && data.currently && <p className={'summary'}>{data.currently.summary}</p>}
      {console.log(data)}
      {/*<p>{temperature}</p>*/}
      {/*<p> {description}</p>*/}
      {/*<p>{error}</p>*/}
    </div>
  )
};

export default Weather;
