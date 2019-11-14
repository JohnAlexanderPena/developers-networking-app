import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux';
import { registerUser } from '../../actions/authActions'

class Register extends Component{

  state = {
    name: "",
    email: '',
    password: '',
    password2: '',
    errors: {}
  }

  componentDidMount() {
    if(this.props.auth.isAuthenticated) {
      this.props.history.push('/dashboard')
    }
  }
  
  UNSAFE_componentWillReceiveProps(nextProps) {  //getting errrors from redux state if they exist
    if(nextProps.errors) {
      this.setState({
        errors: nextProps.errors
      })
    }
  }

  onChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  onSubmit = (e) => {
    e.preventDefault()
    const newUser = {
      name: this.state.name,
      email:this.state.email,
      password: this.state.password,
      password2: this.state.password2
    };
    this.props.registerUser(newUser, this.props.history)
  }


  render() {
    const {errors} = this.state; //destructuring

    // const { user  } = this.props.auth
    console.log(this.state)
    return(
      <div className="register">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Sign Up</h1>
              <p className="lead text-center">Create your WebDev Unlimited account</p>
              <form onSubmit={this.onSubmit}>
                <div className="form-group">
                  <input
                  type="text"
                  className={classnames('form-control form-control-lg', {
                    'is-invalid': errors.name // will only appear and turn red IF errors.name exists in our state
                  })}
                  placeholder="Name"
                  name="name"
                  value={this.state.name}
                  onChange={this.onChange}
                  />
                {errors.name && (
                  <div className="invalid-feedback">{errors.name}</div>
                )}
                </div>
                <div className="form-group">
                  <input
                  type="email"
                  className={classnames('form-control form-control-lg', {
                    'is-invalid': errors.email // will only appear and turn red IF errors.email exists in our state
                  })}
                  placeholder="Email Address"
                  name="email"
                  value={this.state.email}
                  onChange={this.onChange}
                  />
                {errors.email && (
                  <div className="invalid-feedback">{errors.email}</div>
                )}
                  <small className="form-text text-muted">This site uses Gravatar so if you want a profile image, use a Gravatar email
                  </small>
                </div>
                <div className="form-group">
                  <input
                  type="password"
                  className={classnames('form-control form-control-lg', {
                    'is-invalid': errors.password // will only appear and turn red IF errors.password exists in our state
                  })}
                  placeholder="Password"
                  name="password"
                  value={this.state.password}
                  onChange={this.onChange}
                  />
                {errors.password && (
                  <div className="invalid-feedback">{errors.password}</div>
                )}
                </div>
                <div className="form-group">
                  <input
                  type="password"
                  className={classnames('form-control form-control-lg', {
                    'is-invalid': errors.password2 // will only appear and turn red IF errors.password2 exists in our state
                  })}
                  placeholder="Confirm Password"
                  name="password2"
                  onChange={this.onChange}
                  value={this.state.password2}
                  />
                {errors.password2 && (
                  <div className="invalid-feedback">{errors.password2}</div>
                )}
                </div>
                <input type="submit" className="btn btn-info btn-block mt-4" />
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(mapStateToProps, { registerUser })(withRouter(Register));
