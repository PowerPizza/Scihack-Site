import React, { Component } from 'react'
import './manageServices.css'
import { FastArrowLeft } from 'iconoir-react';
import LoadingCircle from '../loading_circle/LoadingCircle';

class UltimateDisabler extends Component {
    render() {
        let {text_} = this.props;
        return (
            <div className='ultimate_disabler'>
                <LoadingCircle width="75" height="75" />
                <span style={{fontFamily: `"Roboto Slab", serif`, fontSize: "1.6rem"}}>{text_}</span>
            </div>
        )
    }
}

class PromptYesNo extends Component {
    render() {
        let {msg_, onYes, onNo} = this.props;

        return (
            <div className='prompt_ys_no'>
                <span className='prompt_msg'>{msg_}</span>
                <div>
                    <button className='normal_btn_b red' onClick={onYes}>Yes</button>
                    <button className='normal_btn_b green' onClick={onNo}>No</button>
                </div>
            </div>
        )
    }
}

export default class ManageServices extends Component {
    constructor() {
        super();
        this.state = { services_list: [], cur_opened_service: null, fetching_services: true, area_disabler: null, prompt_ys_no: null };
    }

    showInEditingArea = (ele) => {
        this.setState({ cur_opened_service: ele });
    }

    onDeleteService = () => {
        let ele = this.state.cur_opened_service;
        const _on_yes = async () => {
            this.setState({ area_disabler: <UltimateDisabler text_={`Deleting service - ${ele["service_title"]}`} />, prompt_ys_no: null });
            let http_resp = await fetch("/delete_service", { method: "POST", body: JSON.stringify(ele) });
            http_resp = JSON.parse(await http_resp.text());
            if (http_resp["status"] === "success") {
                this.props.createMessageBox(`Service ${ele["service_title"]} with ID ${ele["_id"]} has been successfully deleted!`, "success");
                await this.fetchServices();
            }
            else {
                this.props.createMessageBox(`Failed to delete service '${ele["service_title"]}' with ID '${ele["_id"]}'\nError : ${http_resp["error"]}`, "error");
            }
            this.setState({ area_disabler: null });
        }
        this.setState({ prompt_ys_no: <PromptYesNo msg_={`Do you want to delete this service - '${ele["service_title"]}' ?`} onYes={_on_yes} onNo={() => { this.setState({ prompt_ys_no: null }) }} /> });
    }

    fetchServices = async () => {
        let http_resp = await fetch("/get_services", { method: "POST", body: JSON.stringify({ start: 0, end: 10, exclude: ["service_desc", "demo_links", "service_icon"] }) });
        http_resp = JSON.parse(await http_resp.text());
        this.setState({ services_list: http_resp["services"], fetching_services: false });
    }

    async componentDidMount() {
        this.fetchServices();
    }
    render() {
        let { closeShowingWin } = this.props;
        return (
            <div className='config_service_body'>
                {this.state.area_disabler}
                <div className='opt_page_header'>
                    <FastArrowLeft width={35} height={35} className='back_icon' onClick={closeShowingWin} />
                    <h1>Config Services</h1>
                </div>

                <div style={{ display: "flex", padding: "10px", gap: "10px" }}>
                    <div className='service_listing'>
                        <span className='service_list_lbl'>Services</span>
                        <div className='service_holder'>
                            {this.state.fetching_services ?
                                <div style={{ margin: "auto" }}><LoadingCircle width="50" height="50" /></div>
                                :
                                !this.state.services_list.length ?
                                    <span style={{ fontFamily: `"Roboto Slab", serif` }}>No services are available.</span>
                                    :
                                    this.state.services_list.map((ele, idx_) => {
                                        return (
                                            <div className='service_element' key={`${idx_}_service_ele`} onClick={() => { this.showInEditingArea(ele) }}>
                                                <span>{ele["service_title"]}</span>
                                            </div>
                                        )
                                    })
                            }
                        </div>
                    </div>
                    <div className='config_service_opts'>
                        {this.state.cur_opened_service ?
                            <>
                                <h2 className='config_service_heading'>Configuration - {this.state.cur_opened_service["service_title"]}</h2>
                                <div className='btns'>
                                    <button className='normal_btn_b'>Edit</button>
                                    <button className='normal_btn_b red' onClick={this.onDeleteService}>Delete</button>
                                </div>
                                {this.state.prompt_ys_no}
                            </>
                            :
                            <span style={{ fontFamily: `"Roboto Slab", serif`, margin: "auto" }}>No service is currently selected.</span>
                        }
                    </div>
                </div>

            </div>
        )
    }
}
