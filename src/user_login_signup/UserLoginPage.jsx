import { Component } from 'react'
import './userLoginPage.css'
import ModernEntry from '../contact_us/ModernEntry';
import { Link, Navigate } from 'react-router-dom';
import LoadingCircle from '../loading_circle/LoadingCircle';
import apiClient from '../api/api-client';

export default class UserLoginPage extends Component {
  constructor(){
    super();
    this.state = {gmail: "", password: "", is_logging: false, signup_with_google_btn: null};
  }

  onUserGmailInput = (val)=>{
    this.setState({gmail: val});
  }

  onPasswordInput = (val)=>{
    this.setState({password: val});
  }

  onSubmitLogin = async ()=>{
    this.setState({is_logging: true});
    
    const response = await apiClient.login(this.state.gmail, this.state.password);
    if (response.status === "OK") {
      localStorage.setItem("token", response.token);
      window.location.href = "/";
    }
    else {
      this.props.createMessageBox(`(${response.status}) Failed to login : ${response?.error}`, "error");
    }
    this.setState({is_logging: false});
  }

  google_creds_handle = (response)=>{
    console.log(response);
  }

  componentDidMount() {
    window.google.accounts.id.prompt();
    window.google.accounts.id.renderButton(document.getElementById("signin_div"), {
      theme: 'outline',
      size: 'large',
      shape: 'circle',
      text: 'signin_with',
      click_listener: this.props.google_signin_handle
    });
  }

  componentDidUpdate(_, prvState) {
    if (prvState.is_logging !== this.state.is_logging && document.getElementById("signin_div")){
      console.log("Reload UI");
      window.google.accounts.id.renderButton(document.getElementById("signin_div"), {
        theme: 'outline',
        size: 'large',
        shape: 'circle',
        text: 'signin_with',
        click_listener: this.props.google_signin_handle
      });
    }
  }

  render() {
    let {device_width, is_logged_in} = this.props;
    if (is_logged_in){
      return <Navigate to={"/"} />
    }

    return (
      <div className='user_login_main_body'>
        <div className='login_content' style={device_width < 400 ? { width: "100%" } : {}}>
          <div className='portion1' style={device_width < 400 ? { paddingLeft: "8px", paddingRight: "8px" } : {}}>
            <h1 className="login_heading" >Login</h1>
            <ModernEntry label_text="Gmail" className="user_entry" onChange={this.onUserGmailInput} />
            <ModernEntry label_text="Password" className="user_entry" onChange={this.onPasswordInput} />
            {this.state.is_logging ? 
            <button className='btn_aqua login_btn'>Login <LoadingCircle width="25" height="25" /></button>
            :
            <>
            <button className='btn_aqua login_btn' onClick={this.onSubmitLogin}>Login</button>
            <div id="signin_div" style={{width: "100%"}}></div>
            <br />
            </>
            }
            <span style={{color: "white", fontFamily: `"Roboto Slab", serif`}}>Don't have an account? <Link to={"/signup"} style={{color: "cyan"}}>Sign Up</Link></span>
          </div>
          {device_width > 800 ?
            <div className='portion2'>
              <h1>WELCOME<br />BACK!</h1>
              <span className='sub_title'>Join us today and enjoy<br />tools crafted to simplify and<br />empower your workflow.</span>
            </div>
            :
            null
          }
        </div>
      </div>
    )
  }
}
