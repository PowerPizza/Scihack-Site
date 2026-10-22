import { Component } from 'react'
import './App.css'
import Header from './header/Header'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import HomePage from './home/HomePage';
import SkillsPage from './skills/SkillsPage';
import Footer from './footer/Footer';
import ExperiencePage from './experience/ExperiencePage';
import ContactUs from './contact_us/ContactUs';
import ProjectPage from './projects/ProjectPage';
import ProjectView from './project_view/ProjectView';
import AdminPage from './admin/AdminPage';
import MessageBox from './message_box/MessageBox';
import HireMePage from './hire_me/HireMePage';
import ServicesPage from './services/ServicesPage';
import AboutMePage from './about_me/AboutMePage';
import NotFoundPage from './error_404/NotFoundPage';
import UserLoginPage from './user_login_signup/UserLoginPage';
import UserSignupPage from './user_login_signup/UserSignupPage';
import ManageAccountPage from './manage_account/ManageAccountPage';
import BirthdayWish from './happy_bday/BirthdayWish';
import LoadingBar from 'react-top-loading-bar';
import BlogPage from './blog/BlogPage';
import BlogPreviewPage from './blog/BlogPreviewPage';

export default class App extends Component {
  constructor() {
    super();
    
    window.onload = ()=>{
      window.google.accounts.id.initialize({
        client_id: "574610354896-pb4e49p13bnmocd3rkm4kiuhuk3ikioe.apps.googleusercontent.com",
        callback: this.google_signin_handle
      });
    }

    this.state = { rightMenuOpened: false, device_width: window.innerWidth, rightBarAnim: null, message_box: null,
      loaded_projects: {}, is_logged_in: null, loading_bar_progress: 0, login_creds: null, is_bday: false};
  }

  toggleRightMenu = () => {
    if (this.state.rightMenuOpened) {
      this.setState({ rightBarAnim: "rightbar_colapse_anim 0.4s" });
      setTimeout(() => {
        this.setState({ rightMenuOpened: false, rightBarAnim: null });
      }, 350);
    }
    else {
      this.setState({ rightMenuOpened: true });
    }
  }

  createMessageBox = (msg_, type_)=>{
    this.setState({message_box: <MessageBox msg_text={msg_} msg_type={type_} />});
    setTimeout(()=>{this.setState({message_box: null})}, 5000);
  }

  saveLoadedProjects = (projects_)=>{
    this.setState({loaded_projects: projects_})
  }

  setLoadingBarProgress = (prog)=>{
    this.setState({loading_bar_progress: prog});
  }

  closeBdayWishWin = ()=>{
    this.setState({is_bday: false});
  }

  google_signin_handle = async (response)=>{
    // Handles google signin response when user selects there account.
    if (!response || !response.credential) return;
    let http_resp = await fetch("/login_with_google", {method: "POST", body: response.credential});
    http_resp = JSON.parse(await http_resp.text());
    if (http_resp["status"] === "failed" && http_resp["error"] === "MANUAL_ACCOUNT_DETECTED") {
      this.createMessageBox("Account already registered with a password. Please sign in manually or use a different google account.", "error");
    }
    else if (http_resp["status"] === "success") {
      window.location.href = "/";
    }
    else {
      this.createMessageBox("Failed! error : "+http_resp["error"], "error");
    }
  }

  async componentDidMount() {
    this.setState({ device_width: window.innerWidth });
    window.onresize = () => {
      this.setState({ device_width: window.innerWidth });
    }

    let http_resp = await fetch("/login/get_creds", {method: "POST"})
    http_resp = JSON.parse(await http_resp.text());
    if (http_resp["status"] === "success"){
      let today_ = new Date();
      let bday = new Date(http_resp["dob"]);
      if (today_.getDate() === bday.getDate() && today_.getFullYear() === bday.getFullYear() && today_.getMonth() === bday.getMonth()){
        this.setState({is_bday: true});
      }
      this.setState({is_logged_in: true, login_creds: http_resp});
    }
  }

  render() {
    return (
      <Router>
        {this.state.message_box}
        <LoadingBar height={2} color='cyan' progress={this.state.loading_bar_progress} />
        <div className='main_body'>
          {this.state.is_bday ? 
          <BirthdayWish name={this.state.login_creds["user_name"]} device_width={this.state.device_width} on_close_={this.closeBdayWishWin} />
          : null}
          <Header toggleRightMenu={this.toggleRightMenu} device_width={this.state.device_width} is_logged_in={this.state.is_logged_in} />
          {this.state.rightMenuOpened ?
            <div className='right_bar' style={{ animation: this.state.rightBarAnim }} onMouseDown={() => { setTimeout(this.toggleRightMenu, 100) }}>
              <Link to={"/"} className='opt_name'>Home</Link>
              <Link to={"/skills"} className='opt_name'>Skills</Link>
              <Link to={"/projects"} className='opt_name'>Projects</Link>
              <Link to={"/blog"} className='opt_name'>Blog</Link>
              <Link to={"/experience"} className='opt_name'>Experience</Link>
              <Link to={"/services"} className='opt_name'>Services</Link>
              <Link to={"/about_me"} className='opt_name'>About me</Link>
              <Link to={"/contact"} className='opt_name'>Contact</Link>
              {this.state.is_logged_in ? 
              <Link to={"/manage_account"} className='opt_name'>My Account</Link>
              :
              <>
              <Link to={"/login"} className='opt_name'>Login</Link>
              <Link to={"/signup"} className='opt_name'>Signup</Link>
              </>
              }
            </div> : null}

          <div className='content_and_footer'>
            <Routes>
              <Route path='*' element={<NotFoundPage />} />
              <Route path='/' element={<HomePage device_width={this.state.device_width} />} />
              <Route path='/skills' element={<SkillsPage device_width={this.state.device_width} setLoadingBarProgress={this.setLoadingBarProgress} />} />
              <Route path='/projects' element={<ProjectPage device_width={this.state.device_width} saveLoadedProjects={this.saveLoadedProjects} loaded_projects={this.state.loaded_projects} setLoadingBarProgress={this.setLoadingBarProgress} />} />
              <Route path='/experience' element={<ExperiencePage />} />
              <Route path='/contact' element={<ContactUs device_width={this.state.device_width} createMessageBox={this.createMessageBox} />} />
              <Route path='/project_view' element={<ProjectView device_width={this.state.device_width} createMessageBox={this.createMessageBox} />} />
              <Route path='/administrator' element={<AdminPage createMessageBox={this.createMessageBox} device_width={this.state.device_width} />} />
              <Route path='/hire_me' element={<HireMePage device_width={this.state.device_width} createMessageBox={this.createMessageBox} />} />
              <Route path='/services' element={<ServicesPage device_width={this.state.device_width} createMessageBox={this.createMessageBox} setLoadingBarProgress={this.setLoadingBarProgress}  />} />
              <Route path='/about_me' element={<AboutMePage device_width={this.state.device_width} createMessageBox={this.createMessageBox} />} />
              <Route path='/login' element={<UserLoginPage device_width={this.state.device_width} createMessageBox={this.createMessageBox} is_logged_in={this.state.is_logged_in} google_signin_handle={this.google_signin_handle} />} />
              <Route path='/signup' element={<UserSignupPage device_width={this.state.device_width} createMessageBox={this.createMessageBox} is_logged_in={this.state.is_logged_in} />} />
              <Route path='/manage_account' element={<ManageAccountPage device_width={this.state.device_width} createMessageBox={this.createMessageBox} is_logged_in={this.state.is_logged_in} setLoadingBarProgress={this.setLoadingBarProgress} />} />
              <Route path='/blog' element={<BlogPage device_width={this.state.device_width} createMessageBox={this.createMessageBox} is_logged_in={this.state.is_logged_in} setLoadingBarProgress={this.setLoadingBarProgress} loginCreds={this.state.login_creds} />} />
              <Route path='/blog_preview' element={<BlogPreviewPage device_width={this.state.device_width} createMessageBox={this.createMessageBox} is_logged_in={this.state.is_logged_in} setLoadingBarProgress={this.setLoadingBarProgress} />} />
            </Routes>
            <Footer device_width={this.state.device_width} />
          </div>
        </div>
      </Router>
    )
  }
}
