import React, { Component } from 'react'
import './adminPage.css'
import { KeyframePlusIn, SendDiagonal, Settings, UploadSquare } from 'iconoir-react'
import UploadProjectForm from './UploadProjectForm'
import AdminLoginPanel from './AdminLoginPanel';
import ConfigProjectPage from './ConfigProjectPage';
import PromptYesNo from '../prompt_box/PromptYesNo';
import AddServicePage from './AddServicePage';
import ManageServices from './ManageServices';
import AddSkillPage from './AddSkillPage';
import BlogEditorPage from './BlogEditorPage';
import ManageBlogPage from './ManageBlogPage';

export default class AdminPage extends Component {
    constructor() {
        super();
        this.state = { win_to_show: null, logged_in: false, ys_no_prompt: null }
    }

    openUploadProjectPage = () => {
        this.setState({ win_to_show: <UploadProjectForm createMessageBox={this.props.createMessageBox} closeShowingWin={this.closeShowingWin} createYesNoPrompt={this.createYesNoPrompt} closeYesNoPrompt={this.closeYesNoPrompt} device_width={this.props.device_width} /> });
    }

    openConfigProjectPage = () => {
        this.setState({ win_to_show: <ConfigProjectPage createMessageBox={this.props.createMessageBox} closeShowingWin={this.closeShowingWin} /> });
    }

    openAddServicePage = () => {
        this.setState({ win_to_show: <AddServicePage createMessageBox={this.props.createMessageBox} closeShowingWin={this.closeShowingWin} createYesNoPrompt={this.createYesNoPrompt} closeYesNoPrompt={this.closeYesNoPrompt} /> });
    }

    openConfigServicesPage = () => {
        this.setState({ win_to_show: <ManageServices createMessageBox={this.props.createMessageBox} closeShowingWin={this.closeShowingWin} /> });
    }

    openConfigSkillsPage = () => {
        this.setState({ win_to_show: <AddSkillPage createMessageBox={this.props.createMessageBox} closeShowingWin={this.closeShowingWin} /> });
    }

    openPublishBlogPage = () => {
        this.setState({ win_to_show: <BlogEditorPage createMessageBox={this.props.createMessageBox} closeShowingWin={this.closeShowingWin} /> });
    }

    openManageBlogPage = ()=>{
        this.setState({ win_to_show: <ManageBlogPage createMessageBox={this.props.createMessageBox} closeShowingWin={this.closeShowingWin} /> });
    }

    closeShowingWin = () => {
        this.setState({ win_to_show: null });
    }

    setLoginStatus = (status_) => {
        this.setState({ logged_in: status_ });
    }

    createYesNoPrompt = (msg_, on_yes, on_no) => {
        this.setState({ ys_no_prompt: <PromptYesNo msg_text={msg_} onYes={on_yes} onNo={on_no} /> })
    }
    closeYesNoPrompt = () => {
        this.setState({ ys_no_prompt: null })
    }

    render() {
        if (!this.state.logged_in) {
            return (
                <AdminLoginPanel setLoginStatus={this.setLoginStatus} createMessageBox={this.props.createMessageBox} />
            )
        }

        return (
            <div className='admin_main_body'>
                {this.state.ys_no_prompt}
                {/* <div className='side_bar'>
                
                </div> */}
                {this.state.win_to_show ?
                    this.state.win_to_show
                    :
                    <div className='content'>
                        <span className='sub_cont_heading'>Projects Config</span>
                        <div className='sub_content projects_config'>
                            <div className='upload project_btn' onClick={this.openUploadProjectPage}>
                                <UploadSquare width={60} height={60} />
                                <span>Upload Project</span>
                            </div>

                            <div className='manage project_btn' onClick={this.openConfigProjectPage}>
                                <Settings width={60} height={60} />
                                <span>Manage Project</span>
                            </div>
                        </div>

                        <span className='sub_cont_heading'>Services Config</span>
                        <div className='sub_content projects_config'>
                            <div className='add project_btn' onClick={this.openAddServicePage}>
                                <KeyframePlusIn width={60} height={60} />
                                <span>Add Service</span>
                            </div>

                            <div className='upload project_btn' onClick={this.openConfigServicesPage}>
                                <Settings width={60} height={60} />
                                <span>Manage Service</span>
                            </div>
                        </div>

                        <span className='sub_cont_heading'>Skills Config</span>
                        <div className='sub_content projects_config'>
                            <div className='manage project_btn' onClick={this.openConfigSkillsPage}>
                                <Settings width={60} height={60} />
                                <span>Manage Skills</span>
                            </div>
                        </div>

                        <span className='sub_cont_heading'>Blog Config</span>
                        <div className='sub_content projects_config'>
                            <div className='publish_blog project_btn' onClick={this.openPublishBlogPage}>
                                <SendDiagonal width={50} height={50} />
                                <span>Publish Blog</span>
                            </div>
                            <div className='publish_blog project_btn' onClick={this.openManageBlogPage}>
                                <Settings width={60} height={60} />
                                <span>Manage Blogs</span>
                            </div>
                        </div>
                    </div>
                }
            </div>
        )
    }
}
