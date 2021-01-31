import React, { Component } from "react";
import properties from '../properties';

export default class Login extends Component {

    constructor(props) {
        super(props);
        this.state = { username: '',
                        password: '',
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
        fetch(properties.API_URL+'/login', {
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
                this.setState({ responseMessage:'SignIn successfully'});
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
                 {this.state.responseCode === 200?
                <div class="alert alert-success" role="alert">
                    {this.state.responseMessage}
                </div>:''}
                {this.state.responseCode === 400?
                <div class="alert alert-danger" role="alert">
                   <b>{this.state.responseMessage}</b><br/>
                   <span>{this.state.subErrors}</span>
                </div>: ''}
                <h3>Sign In</h3>

                <div className="form-group">
                    <label>Username</label>
                    <input type="text" value={this.state.username} name="username"  onChange={this.handleChange} className="form-control" placeholder="Enter Username" />
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input type="password" value={this.state.password} name="password"  onChange={this.handleChange} className="form-control" placeholder="Enter password" />
                </div>
            

                <div className="form-group">
                    <div className="custom-control custom-checkbox">
                        <input type="checkbox" className="custom-control-input" id="customCheck1" />
                        <label className="custom-control-label" htmlFor="customCheck1">Remember me</label>
                    </div>
                </div>

                <button type="submit" className="btn btn-primary btn-block">Sign In {'   '}  {this.state.isSubmit?<span class="spinner-border spinner-border-sm"></span>:''}</button>
                <p className="forgot-password text-right">
                    Forgot <a href="#">password?</a>
                </p>
            </form>
        );
    }
}
