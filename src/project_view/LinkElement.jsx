import React, { Component } from 'react'
import './linkElement.css'
import { Link } from 'iconoir-react'

export default class LinkElement extends Component {
  render() {
    let {link_text, link_href} = this.props
    return (
        <div className='link_ele'>
            <Link width={40} height={40} color='white' style={{marginLeft: "10px", rotate: "35deg"}} />
            <a href={link_href} className='link_clickable' target='_blank' rel='noreferrer'>{link_text}</a>
        </div>
    )
  }
}
