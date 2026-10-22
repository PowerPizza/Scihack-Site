import React, { Component } from 'react'
import loading_circle from '../icons/loading_circle.gif'
import './loadingCircle.css'

export default class LoadingCircle extends Component {
  render() {
    let {width, height} = this.props;
    return (
      <div className='loading_circle_main_body' style={{"width": `${width}px`, "height": `${height}px`}}>
        <img src={loading_circle} alt="loading_circle" />
      </div>
    )
  }
}

LoadingCircle.defaultProps = {
    width: 30,
    height: 30
}