import React, { Component } from 'react'
import './experiencePage.css'
import { Link } from 'react-router-dom'
import { Link as LinkIcon} from 'iconoir-react'

class HeadingLink extends Component{
  render(){
    let {heading_id} = this.props;

    return (
      <a href={`${heading_id}`} style={{color: "whitesmoke"}}>
        <LinkIcon width={30} height={30} color='light_gray' className='icon_heading_link'/> 
      </a>
    )
  }
}

export default class ExperiencePage extends Component {
  constructor(){
    super();
    this.state = {};
  }

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
      <div className='exp_main_body'>
        <div className='per_page_heading exp_heading'>
          <span className='back'>Experience</span>
          <span className='front'>Experience</span>
        </div>

        <div className='syntax_container'>
          <div className='info_para'>
            <h2 id='hello_there'><HeadingLink heading_id="#hello_there" /> Hello there! 👋</h2>
            I’m Scihack, a programmer with approximately <b>4.5 years of coding experience</b> Over this time, I’ve experienced many ups and downs in my programming journey.
          </div>
        </div>

        <div className='syntax_container'>
          <div className='info_para'>
            <h2 id='experience_with_languages'><HeadingLink heading_id="#experience_with_languages" /> Experience With Programming Languages 📘</h2>
            <h3>1. Python</h3>
            <p>
              I started my journey with <b>Python</b> as my first programming language. Today, I use it for <b>backend development</b>, <b>software creation</b>, and various <b>testing tasks</b>.
            </p>
            <p>Here are some Python libraries I’m experienced with:</p>
            <ul>
              <li>Tkinter</li>
              <li>Pynput</li>
              <li>MySQL Connector</li>
              <li>Flask</li>
              <li>Flask-SocketIO</li>
              <li>os</li>
              <li>json</li>
              <li>Selenium</li>
              <li>PyDrive</li>
              <li>Pandas</li>
              <li>SocketIO and many more...</li>
            </ul>

            <h3>2. C Programming</h3>
            <p>
              After Python, I learned <b>C</b> because I was eager to understand computers at the microscopic level. Although I now realize that it’s impossible to learn *everything* due to constant advancements, this mindset helped me dive deep.
            </p>
            <p>
              While I haven’t used C much for software development, I’ve used it extensively for <b>microcontroller-based hardware projects</b> (Arduino, ESP32, etc.). I also use C for <b>Data Structures and Algorithms (DSA)</b> practice.
            </p>

            <h3>3. HTML, CSS, JavaScript</h3>
            <p>
              I never followed full tutorials for these languages, but thanks to tons of <b>hands-on practice</b>, I’ve reached a level where I can build applications just as well as any skilled web developer.
            </p>

            <h3>4. React.js</h3>
            <p>
              JavaScript is powerful, but writing modern applications with plain JS often leads to lengthy code. That’s when I shifted to <b>React.js</b>, a JavaScript framework. I primarily use <b>class-based components</b>, and I’m capable of building amazing React apps.
            </p>

            <h3>5. MySQL, MongoDB & JSON</h3>
            <p>
              Databases are the backbone of most applications, so I learned both <b>MySQL</b> and <b>MongoDB</b>. MySQL is great for structured data, but for things like comments or dynamic content, MongoDB is better. Along the way, I also became comfortable with <b>JSON</b> for flexible data handling.
            </p>

            <h3>6. Java</h3>
            <p>
              After developing many websites and desktop apps, I decided to dive into <b>Android development</b>. Since Java is the native language of Android (and closer to the system than Kotlin), I chose it—especially because I love building tools like <b>spyware, malware</b>, and other system-level apps.
            </p>
            <p>
              I’ve developed 5-6 basic Android applications using Java. Unfortunately, due to the major downfall in my coding journey, I had to pause Android development. But I still hope to continue it in the future.
            </p>

            <h3>7. Bash</h3>
            <p>
              During the time I lost access to my PC, I decided to restart from scratch on mobile. I installed Termux and started learning <b>Bash scripting</b>, a powerful tool for Linux development.
            </p>
            <p>
              Bash was the first language I learned in a collaborative way—through discussions, project showcases, and learning together with others in a Discord group.
            </p>
          </div>
        </div>

        <div className='syntax_container'>
          <div className='info_para'>
            <h2 id='effects_of_ai'><HeadingLink heading_id="#effects_of_ai" /> Effects On My Work After AI 🤖</h2>
            I don’t worry much about the idea that AI might take jobs. After all, I’m not planning to stay stuck in a job for too long anyway. However, I can’t deny that AI has caused me some setbacks and continues to do so. That said, it also saves a lot of time, which is invaluable to me.
            If people can copy and use entire code from AI, then what’s wrong with me using it as a search engine? Yes, I often use AI instead of Google to find solutions to my problems. But here’s the drawback:
            When you search on Google, you naturally explore additional information beyond just the solution you’re seeking. With AI, it directly provides answers or explains issues, leaving no room for extra learning. While this is efficient, it’s also a bit sad because I miss out on discovering unexpected knowledge.
            Still, I’m not planning to change this habit. Time has become incredibly precious for me now compared to when I first started coding. Also I generally avoide copying whole code or asking code from AI.
          </div>
        </div>

        {/* <div className='syntax_container'>
          <p className='info_para'>
            <h2>Feature Plans</h2>
          </p>
        </div> */}
      </div>
    )
  }
}
