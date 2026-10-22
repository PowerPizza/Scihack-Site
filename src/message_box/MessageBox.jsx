import React, { Component } from 'react'
import './messageBox.css'
import { XmarkCircle } from 'iconoir-react'

export default class MessageBox extends Component {
  render() {
    let {msg_text, msg_type} = this.props;
    let bx_shadow_color = "cyan"; // info
    switch (msg_type) {
        case "success":
            bx_shadow_color = "lime";
            break;
        case "warning":
            bx_shadow_color = "yellow";
            break;
        case "error":
            bx_shadow_color = "red";
            break;
        default:
           bx_shadow_color = "cyan";
    }
    return (
      <div className='msg_box_main_body' style={{boxShadow: `0px 0px 5px 1px ${bx_shadow_color}`}}>
        <span className='message_text'>{msg_text}</span>
      </div>
    )
  }
}
