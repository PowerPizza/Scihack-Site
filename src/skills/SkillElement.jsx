import React, { Component } from 'react'
import './skillElement.css'
import { NavArrowDown, NavArrowUp } from 'iconoir-react';

export default class SkillElement extends Component {
    constructor(){
        super();
        this.state = {read_more: false};
    }

    on_read_more = ()=>{
        this.setState({read_more: true});
    }

    on_read_less = ()=>{
        this.setState({read_more: false});
    }


    render() {
        let {skill_name, percentage, skill_desc} = this.props;
        return (
            <div className='skill_ele_main_body'>
                <div className='texts' style={{ width: `${percentage}%` }}>
                    <span>{skill_name}</span>
                    <span style={{ marginLeft: "auto" }}>{percentage}%</span>
                </div>
                <div className='bar_track'>
                    <div className='bar_filler' style={{ width: `${percentage}%`, transition: "1s linear"}}></div>
                </div>
                {this.state.read_more ? 
                <span className='read_more_btn' onClick={this.on_read_less}><u>Read less</u> <NavArrowUp width={20} height={20} color='cyan' style={{marginTop: "3px"}}/></span>
                :
                <span className='read_more_btn' onClick={this.on_read_more}><u>Read more</u> <NavArrowDown width={20} height={20} color='cyan' style={{marginTop: "3px"}}/></span>
                }
                {this.state.read_more ? 
                <div className='skill_desc'>
                    {skill_desc ?? "No description available."}
                </div>
                :
                null}
            </div>
        )
    }
}
