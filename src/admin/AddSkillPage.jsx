import React, { Component } from 'react'
import './addSkillPage.css'
import { EditPencil, FastArrowLeft, PlusSquare, XmarkCircle } from 'iconoir-react'
import ModernEntry from '../contact_us/ModernEntry';
import LoadingCircle from '../loading_circle/LoadingCircle';
import PromptYesNo from '../prompt_box/PromptYesNo';

class EditSkillPrompt extends Component {
    constructor(){
        super();
        this.state = {new_title: "", new_percentage: "", new_desc: "", saving_: false}
    }

    on_change_title = (val)=>{
        this.setState({new_title: val});
    }
    
    on_change_percentage = (val)=>{
        this.setState({new_percentage: val});
    }

    on_change_desc = (ele)=>{
        this.setState({new_desc: ele.target.value});
    }

    on_save_changes = async ()=>{
        if (this.state.new_title === this.props.default_title && this.state.new_percentage === this.props.default_percentage && this.state.new_desc === this.props.default_description){
            this.props.createMessageBox("Can't update skill due to no change detected!", "error");
            return;
        }
        this.setState({saving_: true});
        let http_resp = await fetch("/edit_skills", {method: "POST", body: JSON.stringify({"skill_id": this.props.skill_id, "new_title": this.state.new_title, "new_percentage": this.state.new_percentage, "new_desc": this.state.new_desc})});
        http_resp = JSON.parse(await http_resp.text());
        if (http_resp["status"] === "success"){
            this.props.createMessageBox("Data updated successfully.", "success");
            this.props.reload_skills_list();
            this.props.on_close_prompt();
        }
        else if (http_resp["status"] === "failed"){
            this.props.createMessageBox(`Failed to update skill.\nError : ${http_resp["error"]}`, "error");
        }
        else {
            this.props.createMessageBox(`Failed to update skill.\nError : Unknown error`, "error");
        }
        this.setState({saving_: false});
    }

    componentDidMount = ()=>{
        this.setState({new_title: this.props.default_title, new_percentage: this.props.default_percentage, new_desc: this.props.default_description});
    }

    render(){
        let {skill_id, default_title, default_percentage, default_description} = this.props;
        return (
            <div className='edit_skill_prompt disabled'>
                <div className='edit_skill_prompt content'>
                    <h3 className='edit_skill_heading'>Edit Skill <XmarkCircle width={25} height={25} color='red' className='close_btn' onClick={this.props.on_close_prompt}/></h3>
                    <span className='skill_id'>Object ID : {skill_id}</span>
                    <ModernEntry label_text="Skill Title" className="edit_skill_entry" defaultValue={default_title} onChange={this.on_change_title} />
                    <ModernEntry label_text="Skill Percentage" className="edit_skill_entry" defaultValue={default_percentage} onChange={this.on_change_percentage} />
                    <textarea className='edit_skill_entry skill_desc' placeholder='Skill description...' onChange={this.on_change_desc} defaultValue={default_description}></textarea>
                    <button className='edit_btn btn_aqua' onClick={this.on_save_changes}>
                        {!this.state.saving_ ? "Save" : <><LoadingCircle width="25" height="25" /> Saving...</> }
                    </button>
                </div>
            </div>
        )
    }
}

class SkillBoxElement extends Component {
    constructor(){
        super();
        this.state = {is_deleting: false}
    }

    onDeleteSkill = ()=>{
        const on_yes = async ()=>{
            this.props.set_delete_prompt(null);
            this.setState({is_deleting: true});
            let http_resp = await fetch("/delete_skill", {method: "POST", body: JSON.stringify({"skill_id": this.props.skill_id})});
            http_resp = JSON.parse(await http_resp.text());
            if (http_resp["status"] === "success"){
                this.props.createMessageBox("Skill deleted successfully.", "success");
                this.props.request_skill_list();
            }
            else if (http_resp["status"] === "failed"){
                this.props.createMessageBox(`Failed to delete skill.\nError : ${http_resp["error"]}`, "error");
            }
            else{
                this.props.createMessageBox(`Failed to delete skill.`, "error");
            }
            this.setState({is_deleting: false});
        }
        this.props.set_delete_prompt(<PromptYesNo msg_text="Do you really want to delete this skill?" onYes={on_yes} onNo={()=>{this.props.set_delete_prompt(null)}} />)
    }

    onEditSkill = ()=>{
        this.props.on_edit_skill(this.props.skill_id, this.props.skill_title, this.props.skill_percentage, this.props.skill_desc);
    }

    render(){
        let {skill_title, skill_percentage} = this.props;
        return (
            <div className='skill_box_element'>
                <span className='skill_title'><span className='percentage'>{skill_percentage}%</span>{skill_title}</span>
                {this.state.is_deleting ? 
                <LoadingCircle width="30" height="30" style={{marginLeft: "auto", cursor: "pointer"}} />
                :
                <XmarkCircle width={30} height={30} color='red' style={{marginLeft: "auto", cursor: "pointer"}} onClick={this.onDeleteSkill} />
                }
                <EditPencil width={30} height={30} color='lime' style={{marginLeft: "auto", cursor: "pointer"}} onClick={this.onEditSkill} />
            </div>
        )
    }
}

export default class AddSkillPage extends Component {
    constructor(){
        super();
        this.state = {skill_title: "", skill_percentage: "", skill_desc: "", skills_list: [], is_loading: false, is_adding: false,
             edit_skill_prompt: null, delete_skill_prompt: null};
    }

    onChangeSkillTitle = (val)=>{
        this.setState({skill_title: val});
    }
    
    onChangeSkillPercentage = (val)=>{
        this.setState({skill_percentage: val});
    }
    
    onChangeSkillDesc = (ele)=>{
        this.setState({skill_desc: ele.target.value});
    }

    onAddSkill = async ()=>{
        let to_send = {
            "skill_title": this.state.skill_title,
            "skill_percentage": this.state.skill_percentage,
            "skill_desc": this.state.skill_desc
        }
        if (!this.state.skill_title || !this.state.skill_percentage){
            this.props.createMessageBox(`Please fill all entries.`, "error");
            return;
        }
        if (Number.isNaN(Number(this.state.skill_percentage))){
            this.props.createMessageBox(`Invalid value for skill percentage, it should be an integer within 0 to 100`, "error");
            return;
        }
        if (Number(this.state.skill_percentage) < 0 || Number(this.state.skill_percentage) > 100){
            this.props.createMessageBox(`Invalid value for skill percentage, it should be in range 0 to 100`, "error");
            return;
        }
        this.setState({is_adding: true});
        let http_resp = await fetch("/add_skill", {method: "POST", body: JSON.stringify(to_send)});
        http_resp = JSON.parse(await http_resp.text());
        if (http_resp["status"] === "success"){
            this.props.createMessageBox("Skill added successfully!", "success");
            this.request_skill_list();
        }
        else if (http_resp["status"] === "failed"){
            this.props.createMessageBox(`Failed to add skill.\nError : ${http_resp["error"]}`, "error");
        }
        else{
            this.props.createMessageBox(`Failed to add skill.`, "error");
        }
        this.setState({is_adding: false});
    }

    onEditSkill = (skill_id, default_title, default_percentage, default_description)=>{
        this.setState({skill_desc: default_description});
        this.setState({edit_skill_prompt: <EditSkillPrompt skill_id={skill_id} default_title={default_title} default_percentage={default_percentage} default_description={default_description} createMessageBox={this.props.createMessageBox} on_close_prompt={()=>{this.setState({edit_skill_prompt: null})}} reload_skills_list={this.request_skill_list}/>})
    }

    request_skill_list = async ()=>{
        this.setState({is_loading: true});
        let http_resp = await fetch("/get_skills", {method: "POST"});
        http_resp = JSON.parse(await http_resp.text());
        this.setState({skills_list: http_resp["skills"], is_loading: false});
    }

    set_delete_prompt = (del_prompt)=>{
        this.setState({delete_skill_prompt: del_prompt});
    }
    
    componentDidMount() {
        document.getElementsByClassName("content_and_footer")[0].scrollTo(0, 0);
        this.request_skill_list();
    }

    render() {
        let { closeShowingWin, createMessageBox } = this.props;
        return (
            <div className='manage_skill_main_body'>
                {this.state.delete_skill_prompt}
                {this.state.edit_skill_prompt}

                <div className='opt_page_header'>
                    <FastArrowLeft width={35} height={35} color='cyan' className='back_icon' onClick={closeShowingWin} />
                    <h1>Manage Skills</h1>
                </div>
                <div className='add_skill'>
                    <ModernEntry label_text={"skill title"} className="entry skill_title" onChange={this.onChangeSkillTitle} />
                    <ModernEntry label_text={"skill percentage"} className="entry skill_perc" onChange={this.onChangeSkillPercentage} />
                    <textarea className='entry skill_desc' placeholder='Skill description...' onChange={this.onChangeSkillDesc}></textarea>
                    {this.state.is_adding ? 
                    <LoadingCircle width="35" height="35" />
                    :
                    <PlusSquare width={35} height={35} color='white' className='add_btn' onClick={this.onAddSkill} />
                    }
                </div>
                <div className='skill_list'>
                    {this.state.is_loading ? 
                    <div style={{marginLeft: "auto", marginRight: "auto"}}>
                        <LoadingCircle width="35" height="35" />
                    </div>
                    :
                    null}
                    {this.state.skills_list.map((ele, idx_)=>{
                        return <SkillBoxElement set_delete_prompt={this.set_delete_prompt} createMessageBox={createMessageBox} skill_id={ele[0]} skill_title={ele[1]} skill_percentage={ele[2]} skill_desc={ele[3]} request_skill_list={this.request_skill_list} on_edit_skill={this.onEditSkill} key={`${idx_}_skill_box_ele`} />
                    })}
                </div>
            </div>
        )
    }
}
