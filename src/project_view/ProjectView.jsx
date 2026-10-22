import React, { Component } from 'react'
import './projectView.css'
import { ArrowLeft, ArrowRight, FastArrowLeft, PageLeft } from 'iconoir-react'
import LinkElement from './LinkElement'
import { Link, Navigate } from 'react-router-dom'
import LoadingCircle from '../loading_circle/LoadingCircle'

export default class ProjectView extends Component {
  constructor() {
    super();
    this.state = {cur_img_idx: 0, video_playing: false, cur_vdo_idx: 0, project_metadata: null, navigation_: null};
  }

  onImageNext = () => {
    if (this.state.cur_img_idx >= this.state.project_metadata["images"].length - 1) {
      return;
    }
    this.setState({ cur_img_idx: this.state.cur_img_idx + 1 });
  }

  onImagePrev = () => {
    if (this.state.cur_img_idx <= 0) {
      return
    }
    this.setState({ cur_img_idx: this.state.cur_img_idx - 1 });
  }

  onVideoPlayPause = () => {
    if (!this.state.video_playing) {
      document.querySelector("#preview_vdo").play();
    }
    else {
      document.querySelector("#preview_vdo").pause();
    }
    this.setState({ video_playing: !this.state.video_playing });
  }
  onVideoNext = () => {
    if (this.state.cur_vdo_idx >= this.state.project_metadata["videos"].length - 1) {
      return;
    }
    this.setState({ cur_vdo_idx: this.state.cur_vdo_idx + 1 });
  }
  onVideoPrev = () => {
    if (this.state.cur_vdo_idx <= 0) {
      return
    }
    this.setState({ cur_vdo_idx: this.state.cur_vdo_idx - 1 });
  }

  componentDidMount = async ()=>{
    document.getElementsByClassName("content_and_footer")[0].scrollTo(0, 0);
    
    let document_id = (new URLSearchParams(window.location.search)).get("pid");
    if (document_id){
      let http_resp = await fetch("/get_project_by_id", {method: "POST", body: JSON.stringify({"id": document_id})});
      http_resp = JSON.parse(await http_resp.text());
      if (http_resp["status"] === "success"){
        this.setState({project_metadata: http_resp["project"]});
      }
      else{
        this.props.createMessageBox(http_resp["error"], "error")
        this.setState({project_metadata: -1});
      }
    }
  }

  render() {
    if (!this.state.project_metadata || this.state.project_metadata <= 0){
      return (
        <div className='project_view_body'>
          {this.state.navigation_}
          <div style={{margin: "5px", cursor: "pointer"}} onClick={()=>{this.setState({navigation_: <Navigate to={"/projects"}/>})}}>
            <FastArrowLeft width={50} height={50} strokeWidth={2} />
          </div>
          <div style={{margin: "auto", display: "flex", flexDirection: "column", alignItems: "center"}}>
            <LoadingCircle width="80" height="80"/>
            {this.state.project_metadata === -1 ? 
            <span style={{fontSize: "1.4rem", fontFamily: `"Roboto Slab", serif`}} >Oops! Project not found!</span>
            :
            <>
            <span style={{fontSize: "1.6rem", fontFamily: `"Roboto Slab", serif`}}>Loading Projects</span>
            <span style={{fontSize: "1.2rem"}}>Please wait...</span>
            </>
            }
          </div>
        </div>
      )
    }

    let {device_width} = this.props;

    let video_holder_ele = (
      <div className='video_holder'>
        {this.state.project_metadata["videos"].length ? 
        <>
          <iframe className="video_ele" src={`https://drive.google.com/file/d/${this.state.project_metadata["videos"][this.state.cur_vdo_idx]}/preview?usp=drivesdk`} frameborder="0" title='video_view'></iframe>
          <ArrowLeft width={40} height={40} className='arrow left' style={{ marginRight: "auto" }} onClick={this.onVideoPrev} />
          <ArrowRight width={40} height={40} style={{ marginLeft: "auto" }} className='arrow right' onClick={this.onVideoNext} />
          <div className='image_count'>{"⚪".repeat(this.state.cur_vdo_idx) + "🔵" + "⚪".repeat(this.state.project_metadata["videos"].length - 1 - this.state.cur_vdo_idx)}</div>
        </>
        :
        <span style={{margin: "auto"}}>No playable media is available.</span>
        }
        
      </div>
    )
    return (
      <div className='project_view_body'>
        <div className='_heading' style={device_width < 650 ? {flexDirection: "column", alignItems: "normal"} : {}}>
          <Link to={"/projects"}>
            {device_width < 650 ? 
            <PageLeft width={50} height={50} strokeWidth={2} className='back_btn' style={{marginTop: "10px"}}/>
            :
            <PageLeft width={60} height={60} strokeWidth={2} className='back_btn' />
            }
          </Link>
          {device_width < 650 ? 
          <hr style={{width: "100%", backgroundColor: "cyan", marginTop: "-5px"}}/>
          : null}
          <h1 style={device_width < 650 ? {marginTop: "-15px"} : {}}>{this.state.project_metadata["title"]}</h1>
        </div>
        <div className='content1'>
          <div className='image_holder'>
            {this.state.project_metadata["images"].length ? 
            <>
              <iframe className="image_ele" src={`https://drive.google.com/file/d/${this.state.project_metadata["images"][this.state.cur_img_idx]}/preview?usp=drivesdk`} frameborder="0" title='image_view'></iframe>
              <div className='control_arrows'>
                <ArrowLeft width={40} height={40} className='arrow left' onClick={this.onImagePrev} />
                <ArrowRight width={40} height={40} style={{ marginLeft: "auto" }} className='arrow right' onClick={this.onImageNext} />
              </div>
              <div className='image_count'>{"⚪".repeat(this.state.cur_img_idx) + "🔵" + "⚪".repeat(this.state.project_metadata["images"].length - 1 - this.state.cur_img_idx)}</div>
            </>
            :
            <span style={{margin: "auto"}}>No sample images are available.</span>
            }
            
          </div>
          {device_width > 650 ? video_holder_ele: null}
        </div>
        <div className='desc_holder'>
          <label htmlFor="desc" className='desc_lbl'>Description</label>
          <span name='desc' className='desc_cont'>
            {this.state.project_metadata["desc"]}
          </span>
        </div>
        <div className='content1'>
          {device_width < 650 ? video_holder_ele: null}
        </div>
        <div className='link_holder'>
          <label htmlFor="links" className='link_lbl'>Links</label>
          {
            this.state.project_metadata["links"].map((values) => {
              return <LinkElement link_href={values["link"]} link_text={values["text"]} key={Math.random() * 10000} />
            })
          }
        </div>
      </div>
    )
  }
}
