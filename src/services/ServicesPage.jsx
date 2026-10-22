import React, { Component } from 'react'
import './servicesPage.css'
import { XmarkCircle } from 'iconoir-react';
import { Link } from 'react-router-dom';
import LoadingCircle from '../loading_circle/LoadingCircle';

class DetailedServiceWin extends Component {
    render() {
        let { service_info, device_width, onClose } = this.props;
        return (
            <div className='all_black'>
                <div className='detailed_service_content' style={device_width < 500 ? { width: "auto", height: "auto" } : {}}>
                    <div style={{ display: 'flex' }}>
                        {service_info ?
                            <h1 className='service_heading'>Service - {service_info["service_title"]}</h1>
                            :
                            null
                        }
                        <XmarkCircle width={35} height={35} color='red' style={{ marginLeft: "auto", cursor: "pointer" }} onClick={onClose} />
                    </div>
                    {!service_info ?
                        <div style={{ display: 'flex', alignItems: "center" }}>
                            <LoadingCircle width="45" height="45" />
                        </div>
                        :
                        <>
                            <br/>
                            <div className='desc_box'>
                                <span className='desc lbl'>Description</span>
                                <span className='desc_text'>{service_info["service_desc"]}</span>
                            </div>
                            <div className='demo_content'>
                                <span className='demo lbl'>Demo projects based on this service</span>
                                {service_info["demo_links"].map((ele_, idx_) => {
                                    return (
                                        <button className='demo_btn' key={`${idx_}_demo_link_clickable`}>
                                            <a href={ele_["addr"]} rel='noreferrer' target='_blank' style={{color: "cyan"}}>Demo {idx_+1} | {ele_["text"]}</a>
                                        </button>)
                                })}
                            </div>
                            <div style={{ display: 'flex', alignItems: "center" }}>
                                <Link to={"/hire_me"} className='hire_me_btn'>
                                <span>

                                Hire Me
                                </span>
                                    {/* <button className='hire_me_btn'>Hire Me</button> */}
                                </Link>
                            </div>
                        </>
                    }
                </div>
            </div>
        )
    }
}

class ServiceElement extends Component {
    render() {
        let { service_icon, service_text, onClick } = this.props;
        return (
            <div className='service_ele' onClick={onClick}>
                <div className='service_icon'>
                    <img src={URL.createObjectURL(new Blob([service_icon], { type: "image/svg+xml" }))} alt="service icon" className='service_icon' />
                </div>
                <span className='skill_name'>{service_text}</span>
            </div>
        )
    }
}

export default class ServicesPage extends Component {
    constructor() {
        super();
        this.state = { showDetailedWindow: false, services_list: [], detailed_service: null, is_fetching: true };
    }

    onClickService = async (_id) => {
        this.setState({ showDetailedWindow: true })
        let http_resp = await fetch("/get_service_by_id", { method: "POST", body: JSON.stringify({ "_id": _id }) });
        http_resp = JSON.parse(await http_resp.text());
        if (http_resp["status"] === "success") {
            this.setState({ detailed_service: http_resp["data"] });
        }
        else {
            this.props.createMessageBox(`Failed to load service details.\nError : ${http_resp["error"]}`, "error");
            this.onCloseDetailOfService();
        }
    }

    onCloseDetailOfService = () => {
        this.setState({ detailed_service: null, showDetailedWindow: false });
    }

    async componentDidMount() {
        document.getElementsByClassName("content_and_footer")[0].scrollTo(0, 0);
        this.props.setLoadingBarProgress(30);
        let http_resp = await fetch("/get_services", { method: "POST", body: JSON.stringify({ "exclude": ["service_desc", "demo_links"] }) });
        this.props.setLoadingBarProgress(60);
        http_resp = JSON.parse(await http_resp.text());
        this.setState({ services_list: http_resp["services"], is_fetching: false });
        this.props.setLoadingBarProgress(100);
    }

    render() {
        let { device_width } = this.props;

        return (
            <div className='services_main_body'>
                {this.state.showDetailedWindow ?
                    <DetailedServiceWin device_width={device_width} service_info={this.state.detailed_service} onClose={this.onCloseDetailOfService} />
                    :
                    null
                }
                <div className='per_page_heading services_heading'>
                    <span className='back'>Services</span>
                    <span className='front'>Services</span>
                </div>
                <span className='sub_headings'></span>

                <div className='services_holder'>
                    {!this.state.services_list.length ?
                        this.state.is_fetching ?
                            <LoadingCircle width="45" height="45" />
                            :
                            <span style={{ fontSize: "1.2rem" }}>No services are available yet.</span>
                        :
                        this.state.services_list.map((srvc, idx_) => {
                            return <ServiceElement service_icon={srvc["service_icon"]} service_text={srvc["service_title"]} onClick={() => { this.onClickService(srvc["_id"]) }} key={`${idx_}_service_ele`} />
                        })
                    }
                    {/* <ServiceElement service_icon={<Code width={120} height={120} color='white' />} service_text="Web Developer" />
                    <ServiceElement service_icon={<Tools width={120} height={120} color='white' />} service_text="Custom Software Developer" />
                    <ServiceElement service_icon={<ReportColumns width={120} height={120} color='white' />} service_text="Static Portfolio Site" />
                    <ServiceElement service_icon={<JournalPage width={120} height={120} color='white' />} service_text="Landing Page" />
                    <ServiceElement service_icon={<PageFlip width={120} height={120} color='white' />} service_text="Bash Scripts" /> */}
                </div>

                {!this.state.services_list.length ? null :
                    <section className="additional-services">
                        <h2>Additional Services</h2>
                        <p className="subtext">Beyond custom apps, I offer a range of extra services to boost your digital presence.</p>
                        <div className="services-grid">
                            <div className="service-card">
                                <h3>Well-Commented Code</h3>
                                <p>I write clean, well-commented code so any developer can jump in, understand, and make changes with ease.</p>
                            </div>
                            <div className="service-card">
                                <h3>Daily Progress Reports</h3>
                                <p>I’ll keep you in the loop with daily updates sent to your email or chosen contact, so you always know what’s happening behind the scenes.</p>
                            </div>
                            <div className="service-card">
                                <h3>Comprehensive README</h3>
                                <p>A detailed README file will be provided with the project, explaining its purpose, usage, setup instructions, and everything else you need to know.</p>
                            </div>
                            <div className="service-card">
                                <h3>Free Revisions</h3>
                                <p>Get up to 3 free revisions to ensure the project matches your vision perfectly. Additional changes can be made at a fair cost based on complexity of project.</p>
                            </div>
                            <div className="service-card">
                                <h3>Code Review</h3>
                                <p>I'll analyze your code for issues, performance, and best practices.</p>
                            </div>
                        </div>
                    </section>
                }
            </div>
        )
    }
}
