import React, { Component } from 'react'
import './header.css'
import scihack_logo from '../icons/scihack_logo.png'
import { Link } from 'react-router-dom'
import { MoreVert } from "iconoir-react"

export default class Header extends Component {
  render() {
    let {device_width, toggleRightMenu, is_logged_in} = this.props;

    return (
      <div className='header_main_body'>
        <img src={scihack_logo} alt="my_logo" draggable={false} className='my_logo' />
        <h1 className='name_text'>SCIHACK</h1>

        {device_width > 800 ? 
          <div className='tabs'>
            <Link to={"/"} className='link_'>Home</Link>
            <Link to={"/skills"} className='link_'>Skills</Link>
            <Link to={"/projects"} className='link_'>Projects</Link>
            <Link to={"/blog"} className='link_'>Blog</Link>
            {device_width > 1115 ? <>
            <Link to={"/experience"} className='link_'>Experience</Link>
            <Link to={"/services"} className='link_'>Services</Link>
            <Link to={"/about_me"} className='link_'>About me</Link>
            </> : null}
            <Link to={"/contact"} className='link_'>Contact</Link>
            {is_logged_in ? 
            <>
            <Link to={"/about_me"} className='link_'>About me</Link>
            <Link  to={"/manage_account"} className='link_'>My Account</Link>
            </>
            :
            <>
            <Link to={"/login"} className='link_'>Login</Link>
            <Link to={"/signup"} className='link_'>Signup</Link>
            </>
            }
          </div>
        : null}
        
        {device_width <= 1115 ? 
          <div className='more_options'>
            <MoreVert width={45} height={45} fill='cyan' strokeWidth={6} className='more_icon' onClick={toggleRightMenu}/>
          </div>
        : null}
      </div>
    )
  }
}
