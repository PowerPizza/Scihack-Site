import React, { Component } from 'react'
import './customSelect.css'
import { NavArrowDown, NavArrowUp } from 'iconoir-react'

export default class CustomSelect extends Component {
    input_ele = null;

    constructor() {
        super();
        this.state = { is_opened: false, selected_opt_text: null };
    }

    on_menu_click = () => {
        this.setState({ is_opened: !this.state.is_opened });
    }

    on_select_opt = (opt_text)=>{
        this.setState({selected_opt_text: opt_text});
        if (this.input_ele){
            this.input_ele.value = opt_text;
        }
        if (this.props.onChange){
            this.props.onChange(opt_text);
        }
    }

    on_change_entry = (ele)=>{
        this.setState({selected_opt_text: ele.target.value});
        if (this.props.onChange){
            this.props.onChange(ele.target.value);
        }
        this.input_ele = ele.target;
    }

    componentDidUpdate(){
        if (!this.state.selected_opt_text && this.props.options.length){
            this.on_select_opt(this.props.options[0]);
        }
    }
    componentDidMount(){
        console.log(this.props.options);
    }

    render() {
        let { className, options } = this.props;
        // options -> [{value: "", opt_text: ""}, {value: "", opt_text: ""}]

        return (
            <div className={`custom_select_body ${className}`}>
                <div className='selected'>
                    <input type="text" defaultValue={this.state.selected_opt_text} className='option_text' onChange={this.on_change_entry}/>
                    {this.state.is_opened ?
                        <NavArrowUp fill='white' onClick={this.on_menu_click} />
                        :
                        <NavArrowDown fill='white' onClick={this.on_menu_click} />
                    }
                </div>
                {this.state.is_opened ? 
                <ul className='selection_list' onClick={this.on_menu_click}>
                    {options.map((ele, idx)=>{
                        return <li onClick={()=>{this.on_select_opt(ele)}} key={"li_select_"+idx}>{ele}</li>
                    })}
                </ul>
                : null}
            </div>
        )
    }
}
