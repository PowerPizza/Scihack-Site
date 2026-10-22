import React, { Component } from 'react'
import './footer.css'
import { Github, Instagram, Linkedin, X, Youtube } from 'iconoir-react'

export default class Footer extends Component {
  render() {
    let {device_width} = this.props;
    let wh = device_width < 400 ? 45 : 70;
    return (
      <div className='footer_main_body'>
        <div className='social_medias' style={{margin: "auto"}}>
          <a href="https://www.youtube.com/@Code2EXE" target='_blank' rel='noreferrer'>
            <Youtube width={wh} height={wh} color='aqua' className='icon_' />
          </a>
          <a href="https://github.com/powerpizza" target='_blank' rel='noreferrer'>
            <Github width={wh} height={wh} color='aqua' className='icon_' />
          </a>
          <a href="https://www.instagram.com/powerpizza67695/" target='_blank' rel='noreferrer'>
            <Instagram width={wh} height={wh} color='aqua' className='icon_' />
          </a>
          <a href="https://x.com/ScihackOfficial" target='_blank' rel='noreferrer'>
            <X width={wh} height={wh} color='aqua' className='icon_' />
          </a>
          <a href="https://www.linkedin.com/in/scihack-sh-aa61b8360/" target='_blank' rel='noreferrer'>
            <Linkedin width={wh} height={wh} color='aqua' className='icon_' />
          </a>
        </div>
        <span className='copyright_text'>Copyright &#169; 2024 Scihack.</span>
        <span className='copyright_text'>Scihack™ is a trademark of Scihack</span>
        <span className='copyright_text'>All rights reserved.</span>
      </div>
    )
  }
}
