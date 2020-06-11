import React from 'react';
import addToMailchimp from 'gatsby-plugin-mailchimp';
import { rhythm, scale } from '../utils/typography';
import '../styles/Signup.css';

export default class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      name: '',
      failureMessage: '',
      successMessage: '',
    };
  }

  onNameChange = e => {
    this.setState({ name: e.target.value });
  };

  onEmailChange = e => {
    this.setState({ email: e.target.value });
  };

  handleSubmit = async e => {
    e.preventDefault();

    const result = await addToMailchimp(this.state.email, {
      SOURCE: this.props.source,
    });

    if (result.result === 'success') {
      this.setState({
        successMessage:
          'Thank you for subscribing! You will need to check your inbox and confirm your subscription.',
      });
    } else {
      this.setState({ failureMessage: result.msg });
    }
  };

  render() {
    const inputStyles = {
      padding: `${rhythm(0.1)} ${rhythm(0.4)}`,
    };

    const form = (
      <form onSubmit={this.handleSubmit} className="Signup-form">
        <input
          placeholder="Email address"
          name="email"
          type="email"
          value={this.state.email}
          onChange={this.onEmailChange}
          className="Signup-input Signup-input-mail"
          style={inputStyles}
          required
        />
        <input
          type="submit"
          value="Subscribe"
          style={inputStyles}
          className="Signup-input Signup-input-submit"
        />
      </form>
    );

    return (
      <div className="Signup-gradient-wrapper">
        <div
          className="Signup-container"
          style={{ padding: `${rhythm(1.2)} ${rhythm(0.6)}` }}
        >
          <div>
            <h4 style={{ margin: '0 0 15px 0', ...scale(1), fontWeight: 300 }}>
              Subscribe to the newsletter
            </h4>
            <span>Stay up to date with my content. Opt-out at any time.</span>
          </div>
          <div style={{ padding: `${rhythm(0.8)} 0 0 0` }}>
            {this.state.failureMessage && (
              <div
                style={{
                  backgroundColor: '#eeeeee',
                  borderRadius: rhythm(0.5),
                  padding: `${rhythm(0.5)} ${rhythm(0.2)}`,
                  marginBottom: rhythm(0.8),
                }}
              >
                <div>
                  <strong>We've got a little problem over here!</strong>
                </div>
                <div>
                  <small>{this.state.failureMessage}</small>
                </div>
              </div>
            )}
            {this.state.successMessage || form}
          </div>
        </div>
      </div>
    );
  }
}
