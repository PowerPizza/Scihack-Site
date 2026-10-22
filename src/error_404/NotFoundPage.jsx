import React, { Component } from 'react'
import './notFoundPage.css'
import { Link } from 'react-router-dom'

export default class NotFoundPage extends Component {
    render() {
        return (
            <div class="not_found_main_body">
                <h1 class="glitch">404</h1>
                <p class="message">Oops! The page you're looking for doesn't exist.</p>
                <Link to={"/"} class="btn_aqua" style={{textDecoration: "none", marginTop: "30px"}}>← Go Back Home</Link>
            </div>
        )
    }
}
