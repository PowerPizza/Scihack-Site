import { Component } from 'react'
import './projectPage.css'
import ProjectCard from './ProjectCard'
import apiClient from '../api/api-client';

export default class ProjectPage extends Component {
  constructor() {
    super();
    this.state = { fetch_amount: 10, existing_categories: [] }
  }

  load_project_categories = async () => {
    const resp = await apiClient.getProjectCategories();
    if (resp.status === 'OK') {
      this.setState({ existing_categories: resp.categories });
    }
  }

  componentDidMount = async () => {
    document.getElementsByClassName("content_and_footer")[0].scrollTo(0, 0);
    this.props.setLoadingBarProgress(30);

    if (this.props.loaded_projects && this.props.loaded_projects.length) {
      this.props.setLoadingBarProgress(100);
      return;
    }

    await this.load_project_categories();

    const project_resp = await apiClient.getProjects();
    this.props.setLoadingBarProgress(60);
    if (project_resp.status !== 'OK') {
      // Handle here..
    }

    let project_cards = {"starred": []};
    project_resp.projects.forEach((project, idx) => {
      let renderable = <ProjectCard
                          p_thumbnail={project?.thumbnail_id}
                          p_title={project?.title}
                          p_desc={project?.description}
                          project_id={project?.id}
                          p_likes={project?.likes}
                          p_dislikes={project?.dislikes}
                          key={`${idx}_project_card_ele`} />
      if (project?.stared){
        project_cards.starred.push(renderable);
      }
      if (!(project_cards[project?.category] ?? false)){
        project_cards[project?.category] = [];
      }
      project_cards[project?.category].push(renderable);
    });

    this.props.saveLoadedProjects(project_cards);
    this.props.setLoadingBarProgress(100);
  }

  render() {
    let { device_width } = this.props;
    let grid_layout_cols = ""
    if (device_width < 570) {
      grid_layout_cols = "repeat(1, 1fr)"
    }
    else if (device_width < 875) {
      grid_layout_cols = "repeat(2, 1fr)"
    }
    else if (device_width < 1150) {
      grid_layout_cols = "repeat(3, 1fr)"
    }
    else {
      grid_layout_cols = "repeat(4, 1fr)"
    }

    console.log(this.props.loaded_projects);

    return (
      <div className='projects_main_body'>
        <div className='per_page_heading _heading'>
          <h1 className='back'>Projects</h1>
          <h1 className='front'>Projects</h1>
        </div>

        <div className={`category stared`}>
          <span className='category_name' style={device_width >= 700 ? {} : { textAlign: "center" }}>Starred 🌟</span>
          <div className='cards_holder' style={{ margin: device_width >= 700 ? "0 20px 0 20px" : "", gridTemplateColumns: grid_layout_cols }} >
            {this.props.loaded_projects["starred"]}
          </div>
        </div>

        {this.state.existing_categories.map((ele, idx) => {
          return (
            <div className={`category number_${idx + 1}`} key={"category_area_" + idx}>
              <span className='category_name' style={device_width >= 700 ? {} : { textAlign: "center" }}>{ele}</span>
              <div className='cards_holder' style={{ margin: device_width >= 700 ? "0 20px 0 20px" : "", gridTemplateColumns: grid_layout_cols }} >
                {this.props.loaded_projects[ele]}
              </div>
            </div>
          )
        })}

        {/* <div className='category one'>
          <span className='category_name' style={device_width >= 700 ? {} : {textAlign: "center"}}>Category 1</span>
          <div className='cards_holder' style={{ margin: device_width >= 700 ? "0 20px 0 20px" : "", gridTemplateColumns: grid_layout_cols }} >
            {this.props.loaded_projects.length ? this.props.loaded_projects :
              <div style={{ margin: "auto", position: "absolute" }}>
                <LoadingCircle width="50" height="50" />
              </div>
            }
          </div>
        </div> */}
      </div>
    )
  }
}
