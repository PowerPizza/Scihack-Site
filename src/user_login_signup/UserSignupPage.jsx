import React, { Component } from 'react'
import './userSignupPage.css'
import ModernEntry from '../contact_us/ModernEntry';
import { Link, Navigate } from 'react-router-dom';
import LoadingCircle from '../loading_circle/LoadingCircle';

export default class UserSignupPage extends Component {
  constructor() {
    super();
    this.state = { user_name: "", user_gmail: "", password: "", dob: "", phone_no: "", signup_step: 1, verification_code: "", timer_: 0, loader_: false };
  }

  onUserNameInput = (val_) => {
    this.setState({ user_name: val_ });
  }

  onPasswordInput = (val_) => {
    this.setState({ password: val_ });
  }

  onUserGmailInput = (val_) => {
    this.setState({ user_gmail: val_ });
  }

  onDOBInput = (val_) => {
    this.setState({ dob: val_ });
  }

  onPhoneNoInput = (val_) => {
    this.setState({ phone_no: val_ });
  }

  onVerificationCodeInput = (val_) =>{
    this.setState({ verification_code: val_ });
  }

  delay_time = 30;
  verification_code_ = 0;
  to_send = {};
  startTimer = ()=>{
    if (this.delay_time !== 0){
      this.delay_time -= 1;
      this.setState({timer_: this.delay_time});
      setTimeout(this.startTimer, 1000);
    }
  }

  sendVerificationCode = async (gmail)=>{
    this.setState({loader_: true});

    let gmail_exists = await fetch("/signup/account_exists", {method: "POST", body: JSON.stringify({"gmail": gmail})});
    gmail_exists = JSON.parse(await gmail_exists.text());
    if (gmail_exists["status"] === "success" && gmail_exists["exists"] === true){
      this.props.createMessageBox("An account with this Gmail already exists. Please log in or use a different Gmail to create a new account.", "error");
      this.setState({loader_: false});
      throw new Error("Account already exists.");
    }

    this.verification_code_ = `${Math.floor(Math.random()*10e+7)}`.padStart(7);
    let http_resp = await fetch("/send_verification_code", {method: "POST", body: JSON.stringify({"gmail": gmail, "code": this.verification_code_})});
    http_resp = JSON.parse(await http_resp.text());
    if (http_resp["status"] === "success"){
      this.delay_time = 30;
      this.startTimer();
      this.props.createMessageBox("Verification code sent successfully.", "success");
    }
    else{
      this.props.createMessageBox(`Failed to send verification code due to : ${http_resp["error"]}`, "error");
    }
    this.setState({loader_: false});
  }

  onSignupStep1 = () => {
    this.to_send = {
      "user_name": this.state.user_name,
      "gmail": this.state.user_gmail,
      "password": this.state.password,
      "dob": this.state.dob,
      "phone_no": this.state.phone_no
    }
    if (Object.values(this.to_send).includes("") || Object.values(this.to_send).includes(null) || Object.values(this.to_send).includes(undefined)) {
      this.props.createMessageBox("Fields marked with * are required. Please make sure to fill them out correctly.", "error");
      return;
    }
    if (this.to_send["password"].length < 8) {
      this.props.createMessageBox("Password must be at least 8 characters long.", "error");
      return;
    }
    if (!this.to_send["gmail"].endsWith("@gmail.com")) {
      this.props.createMessageBox("Gmail must be ends with `@gmail.com`", "error");
      return;
    }

    this.sendVerificationCode(this.to_send["gmail"]).then(()=>{
      this.setState({ signup_step: 2 });
    }).catch(()=>{});
  }

  onSignupStep2 = async ()=>{
    if (this.verification_code_ === this.state.verification_code){
      this.setState({loader_: true});
      let http_resp = await fetch("/signup/add_account", {method: "POST", body: JSON.stringify(this.to_send)});
      http_resp = JSON.parse(await http_resp.text());
      if (http_resp["status"] === "success") {
        this.props.createMessageBox("Signed up successfully! Redirecting...", "success");
        setTimeout(()=>{window.location.href = "/"}, 2000);
      }
      else if (http_resp["status"] === "failed") {
        this.props.createMessageBox(http_resp["error"], "error");
      }
    }
    else{
      this.props.createMessageBox("Oops! That code doesn't seem right. Please check and enter the correct verification code.", "error");
    }
    this.setState({loader_: false});
  }

  componentDidMount() {
    let ele_ = document.querySelector(".user_entry.DOB_UNIQUE28933_SSHAUxniwOOS .input_");
    ele_.style.color = "transparent";
    ele_.readonly = true;
    ele_.addEventListener("focusin", () => {
      ele_.style.color = "white";
      ele_.showPicker();
    })
    ele_.addEventListener("focusout", () => {
      if (!this.state.dob.length) {
        ele_.style.color = "transparent";
      }
    });

    window.google.accounts.id.prompt();
    window.google.accounts.id.renderButton(document.getElementById("signin_div"), {
      theme: 'outline',
      size: 'large',
      shape: 'circle',
      text: 'signin_with',
      click_listener: this.props.google_signin_handle
    });
  }

  // componentDidUpdate(_, prvState) {
  //   if (prvState.is_logging !== this.state.is_logging && document.getElementById("signin_div")){
  //     console.log("Reload UI");
  //     window.google.accounts.id.renderButton(document.getElementById("signin_div"), {
  //       theme: 'outline',
  //       size: 'large',
  //       shape: 'circle',
  //       text: 'signin_with',
  //       click_listener: this.props.google_signin_handle
  //     });
  //   }
  // }

  render() {
    let { device_width, is_logged_in } = this.props;
    if (is_logged_in){
      return <Navigate to={"/"} />
    }
    
    return (
      <div className='user_signup_main_body'>
        <div className='signup_content' style={device_width < 400 ? { width: "100%" } : {}}>
          {this.state.signup_step === 1 ?
            <div className='portion1' style={device_width < 400 ? { paddingLeft: "8px", paddingRight: "8px" } : {}}>
              <h1 className="signup_heading">Signup</h1>
              <ModernEntry label_text="*Username" className="user_entry" onChange={this.onUserNameInput} />
              <ModernEntry label_text="*Gmail" className="user_entry" onChange={this.onUserGmailInput} />
              <ModernEntry label_text="*Password" className="user_entry" onChange={this.onPasswordInput} />
              <ModernEntry label_text="*DOB" type="date" className="user_entry DOB_UNIQUE28933_SSHAUxniwOOS" onChange={this.onDOBInput} />
              <ModernEntry label_text="Phone No. (optional)" className="user_entry" onChange={this.onPhoneNoInput} />
              {this.state.loader_ ? 
              <button className='btn_aqua signup_btn'>Signup <LoadingCircle width="30" height="30" /></button>
              :
              <button className='btn_aqua signup_btn' onClick={this.onSignupStep1}>Verify Gmail</button>
              }
              <div id="signin_div" style={{width: "100%"}}></div>
              <br />
              <span style={{ color: "white", fontFamily: `"Roboto Slab", serif` }}>Already have an account? <Link to={"/login"} style={{ color: "cyan" }}>Log in</Link></span>
              <span style={{ opacity: 0 }}>__</span>
            </div>
            : null
          }

          {this.state.signup_step === 2 ?
            <div className='portion1 step2' style={device_width < 400 ? { paddingLeft: "8px", paddingRight: "8px" } : {}}>
              <h1 className="signup_heading" style={{margin: 0, fontSize: "2.3rem"}}>Gmail Verification</h1>
              <span className='msg_a1'>A verification code has been sent to your Gmail. Please enter the code below to verify your email address.</span>
              <ModernEntry label_text="Verification Code" className="code_entry" onChange={this.onVerificationCodeInput} />
              <span className='msg_a2'>Didn’t get the code? It might be in your Gmail spam folder—please check there too.</span>
              {this.state.timer_ !== 0 ? 
              <span className='resend_verification' style={{cursor: "auto"}}>Resend verification code in {this.state.timer_}</span>
                :
              <span className='resend_verification' onClick={()=>{this.sendVerificationCode(this.to_send["gmail"])}}>Resend verification code {this.state.loader_ ? <LoadingCircle width="25" height="25" /> : ""}</span>
              }
              {this.state.loader_ ? 
              <button className='btn_aqua signup_btn'>Verify <LoadingCircle width="25" height="25"/></button>
              :
              <button className='btn_aqua signup_btn' onClick={this.onSignupStep2}>Signup</button>
              }
            </div>
            : null
          }

          {device_width > 800 ?
            <div className='portion2'>
              <h1>WELCOME<br />JOIN US!</h1>
              <span className='sub_title'>Start your journey with us <br />and enjoy tools designed to <br /> make your life easier.</span>
            </div>
            :
            null
          }
        </div>
      </div>
    )
  }
}
