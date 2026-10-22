import React, { Component } from 'react'
import './hireMePage.css'
import profilePhoto from '../icons/pfps/pfp_A.jpeg'
import LoadingCircle from '../loading_circle/LoadingCircle';
import { ArrowLeftCircle } from 'iconoir-react';
import { Link } from 'react-router-dom';

export default class HireMePage extends Component {
    constructor(){
        super();
        this.state = {cli_name: "", cli_gmail: "", about_project: "", loader: null};
    }

    onChangeName = (ele)=>{
        this.setState({cli_name: ele.target.value});
    }
    onChangeGmail = (ele)=>{
        this.setState({cli_gmail: ele.target.value});
    }
    onChangeAboutProject = (ele)=>{
        this.setState({about_project: ele.target.value});
    }

    onSubmitHireApplication = async ()=>{
        let to_send = {
            date_of_submission: new Date().toLocaleString(),
            cli_name: this.state.cli_name,
            cli_gmail: this.state.cli_gmail,
            project_info: this.state.about_project
        }
        this.setState({loader: <LoadingCircle width="40" height="40" />});
        let http_resp = await fetch("/send_hire_application", {method: "POST", body: JSON.stringify(to_send)});
        http_resp = JSON.parse(await http_resp.text());
        if (http_resp["status"] === "success"){
            this.props.createMessageBox("Successfully submitted hiring application, admin will soon contact you on your gmail.", "success");
        }
        else{
            this.props.createMessageBox(`Failed to submit hiring application. Error : ${http_resp['error']}`, "error");
        }
        this.setState({loader: null});
    }

    componentDidMount(){
        document.getElementsByClassName("content_and_footer")[0].scrollTo(0, 0);
    }
    
    render() {
        let {device_width} = this.props;
        return (
            <div className='hireme_page_body'>
                <div className='hire_me_content' style={{padding: device_width > 700 ? "40px" : "15px"}}>
                    {/* <Link to={"/"} style={{color: 'cyan'}}> */}
                        <ArrowLeftCircle width={40} height={40} onClick={()=>{window.history.back()}} style={{cursor: "pointer"}}/>
                    {/* </Link> */}
                    <header>
                        <img src={profilePhoto} alt="profile_photo" className='pfp' draggable={false} />
                        <div className='other_info'>
                            <span style={{fontFamily: '"Bokor", system-ui', fontWeight: "300", fontSize: device_width > 450 ? "2.5rem" : "1.8rem"}}>Hire Me</span>
                            <span style={{fontFamily: '"Roboto Slab", serif', fontSize: "1.4rem"}}>2$/hour</span>
                            <p style={{fontFamily: '"Roboto Slab", serif', fontSize: "1.2rem"}}>Let's build something awesome together.</p>
                        </div>
                    </header>

                    <section className="about">
                        <h2>More About Me</h2>
                        <p style={{color: "white", fontFamily: '"Roboto Slab", serif', fontSize: "1.2rem"}}>
                            I'm a freelance developer with over 4 years of experience in crafting clean, high-performance, and user-friendly websites and software. I also build custom Bash scripts for Linux environments and have expertise in developing advanced tools like remote desktop utilities for specialized use cases.
                        </p>
                    </section>

                    <section className="skills">
                        <h2>What I Can Do</h2>
                        <ul style={{color: "white", fontFamily: '"Roboto Slab", serif', fontSize: "1.2rem"}}>
                            <li>✅ Responsive + Dynamic Website Development</li>
                            <li>✅ Custom Landing Page Development</li>
                            <li>✅ Static Portfolio Site</li>
                            <li>✅ Softwares or Desktop Application</li>
                            <li>✅ Linux Scripts</li>
                            <li>✅ Remote-Desktop Spywares</li>
                        </ul>
                    </section>

                    <section className="contact">
                        <h2>Work With Me</h2>
                        <div className='entry_form'>
                            <input type="text" name="name" placeholder="Your Name" onChange={this.onChangeName} required />
                            <input type="email" name="email" placeholder="Your Email" onChange={this.onChangeGmail} required />
                            <textarea name="message" placeholder="Tell me about your project..." onChange={this.onChangeAboutProject} required></textarea>
                            <button className="submit_hire_application" onClick={this.onSubmitHireApplication}>Send Request {this.state.loader}</button>
                        </div>
                    </section>
                </div>
            </div>
        )
    }
}
