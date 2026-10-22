import { Component } from 'react'
import './aboutMePage.css'
import { MailSolid, MapPin } from 'iconoir-react'
import whoAmIIcon from '../icons/others/who_am_i.png'
import myGoalsIcon from '../icons/others/my_goals.jpeg'
import myValuesIcon from '../icons/others/my_values.png'


export default class AboutMePage extends Component {
    componentDidMount(){
        document.getElementsByClassName("content_and_footer")[0].scrollTo(0, 0);
        let hsh = window.location.hash;
        if (hsh){
          let ele = document.getElementById(hsh.slice(1));
          ele.scrollIntoView({behavior: "smooth"});
        }
      }

    render() {
        return (
            <div className='about_me_main_body'>
                <div className='per_page_heading about_me_heading'>
                    <span className='back'>About Me</span>
                    <span className='front'>About Me</span>
                </div>
                <div className='about-content'>
                    <div className='info-box-half' style={{backgroundImage: `url('${whoAmIIcon}')`}}>
                        <h2 className='info-heading'>Who Am I?</h2>
                        <span className='info-text'>I am programmer.</span>
                    </div>
                    <div className='info-box-half' style={{backgroundImage: `url('${myGoalsIcon}')`}}>
                        <h2 className='info-heading'>What are my goals?</h2>
                        <span className='info-text'>I want to build my own AI model and start my own tech company someday.</span>
                    </div>
                    <div className='info-box-full' style={{backgroundImage: `url('${myValuesIcon}')`, backgroundSize: "100% 130%"}}>
                        <h2 className='info-heading'>My Values</h2>
                        <span className='info-text'>Independence, Loyal Friends, Coding are my values.</span>
                        <h2 className='info-heading get-in-touch'>Get In Touch</h2>
                        <div className='info-get-in-touch'>
                            <span><MailSolid width={30} height={30} color='cyan' /> scihack.offical@gmail.com</span>
                            <span><MapPin width={30} height={30} color='black' fill='cyan' /> Ghaziabad Uttar Pradesh, India</span>
                        </div>
                    </div>
                    <div className='info-box-full'>
                        <h2 className='info-heading'>My Achievement</h2>
                        <span className='info-text'>4 Month experience in software development internship.</span>
                    </div>
                </div>
            </div>
        )
    }
}
