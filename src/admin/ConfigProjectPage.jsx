import React, { Component } from 'react'
import './configProjectPage.css'
import { BrightStar, FastArrowLeft, Star } from 'iconoir-react'
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

export default class ConfigProjectPage extends Component {
    constructor() {
        super();
        this.state = { projects_list: [], cur_opened_project: null, fetching_projects: true, area_disabler: null, prompt_ys_no: null };
    }

    showInEditingArea = (ele) => {
        this.setState({ cur_opened_project: ele });
    }

    onDeleteProject =  () => {
        let ele = this.state.cur_opened_project;
        const _on_yes = async ()=>{
            this.setState({area_disabler: <UltimateDisabler text_={`Deleting project - ${ele["title"]}`} />, prompt_ys_no: null});
            let http_resp  = await fetch("/delete_project", {method: "POST", body: JSON.stringify(ele)});
            http_resp = JSON.parse(await http_resp.text());
            if (http_resp["status"] === "success"){
                this.props.createMessageBox(`Project ${ele["title"]} with ID ${ele["_id"]} has been successfully deleted!`, "success");
                await this.fetchProjects();
            }
            else{
                this.props.createMessageBox(`Failed to delete project '${ele["title"]}' with ID '${ele["_id"]}'\nError : ${http_resp["error"]}`, "error");
            }
            this.setState({area_disabler: null});
        }
        this.setState({prompt_ys_no: <PromptYesNo msg_={`Do you want to delete this project - '${ele["title"]}' ?`} onYes={_on_yes} onNo={()=>{this.setState({prompt_ys_no: null})}} /> });
    }

    onStarProject = async (_id, is_stared)=>{
        let http_resp = await fetch("/set_project_stared", {method: "POST", body: JSON.stringify({"_id": _id, "stared": !is_stared})});
        http_resp = JSON.parse(await http_resp.text());
        if (http_resp["status"] === "failed"){
            this.props.createMessageBox(`Failed to star project.\nError : ${http_resp["error"]}`, "error");
        }
        this.fetchProjects();
    }

    fetchProjects = async ()=>{
        let http_resp = await fetch("/get_projects", { method: "POST", body: JSON.stringify({ start: 0, end: 10, exclude: ["desc"]}) });
        http_resp = JSON.parse(await http_resp.text());
        this.setState({ projects_list: http_resp["projects"], fetching_projects: false });
    }

    async componentDidMount() {
        this.fetchProjects();
    }
    render() {
        let { closeShowingWin } = this.props;
        return (
            <div className='config_project_body'>
                {this.state.area_disabler}
                <div className='opt_page_header'>
                    <FastArrowLeft width={35} height={35} className='back_icon' onClick={closeShowingWin} />
                    <h1>Config Projects</h1>
                </div>

                <div style={{ display: "flex", padding: "10px", gap: "10px" }}>
                    <div className='project_listing'>
                        <span className='project_list_lbl'>Projects</span>
                        <div className='project_holder'>
                            {this.state.fetching_projects ?
                                <div style={{ margin: "auto" }}><LoadingCircle width="50" height="50" /></div>
                                :
                                !this.state.projects_list.length ?
                                    <span style={{ fontFamily: `"Roboto Slab", serif` }}>No project is available.</span>
                                    :
                                    this.state.projects_list.map((ele, idx_) => {
                                        return (
                                            <div className='project_element' key={`${idx_}_project_ele`} onClick={() => { this.showInEditingArea(ele) }}>
                                                <span>{ele["title"]}</span>
                                                <span style={{marginLeft: "auto", marginRight: "5px"}}>
                                                    {ele["stared"] ? 
                                                    <BrightStar width={20} height={20} style={{marginLeft: "auto", marginRight: "5px"}} fill='cyan' onClick={(eve)=>{this.onStarProject(ele["_id"], ele["stared"] ?? false); eve.stopPropagation();}} />
                                                    :
                                                    <Star width={20} height={20} style={{marginLeft: "auto", marginRight: "5px"}} onClick={(eve)=>{this.onStarProject(ele["_id"], ele["stared"] ?? false);  eve.stopPropagation();}}/>
                                                    }
                                                </span>
                                            </div>
                                        )
                                    })
                            }
                        </div>
                    </div>
                    <div className='config_project_opts'>
                        {this.state.cur_opened_project ?
                            <>
                                <h2 className='config_proj_heading'>Configuration - {this.state.cur_opened_project["title"]}</h2>
                                <div className='btns'>
                                    <button className='normal_btn_b'>Edit</button>
                                    <button className='normal_btn_b red' onClick={this.onDeleteProject}>Delete</button>
                                    <button className='normal_btn_b green' onClick={()=>{window.open(`/project_view?pid=${this.state.cur_opened_project["_id"]}`)}}>View</button>
                                </div>
                                {this.state.prompt_ys_no}
                            </>
                            :
                            <span style={{ fontFamily: `"Roboto Slab", serif`, margin: "auto" }}>No project is currently selected.</span>
                        }
                    </div>
                </div>

            </div>
        )
    }
}
