import React, { Component } from "react";

import properties from '../properties';

export default class SignUp extends Component {
    constructor(props) {
        super(props);
        this.state = { username: '',
                        password: '',
                        email: '',
                        isSubmit: false,
                        responseCode:0,
                        responseMessage:'' };
      }
      handleChange = (event) => {
        this.setState({[event.target.name]: event.target.value});
      }

      handleSubmit = (event) => {
        this.setState({isSubmit: true})
        event.preventDefault();
        fetch(properties.API_URL+'/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' 
            },
            // We convert the React state to JSON and send it as the POST body
            body: JSON.stringify(this.state)
          }).then((response) =>{
              this.setState({responseCode: response.status,
                isSubmit: false})
                return response.json();
          }).catch(function(ex) {
              console.log(ex);
          }).then((data) => {
              if(this.state.responseCode === 200) {
                this.setState({ responseMessage:'Signup successfully, go to login page'});
              } else if(this.state.responseCode === 400){
                var responseMessage = data.message;
                if(data.subErrors){
                    var subError='';
                    data.subErrors.forEach(error => {
                        subError+=" ~ "+error.message;
                    });
                    this.setState({subErrors: subError});
                }  
                this.setState({ responseMessage:responseMessage});
                  
              }
          });;
    
        
    }
    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <h3>Sign Up</h3>
                {this.state.responseCode === 200?
                <div class="alert alert-success" role="alert">
                    {this.state.responseMessage}
                </div>:''}
                {this.state.responseCode === 400?
                <div class="alert alert-danger" role="alert">
                   <b>{this.state.responseMessage}</b><br/>
                   <span>{this.state.subErrors}</span>
                </div>: ''}
                <div className="form-group">
                    <label>Username</label>
                    <input type="text" value={this.state.username} name="username"  onChange={this.handleChange} className="form-control" placeholder="Enter Username" />
                </div>

                <div className="form-group">
                    <label>Email address</label>
                    <input type="email" value={this.state.email} name="email"  onChange={this.handleChange} className="form-control" placeholder="Enter email" />
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input type="password" value={this.state.password} name="password"  onChange={this.handleChange} className="form-control" placeholder="Enter password" />
                </div>
            
                <button type="submit" className="btn btn-primary btn-block">Sign Up {'   '}  {this.state.isSubmit?<span class="spinner-border spinner-border-sm"></span>:''}</button>
                <p className="forgot-password text-right">
                    Already registered <a href="#">sign in?</a>
                </p>
            </form>
        );
    }
}