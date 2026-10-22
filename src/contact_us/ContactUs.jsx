import React, { Component } from 'react'
import './contactUs.css'
import { ForwardMessage, HeadsetHelp, MessageText, Phone, SendDiagonalSolid } from 'iconoir-react'
import ModernEntry from './ModernEntry'
import LoadingCircle from '../loading_circle/LoadingCircle';

export default class ContactUs extends Component {
  constructor(){
    super();
    this.state = {cli_name: "", cli_email: "", cli_code: "", cli_age: "", cli_ph_no: "", cli_msg: "", email_verified: false, code_: null, timer_: 0, is_submitting: false};
  }
  
  putCliName = (text_)=>{
    this.setState({cli_name: text_});
  }
  putCliEmail = (text_)=>{
    this.setState({cli_email: text_});
  }
  putCliCode = (text_)=>{
    this.setState({cli_code: text_});
  }
  putCliAge = (text_)=>{
    this.setState({cli_age: text_});
  }
  putCliPhoneNo = (text_)=>{
    this.setState({cli_ph_no: text_});
  }
  putCliMsg = (ele)=>{
    this.setState({cli_msg: ele.target.value});
  }

  onSendCode = async ()=>{
    if (!this.state.cli_email.endsWith("@gmail.com")){
      this.props.createMessageBox("The provided email address is invalid. Please ensure it ends with @gmail.com.", "error");
      return;
    }
    let code_to_send = `${Math.floor(Math.random()*1000000)}`.padStart(6, 0)
    this.setState({code_: code_to_send, timer_: 30});
    const timer_start = ()=>{
      setTimeout(() => {
        if (this.state.timer_ === 0){
          return;
        }
        this.setState({timer_: this.state.timer_-1});
        timer_start();
      }, 1000);
    }
    timer_start();

    let http_resp = await fetch("/send_verification_code", {method: "POST", body: JSON.stringify({"gmail": this.state.cli_email, "code": code_to_send})});
    http_resp = JSON.parse(await http_resp.text())
    if (http_resp["status"] === "success"){
      this.props.createMessageBox(`Verification code has been sent on gmail ${this.state.cli_email}`, "success");
    }
    else{
      this.props.createMessageBox(`Falied to send code : ${http_resp["error"]}`, "error");
      this.setState({timer_: 0});
    }
  }

  onVerifyCode = ()=>{
    if (this.state.code_ === this.state.cli_code){
      this.setState({email_verified: true});
    }
    else{
      this.props.createMessageBox(`Invalid verification code.`, "error");
    }
  }

  onSubmitContact = async ()=>{
    this.setState({is_submitting: true});
    let to_send = {
      date: new Date().toGMTString(),
      name: this.state.cli_name,
      email: this.state.cli_email,
      age: this.state.cli_age,
      phone_no: this.state.cli_ph_no,
      message: this.state.cli_msg
    }
    let http_resp = await fetch("/send_contact_application", {method: "POST", body: JSON.stringify(to_send)});
    http_resp = JSON.parse(await http_resp.text());
    if (http_resp["status"] === "success"){
      this.props.createMessageBox("Successfully sent contact request to the admin, you will recieve response soon.", "success");
    }
    else{
      this.props.createMessageBox(`Failed to send contact request. error : ${http_resp["error"]}`, "error");
    }
    this.setState({is_submitting: false});
  }

  componentDidMount(){
    document.getElementsByClassName("content_and_footer")[0].scrollTo(0, 0);
  }
  
  render() {
    let {device_width} = this.props
    return (
      <div className='contact_main_body' style={device_width > 790 ? {}: {height: "fit-content"}}>
        {device_width > 790 ? 
          <div className='portion_1'>
              <h1 className='h_contact'>CONTACT US</h1>
              <div className='icons'>
                  <ForwardMessage width={100} height={100} color='cyan' className='icc' />
                  <MessageText width={100} height={100} color='cyan' className='icc' />
                  <Phone  width={100} height={100} color='cyan' className='icc' />
                  <HeadsetHelp width={100} height={100} color='cyan' className='icc' />
              </div>
              <span className='admin_gmail'>Gmail Us On: scihack.official@gmail.com</span>
          </div>
        : null}

        <div className='portion_2' style={device_width > 790 ? {}: {height: "fit-content", margin: "15px 5px"}}>
            {device_width > 790 ? null :
              <h1 className='h_contact'>
                <MessageText width={30} height={30} color='yellow' className='icc' />
                CONTACT US
              </h1>}
            
            {!this.state.email_verified ? 
            <div className='email_and_verificaiton' style={device_width > 790 ? {}: {display: "flex", flexDirection: "column", gap: "10px"}}>
              <span style={{fontSize: "1.2rem", fontFamily: `"Roboto Slab", serif`}}>*Please verify your Gmail address first.</span>
              <ModernEntry label_text="Email" onChange={this.putCliEmail} />
              <ModernEntry label_text="Code" onChange={this.putCliCode} />
              <span>**If you don’t see the verification email in your inbox, please check your spam or junk folder as well.</span>
              {this.state.timer_ ? 
              <button className='send_code submit_btn' style={{cursor: "auto"}}>Resend in {this.state.timer_}</button>
              :
              <button className='send_code submit_btn' onClick={this.onSendCode}>Send Code <SendDiagonalSolid width={30} height={30} color='cyan'/></button>
              }
              <button className='verify_gmail submit_btn' style={{marginTop: "15px"}} onClick={this.onVerifyCode} >Verify Gmail</button>
            </div>
            :
            <>
            <span style={{fontSize: "1.2rem", fontFamily: `"Roboto Slab", serif`}}>*{this.state.cli_email} has been successfully verified. Please fill out the form and submit it.</span>
            <ModernEntry label_text="Name" onChange={this.putCliName} />
            <ModernEntry label_text="Age" onChange={this.putCliAge} />
            <ModernEntry label_text="Phone No. (optional)" onChange={this.putCliPhoneNo} />
            <textarea className='message_area' rows={5} placeholder='message...' onChange={this.putCliMsg} ></textarea>
            {this.state.is_submitting ? 
            <button className='submit_btn' style={{display: "flex", alignItems: "center", justifyContent: "center", gap: "10px"}}>Submitting... <LoadingCircle width="35" height="35" /></button>
            :
            <button className='submit_btn' onClick={this.onSubmitContact}>Submit</button>
            }
            </>
            }
        </div>
      </div>
    )
  }
}
