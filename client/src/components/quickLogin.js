import React, { Component } from 'react';
import axios from 'axios';
var sha256 = require('sha256');

axios.defaults.withCredentials = true;

class QuickLogin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            passwordShown: true,
            passEntered: false,
            pass: "",
        };
    }

    componentDidMount() {
        axios.get(`${this.props.baseURL}/api/password/${this.state.pass}`).then((response) => {
            if (response.data.logged) {
                this.setState({ passEntered: true, passwordShown: false, checkPass: response.data.password, checkSessionID: response.data.sessionID });
            }
        }).catch(function (error) {
            return JSON.stringify(error);
        });
    }

    handlePassEnter(e) {
        this.setState({
            pass: e.target.value
        });
    }

    handleSubmitPass(e) {
        axios.post(`${this.props.baseURL}/api/password`, { password: sha256(this.state.pass) }).then((response) => {
            if (response.data === "logged") {
                this.setState({ passEntered: true });
                this.setState({
                    message: this.state.value,
                    passwordShown: false,
                });
                // this.forceUpdate();
                window.location.reload(); //should only need to force the page element to reload to get input box.
            } else {
                this.setState({
                    incorrectPassword: "You've entered an incorrect password.",
                    message: this.state.value
                });
                setTimeout(() => {
                    this.setState({
                        incorrectPassword: "",
                        verificationMessage: ""
                    });
                }, 2000)
            }
        }).catch(function (error) {
            return JSON.stringify(error);
        });
        e.preventDefault();
    }

    handleLogout() {
        axios.post(`${this.props.baseURL}/api/password/logout`).then((response) => {
            window.location.reload();

        }).catch(function (error) {
            return JSON.stringify(error);
        });
    }

    render() {

        var passwordShown = {
            display: this.state.passwordShown ? "block" : "none"
        };

        var hidden = {
            display: this.state.passwordShown ? "none" : "block"
        }

        return (
            <div>
                <form style={passwordShown} method="get" className="pure-form pure-form-aligned" onSubmit={this.handleSubmitPass.bind(this)}>
                    <fieldset className="quickLog">
                        <div className="pure-control-group">
                            <div className='pure-control-group'>
                                <input onChange={this.handlePassEnter.bind(this)} id="quickpassenter" type="password" value={this.state.pass} placeholder="Quick Login" />
                                <p className="verificationMessage"> {this.state.incorrectPassword} </p>
                            </div>
                        </div>
                    </fieldset>
                </form><button style={hidden} className="pure-button quickLog pure-button-primary logout-button" onClick={this.handleLogout.bind(this)}>Logout</button>
            </div>
        );
    }
}

export default QuickLogin;
