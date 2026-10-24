import { Component } from 'react'
import './manageAccountPage.css'
import { Navigate } from 'react-router-dom';
import { EditPencil, ProfileCircle } from 'iconoir-react';
import LoadingCircle from '../loading_circle/LoadingCircle';
import PromptYesNo from '../prompt_box/PromptYesNo';
import apiClient from '../api/api-client';


class GmailVerificationPrompt extends Component{
    code = null;

    constructor(){
        super();
        this.state = {timer_: 30, timer_running: false, timer_interval: null, user_code_: null, is_loading: false};
    }

    onChangeUserCode = (ele)=>{
        this.setState({user_code_: ele.target.value});
    }

    startTimer = ()=>{
        let iv = setInterval(()=>{
            if (this.state.timer_ <= 0){
                this.setState({timer_: 30, timer_running: false});
                clearInterval(iv);
                return;
            }
            this.setState({timer_: this.state.timer_ - 1});
        }, 1000);
        this.setState({timer_running: true, timer_interval: iv});
    }

    onResendCode = async ()=>{
        if (this.state.timer_running){
            return;
        }
        this.code = `${Math.floor(Math.random()*1000000)}`.padStart(7, 0);
        this.startTimer();
        let http_resp = await apiClient.sendVerificationCode(this.props.gmail, this.code);
        if (http_resp.status === "OK"){
            this.props.createMessageBox("Code has been sent on your gmail.", "success");
        }
        else{
            this.props.createMessageBox(`Failed to send code on your gmail due to : ${http_resp["error"]}`, "error");
            this.setState({timer_: 0});
        }
    }

    onBtnCancle = ()=>{
        clearInterval(this.state.timer_interval);
        this.props.on_cancle();
    }

    onBtnVerify = ()=>{
        this.setState({is_loading: true});
        if (this.code === this.state.user_code_){
            this.props.on_verify().finally(()=>{
                this.setState({is_loading: false});
            });
        }
        else {
            this.props.createMessageBox(`The verification code you entered is invalid. Please check the code and try again.`, "error");
        }
    }

    componentDidMount(){
        this.onResendCode();
    }

    render(){
        return (
            <div className='all_black'>
                <div className='prompt_content'>
                    <h2 className='prompt_heading'>Gmail Verification</h2>
                    <span className='msg1'>It looks like you've updated your Gmail address. Please verify the new Gmail before saving the changes.</span>
                    <br />
                    <span className='msg2'>A verification code has been sent to your Gmail. Please enter the code below to verify your email address.</span>
                    <input type="text" className='code_entry' placeholder='code' onChange={this.onChangeUserCode} />
                    {this.state.timer_running ? 
                    <span className='resend_code'>Resend Code in {this.state.timer_}</span>
                    :
                    <span className='resend_code' onClick={this.onResendCode}>Resend Code</span>
                    }
                    <span className='msg3'>Didn't get the code? Check your spam folder—it might be there.</span>

                    <br />
                    <div className='btns'>
                        <button className='cancle_btn' onClick={this.onBtnCancle}>Cancle</button>
                        {this.state.is_loading ? 
                        <button className='verify_code_btn'>Verify <LoadingCircle width="25" height="25"/></button>
                        :
                        <button className='verify_code_btn' onClick={this.onBtnVerify}>Verify</button>
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default class ManageAccountPage extends Component {
    constructor(){
        super();
        this.state = {user_data: null, input_disabled: true, username: "", dob: "", phone_no: "", gmail: "", password: "", gmail_verify_prompt: null, is_loading: false, prompt_ys_no: null};
    }

    onEdit = ()=>{
        this.setState({input_disabled: false});
    }

    onChangeUsername = (ele)=>{
        this.setState({username: ele.target.value});
    }
    onChangeDob = (ele)=>{
        this.setState({dob: ele.target.value});
    }
    onChangePhoneNo = (ele)=>{
        this.setState({phone_no: ele.target.value});
    }
    onChangeGmail = (ele)=>{
        this.setState({gmail: ele.target.value});
    }
    onChangePassword = (ele)=>{
        this.setState({password: ele.target.value});
    }

    onCloseGmailVerifyPrompt = ()=>{
        this.setState({gmail_verify_prompt: null});
    }

    onSaveModifications = async ()=>{
        let to_send = {}
        if (this.state.username){
            to_send["username"] = this.state.username;
        }
        if (this.state.dob){
            to_send["dob"] = this.state.dob;
        }
        if (this.state.phone_no){
            to_send["phone_no"] = this.state.phone_no;
        }
        if (this.state.password){
            to_send["password"] = this.state.password;
        }
        if (this.state.gmail && this.state.gmail !== this.state.user_data["gmail"]){
            const on_verify = async ()=>{
                to_send["gmail"] = this.state.gmail;
                let http_resp = await apiClient.updateAccount(to_send);
                if (http_resp.status === "OK") {
                    this.props.createMessageBox("Account details has been modified.", "success");
                    this.setState({input_disabled: true});
                }
                this.onCloseGmailVerifyPrompt();
            }
            this.setState({gmail_verify_prompt: <GmailVerificationPrompt createMessageBox={this.props.createMessageBox} gmail={this.state.gmail} on_cancle={this.onCloseGmailVerifyPrompt} on_verify={on_verify} />});
            return;
        }
        this.setState({is_loading: true});

        let http_resp = await apiClient.updateAccount(to_send);
        if (http_resp.status === "OK") {
            this.props.createMessageBox("Account details has been modified.", "success");
        }
        this.setState({is_loading: false, input_disabled: true});
    }

    onLogout = async ()=>{
        localStorage.removeItem("token");
        window.location.href = "/";
    }

    onDeleteAccount = ()=>{
        const on_yes = async ()=>{
            let http_resp = await apiClient.deleteAccount();
            if (http_resp.status === "OK"){
                localStorage.removeItem("token");
                this.props.createMessageBox("Your account has been deleted successfully.", "success");
                setTimeout(()=>{window.location.href = "/"}, 1000);
            }
            else{
                this.props.createMessageBox(`Failed to delete your account due to : ${http_resp["error"]}`, "error");
            }
            this.setState({prompt_ys_no: null});
        }
        const on_no = ()=>{
            this.setState({prompt_ys_no: null});
        }
        this.setState({prompt_ys_no: <PromptYesNo msg_text="Do you really want to delete your account from this site ?" onYes={on_yes} onNo={on_no} />})
    }

    async componentDidMount(){
        this.props.setLoadingBarProgress(30);
        let http_resp = await apiClient.getCompleteAccountInfo();
        this.props.setLoadingBarProgress(60);
        if (http_resp.status === "OK"){
            this.setState({user_data: http_resp});
        }
        else{
            this.props.createMessageBox(`(${http_resp.status}) Failed to get account info: ${http_resp.error}`, "error");
        }
        this.props.setLoadingBarProgress(100);
    }

  render() {
    let {is_logged_in, device_width} = this.props;
    if (is_logged_in === false){
        return <Navigate to={"/"} />
    }

    if (!this.state.user_data){
        return (
            <div className='manage_acc_main_body'>
                <span style={{marginLeft: "auto", marginRight: "auto"}}>
                    <LoadingCircle width="40" height="40" />
                </span>
            </div>
        )
    }

    return (
      <div className='manage_acc_main_body'>
        {this.state.gmail_verify_prompt}
        {this.state.prompt_ys_no}
        <div className='content' style={device_width < 650 ? {width: "100%"}: {}}>
            <div className='profile_icon'>
                <ProfileCircle width={120} height={120} color='cyan' strokeWidth={1}/>
                <span>Logged in as {this.state.user_data["username"]}</span>
            </div>
            <div className='container info' style={device_width < 400 ? {display: "flex", flexDirection: "column", gap: "5px"}: {}}>
                <span>Username</span>
                <input type="text" onChange={this.onChangeUsername} defaultValue={this.state.user_data["username"]} disabled={this.state.input_disabled} />
                <span>D.O.B</span>
                <input type="date" onClick={(ele)=>{ele.target.showPicker()}} onChange={this.onChangeDob} defaultValue={this.state.user_data["dob"]} disabled={this.state.input_disabled} />
                <span>Phone No.</span>
                <input type="text" onChange={this.onChangePhoneNo} defaultValue={this.state.user_data["phone_no"]} disabled={this.state.input_disabled} />
                <span>Gmail</span>
                <input type="email" onChange={this.onChangeGmail} defaultValue={this.state.user_data["gmail"]} disabled={this.state.input_disabled} />
                <span>Password</span>
                <input type={this.state.input_disabled ? "password" : "text"} onChange={this.onChangePassword} defaultValue={this.state.user_data["password"]} disabled={this.state.input_disabled} />
                {this.state.input_disabled ? 
                <button className='btn_aqua edit_btn' onClick={this.onEdit}><EditPencil width={20} height={20} color='cyan' /> Edit</button>
                :
                this.state.is_loading ? 
                <button className='btn_aqua save_btn'>Save Changes <LoadingCircle width="25" height="25" /></button>
                :
                <button className='btn_aqua save_btn' onClick={this.onSaveModifications}>Save Changes</button>
                }
            </div>

            <div className='container btns' style={device_width < 400 ? {flexDirection: "column", gap: "15px"} : {}}>
                <button className='btn_logout' onClick={this.onLogout} style={device_width < 400 ? {width: "100%"}: {}}>Logout</button>
                <button className='btn_delete_acc' onClick={this.onDeleteAccount} style={device_width < 400 ? {width: "100%"}: {}}>Delete Account</button>
            </div>

        </div>
      </div>
    )
  }
}
