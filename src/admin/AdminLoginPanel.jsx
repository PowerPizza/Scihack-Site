import React, { Component } from 'react'
import './adminLoginPanel.css'
import ModernEntry from '../contact_us/ModernEntry'
import LoadingCircle from '../loading_circle/LoadingCircle';

export default class AdminLoginPanel extends Component {
    constructor(){
        super();
        this.state = {uname: null, pass: null, key_: null, loading_cir: null, auto_login_failed: false};
    }

    putUserName = (text_)=>{
        this.setState({uname: text_});
    }
    putPassword = (text_)=>{
        this.setState({pass: text_});
    }
    putKey_ = (text_)=>{
        this.setState({key_: text_});
    }

    proceedLogin = async ()=>{
        let to_send = {
            uname: this.state.uname,
            password: this.state.pass,
            key: this.state.key_
        }
        if (Object.values(to_send).includes(null)){
            this.props.createMessageBox("Please fill the entries...", "error");
            return
        }
        this.setState({loading_cir: <LoadingCircle />});
        let http_resp = await fetch("/admin_verification", {method: "POST", body: JSON.stringify(to_send)});
        if (await http_resp.text() === "LOGIN_SUCCESS"){
            this.props.createMessageBox("Admin log in success!", "success");
            this.props.setLoginStatus(true);
        }
        else{
            this.setState({loading_cir: null});
            this.props.createMessageBox("Failed to login : Invalid username, password or key.", "error");
        }
    }

    async componentDidMount(){
        let http_resp = await fetch("/check_admin_verification", {method: "POST"});
        if (await http_resp.text() === "LOGIN_SUCCESS"){
            this.props.createMessageBox("Automatic admin login success!", "success");
            this.props.setLoginStatus(true);
            this.setState({auto_login_failed: false});
        }
        else{
            this.setState({auto_login_failed: true});
        }
    }

  render() {
    return (
      <div className='admin_login_panel_body'>
        <div className='entry_container'>
            {this.state.auto_login_failed ? 
            <>
            
            <h1 className='heading_admin_login'>Admin Login</h1>
            <div className='admin_e'>
                <ModernEntry label_text="Username" ui_color="red" className="admin_entry" onChange={this.putUserName} />
            </div>
            <div className='admin_e'>
                <ModernEntry label_text="Password" ui_color="red" className="admin_entry" onChange={this.putPassword} />
            </div>
            <div className='admin_e'>
                <ModernEntry label_text="Key" ui_color="red" className="admin_entry" onChange={this.putKey_} />
            </div>

            {this.state.loading_cir ? 
            <button className='btn_login disabled' style={{display: "flex", alignItems: "center", gap: "10px", justifyContent: "center"}}>Login {this.state.loading_cir} </button>
            :
            <button className='btn_login' onClick={this.proceedLogin}>Login</button>
            }
            </>
            :
            <div style={{margin: "auto"}}>
                <LoadingCircle width="50" height="50"/>
                <span style={{fontSize: "1.3rem"}}>Trying to automatic login...</span>
            </div>
            }
        </div>
      </div>
    )
  }
}
