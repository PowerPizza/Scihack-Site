import { Component } from 'react'
import './servicesPage.css'
import { XmarkCircle } from 'iconoir-react';
import { Link } from 'react-router-dom';
import LoadingCircle from '../loading_circle/LoadingCircle';
import apiClient from '../api/api-client';

class DetailedServiceWin extends Component {
    render() {
        let { service_info, device_width, onClose } = this.props;
        return (
            <div className='all_black'>
                <div className='detailed_service_content' style={device_width < 500 ? { width: "auto", height: "auto" } : {}}>
                    <div style={{ display: 'flex' }}>
                        {service_info ?
                            <h1 className='service_heading'>Service - {service_info.title}</h1>
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
                                <span className='desc_text'>{service_info.description}</span>
                            </div>
                            <div className='demo_content'>
                                <span className='demo lbl'>Demo projects based on this service</span>
                                {service_info.demo_links?.map((ele_, idx_) => {
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
        this.setState({
            showDetailedWindow: true,
            detailed_service: this.state.services_list.find(svc => svc.id == _id)
        });
    }

    onCloseDetailOfService = () => {
        this.setState({ detailed_service: null, showDetailedWindow: false });
    }

    async componentDidMount() {
        document.getElementsByClassName("content_and_footer")[0].scrollTo(0, 0);
        this.props.setLoadingBarProgress(30);
        const services = await apiClient.getServices();
        this.props.setLoadingBarProgress(60);
        this.setState({ services_list: services.services, is_fetching: false });
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
                        this.state.services_list.map((service, idx_) => {
                            return (<ServiceElement
                                        service_icon={service.icon}
                                        service_text={service.title}
                                        onClick={() => { this.onClickService(service.id) }}
                                        key={`${idx_+service.id}_service_ele`} />)
                        })
                    }
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
