import { FastArrowLeft, PlusSquare, XmarkCircle } from 'iconoir-react'
import React, { Component } from 'react'
import './addServicePage.css'
import ModernEntry from '../contact_us/ModernEntry';
import LoadingCircle from '../loading_circle/LoadingCircle';


export default class AddServicePage extends Component {
    constructor() {
        super();
        this.state = { service_icon: null, service_icon_url: null, service_title: "", service_desc: "",
             demo_links: [], demo_link_text: null, demo_link_addr: null, running_interval: null,
            uploading_: false}
    }
    onCloseThisWindow = () => {
        this.props.createYesNoPrompt("Form filled on this page will be cleared, do you agree?", () => {
            this.props.closeShowingWin();
            this.props.closeYesNoPrompt();
        }, this.props.closeYesNoPrompt);
    }

    onSelectServiceIcon = () => {
        let file_ = document.createElement("input");
        file_.type = "file";
        file_.accept = "image/svg+xml";
        file_.onchange = () => {
            this.setState({ service_icon: file_.files[0], service_icon_url: URL.createObjectURL(file_.files[0]) });
        }
        file_.click();
    }

    onChangeTitle = (text_) => {
        this.setState({ service_title: text_ });
    }

    onChangeDesc = (ele) => {
        this.setState({ service_desc: ele.target.value });
    }

    onChangeDemoLinkText = (ele) => {
        this.setState({ demo_link_text: ele.target.value });
    }

    onChangeDemoLinkAddr = (ele) => {
        this.setState({ demo_link_addr: ele.target.value });
    }

    onAddDemoLink = () => {
        if (!this.state.demo_link_text || !this.state.demo_link_addr){
            this.props.createMessageBox("Both entries for link are required.", "error");
            return;
        }
        let links_ = this.state.demo_links;
        links_.push({ text: this.state.demo_link_text, addr: this.state.demo_link_addr });
        this.setState({ demo_links: links_ });
    }
    onRemoveDemoLink = (idx_) => {
        let links_ = this.state.demo_links;
        links_.splice(idx_, 1);
        this.setState({ demo_links: links_ });
    }

    onSubmitService = async ()=>{
        let to_send = {
            "service_title": this.state.service_title,
            "service_desc": this.state.service_desc,
            "demo_links": this.state.demo_links,
            "service_icon":await this.state.service_icon.text()
        }
        this.setState({uploading_: true});
        let http_resp = await fetch("/add_service", {method: "POST", body: JSON.stringify(to_send)});
        http_resp = JSON.parse(await http_resp.text());
        if (http_resp["status"] === "success"){
            this.props.createMessageBox("New service added successfully.", "success");
        }
        else{
            this.props.createMessageBox(`Failed to add service - error : ${http_resp["error"]}`, "error");
        }
        this.setState({uploading_: false});
    }

    componentDidMount(){;
        this.setState({service_title: localStorage.getItem("service_title") ?? "", service_desc: localStorage.getItem("service_desc") ?? ""});
        if (localStorage.getItem("service_demolinks")){
            this.setState({demo_links: JSON.parse(localStorage.getItem("service_demolinks"))["links"] });
        }
        const backup_state = ()=>{
            localStorage.setItem("service_title", this.state.service_title);
            localStorage.setItem("service_desc", this.state.service_desc);
            localStorage.setItem("service_demolinks", JSON.stringify({"links": this.state.demo_links}));
        }
        this.setState({running_interval: setInterval(backup_state, 10000)});
    }

    componentWillUnmount(){
        localStorage.clear();
        clearInterval(this.state.running_interval);
    }


    render() {
        return (
            <div className='add_service_main_body'>
                <div className='opt_page_header'>
                    <FastArrowLeft width={35} height={35} color='cyan' className='back_icon' onClick={this.onCloseThisWindow} />
                    <h1>Add Service</h1>
                </div>

                <div className='field_1'>
                    <div className='svg_entry' onClick={this.onSelectServiceIcon}>
                        {this.state.service_icon_url ?
                            <img src={this.state.service_icon_url} className='my_img' alt='Selected file failed to load please select another file.' />
                            :
                            <span style={{ textAlign: 'center' }}>Please select a service icon (svg)</span>
                        }
                    </div>
                    <ModernEntry label_text="Service Title" className="entry service_title" onChange={this.onChangeTitle} defaultValue={this.state.service_title} />
                </div>
                <span style={{ fontFamily: `"Roboto Slab", serif`, fontSize: "1.3rem", marginLeft: "5px" }}>Service Description</span>
                <textarea className='service_desc' onChange={this.onChangeDesc} placeholder='Service description here...' defaultValue={this.state.service_desc}></textarea>
                <br />
                <span style={{ fontFamily: `"Roboto Slab", serif`, fontSize: "1.3rem", marginLeft: "5px" }}>Service Demo</span>
                <div className='service_demos'>
                    <div className='entry_demos'>
                        <input type="text" className='demo_entry link_text' placeholder='Demo link text' onChange={this.onChangeDemoLinkText} />
                        <input type="text" className='demo_entry link' placeholder='Demo link address' onChange={this.onChangeDemoLinkAddr} />
                        <PlusSquare className='btn_add_demo' width={40} height={40} onClick={this.onAddDemoLink} />
                    </div>
                    <div className='demo_link_holder'>
                        {this.state.demo_links.map((itm, idx_) => {
                            return (
                                <div className='demo_link_ele' key={`${idx_}_demo_link_lst`}>
                                    <span>Demo {idx_ + 1} | {itm["text"]} - <a href={itm["addr"]} rel='noreferrer' target='_blank' style={{color: "cyan"}}>{itm["addr"]}</a></span>
                                    <XmarkCircle width={30} height={30} className='remove_demo' color='red' onClick={()=>{this.onRemoveDemoLink(idx_)}} />
                                </div>
                            )
                        })}
                    </div>
                </div>
                {this.state.uploading_ ?
                <button className='normal_btn_b add_service_btn'>Add Service <LoadingCircle width="35" height="35" /></button>
                :
                <button className='normal_btn_b add_service_btn' onClick={this.onSubmitService}>Add Service</button>
                }
            </div>
        )
    }
}
