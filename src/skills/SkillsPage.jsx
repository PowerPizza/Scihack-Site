import { Component } from 'react'
import './skillsPage.css'
import SkillElement from './SkillElement'
import LoadingCircle from '../loading_circle/LoadingCircle';

export default class SkillsPage extends Component {
  constructor(){
    super();
    this.state = {skills_list: [], is_loading_skills: false}
  }
  async componentDidMount(){
    document.getElementsByClassName("content_and_footer")[0].scrollTo(0, 0);
    this.props.setLoadingBarProgress(30);
    this.setState({is_loading_skills: true});
    let http_resp = await fetch("api/v1/skills", {method: "GET"});
    this.props.setLoadingBarProgress(60);
    http_resp = await http_resp.json();
    this.props.setLoadingBarProgress(100);
    this.setState({skills_list: http_resp.skills, is_loading_skills: false});
  }
  
  render() {
    let {device_width} = this.props;

    return (
      <div className='skillPage_main_body'>
        <div className='per_page_heading skills_heading'>
          <span className='back'>Skills</span>
          <span className='front'>My Skills</span>
        </div>
        <span className='sub_headings'></span>
        <div className='skill_holder' style={device_width < 550 ? {gridTemplateColumns: "1fr"} : {width: "99%"}}>
          {this.state.is_loading_skills ? 
          <div style={{marginLeft: "auto", marginRight: "auto", gridColumnStart: "1", gridColumnEnd: "3"}}>
            <LoadingCircle width="45" height="45" /> 
          </div>
          :
          this.state.skills_list?.length ? 
          this.state.skills_list.map((skill_obj, idx_)=>{
            return <SkillElement
                      skill_name={skill_obj.title}
                      percentage={skill_obj.percentage}
                      skill_desc={skill_obj.description}
                      key={`${idx_}_skill_element_cli`} />
          })
          :
          <span style={{marginLeft: "auto", marginRight: "auto", gridColumnStart: "1", gridColumnEnd: "3"}}>No skills are available yet!</span>
          }
        </div>
      </div>
    )
  }
}
