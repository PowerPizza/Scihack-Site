import React, { Component } from 'react'
import './homePage.css'
import {Github, Instagram, Linkedin, X, Youtube} from 'iconoir-react'
import { Link } from 'react-router-dom';

export default class HomePage extends Component {
  componentDidMount(){
    document.getElementsByClassName("content_and_footer")[0].scrollTo(0, 0);
  }
  
  render() {
    let {device_width} = this.props;
    return (
      <div className='home_main_body' style={device_width < 550 ? {flexDirection: "column"} : {minHeight: "100%", maxHeight: "fit-content"}}>
        <div className='pfp_image' style={{marginTop: device_width < 500 ? "20px" : ""}}></div>
        <div className='other_info' style={device_width < 550 ? {marginLeft: "auto", marginRight: "auto"} : {}}>
            <h1 style={{margin: "0px", fontSize: "2.4rem"}}>Hi, It's <span className='color_aqua'>Scihack</span></h1>
            <span style={{marginLeft: "auto", whiteSpace: "nowrap"}}>Also known as <span className='color_aqua'>PowerPizza</span></span>
            <h2 style={{margin: "0px", marginTop: "5px", fontSize: "2rem"}}>I'm a <span className='color_aqua improgrammer'>&nbsp;</span></h2>
            <p style={{fontSize: "1.12rem"}}>I’m a programmer since 3 Aug 2020, currently a student. I enjoy coding, exploring technology, and creating software, websites, android applications, and tiny scripts. With some experience in hardware like Arduino and ESP32, I aim to master AI, ML, and DL to become the best programmer and launch my own company, SciHack. In my free time, I enjoy eating, coding, and spending time with my favorite people.</p>
            <div className='social_medias' style={{margin: "auto"}}>
              <a href="https://www.youtube.com/@Code2EXE" target='_blank' rel='noreferrer'>
               <Youtube width={40} height={40} color='aqua' className='icon_' />
              </a>
              <a href="https://github.com/powerpizza" target='_blank' rel='noreferrer'>
               <Github width={40} height={40} color='aqua' className='icon_' />
              </a>
              <a href="https://www.instagram.com/powerpizza67695" target='_blank' rel='noreferrer'>
               <Instagram width={40} height={40} color='aqua' className='icon_' />
              </a>
              <a href="https://x.com/ScihackOfficial" target='_blank' rel='noreferrer'>
                <X width={40} height={40} color='aqua' className='icon_' />
              </a>
              <a href="https://www.linkedin.com/in/scihack-sh-aa61b8360/" target='_blank' rel='noreferrer'>
                <Linkedin width={40} height={40} color='aqua' className='icon_' />
              </a>
            </div>
            <Link to={"/hire_me"} style={{textDecoration: "none"}}>
              <button className='btn_aqua hire_me'>Hire Me</button>
            </Link>
        </div>
      </div>
    )
  }
}
