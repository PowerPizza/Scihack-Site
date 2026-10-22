import React, { Component } from 'react'
import './projectCard.css'
import { MediaImageXmark, ThumbsDown, ThumbsUp } from 'iconoir-react'
import { Link } from 'react-router-dom'

export default class ProjectCard extends Component {
  render() {
    let {p_thumbnail, p_title, p_desc, project_id, p_likes, p_dislikes} = this.props;

    return (
      <div className='project_card'>
        <div className='card_in'>
          <div className='preview_area'>
            {p_thumbnail ? 
            <iframe src={`https://drive.google.com/file/d/${p_thumbnail}/preview?usp=drivesdk`} className='image_preview_' title='project-view_fr' allowFullScreen></iframe>
            : 
            <MediaImageXmark width={100} height={100} color='#454545' />
            }
          </div>
          <div className='info_area'>
            <div style={{display: "flex", flexDirection: "column", overflow: "auto"}}>
              <span className='project_title'>{p_title}</span>
              {/* <span className='project_desc'>{p_desc.length >= 65 ? p_desc.substring(0, 55)+" ....." : p_desc}</span> */}
              <span className='project_desc'>{(p_desc ?? "").slice(0, 312)}...</span>
            </div>
            <div className='social_info'>
                <span>
                <ThumbsUp width={25} height={25} className='lkds_btn' color='#00def9' />
                </span>
                <span style={{fontSize: "1rem", color: '#00def9'}}>{p_likes}</span>
                <span>
                <ThumbsDown width={25} height={25} className='lkds_btn' color='#00def9' />
                </span>
                <span style={{fontSize: "1rem", color: '#00def9'}}>{p_dislikes}</span>
              <Link to={`/project_view?pid=${project_id}`} style={{marginLeft: "auto"}}>
                <button className='more_btn'>Details...</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

ProjectCard.defaultProps = {
  p_title: "No title",
  p_desc: "No description",
  p_likes: 0,
  p_dislikes: 0
}