import React, { Component } from 'react'
import './promptYesNo.css'

export default class PromptYesNo extends Component {
  render() {
    let {msg_text, onYes, onNo} = this.props;

    return (
        <div className='all_black'>
          <div className='prmt_yn_main_body'>
            <span className='msg_'>{msg_text}</span>
            <div className='yn_btn_holder'>
                <button className='normal_btn_b green yn_btn' onClick={onYes}>Yes</button>
                <button className='normal_btn_b red yn_btn' onClick={onNo}>No</button>
            </div>
          </div>
        </div>
    )
  }
}
