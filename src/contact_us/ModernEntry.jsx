import React, { Component } from 'react'
import './modernEntry.css'

export default class ModernEntry extends Component {
    constructor(){
        super();
        this.state = {entryVal: "", user_iteracted: false}
    }

    onChangeInp = (ele)=>{
        this.setState({entryVal: ele.target.value, user_iteracted: true});
        this.props.onChange(ele.target.value)
    }

    render() {
        let {label_text, className, defaultValue, type} = this.props;
        
        return (
            <div className={`entry ${className}`}>
                <input type={type ?? "text"} className='input_' defaultValue={defaultValue} onChange={this.onChangeInp} />
                <div className='underline'>
                    <div className='underline_exp'></div>
                </div>
                <label className={`default_text ${(this.state.entryVal || ((!this.state.user_iteracted) && this.props.defaultValue)) ? "active" : ""}`}>{label_text}</label>
            </div>
        )
    }
}

ModernEntry.defaultProps = {
    onChange: ()=>{},
    label_text: "No label",
    ui_color: "cyan",
    className: "",
    defaultValue: ""
}