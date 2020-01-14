import React from 'react';
import addToMailchimp from 'gatsby-plugin-mailchimp';
import { rhythm, scale } from '../utils/typography';

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
      FNAME: this.state.name,
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
      border: `${rhythm(0.1)} solid #eeeeee`,
      borderRadius: rhythm(0.5),
      padding: `${rhythm(0.1)} ${rhythm(0.4)}`,
      margin: rhythm(0.01),
    };

    const form = (
      <form onSubmit={this.handleSubmit} style={{ margin: 0, padding: 0 }}>
        <input
          placeholder="First name"
          name="name"
          type="text"
          value={this.state.name}
          onChange={this.onNameChange}
          style={inputStyles}
          required
        />
        <input
          placeholder="Email address"
          name="email"
          type="email"
          value={this.state.email}
          onChange={this.onEmailChange}
          style={inputStyles}
          required
        />
        <input
          type="submit"
          value="Subscribe"
          style={{ cursor: 'pointer', ...inputStyles }}
        />
      </form>
    );

    return (
      <div
        style={{
          display: 'block',
          padding: `${rhythm(0.9)} ${rhythm(0.6)}`,
          backgroundColor: '#e6e6e6',
          borderRadius: rhythm(0.5),
          textAlign: 'center',
        }}
      >
        <div>
          <h4 style={{ margin: 0, ...scale(0.3) }}>
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
    );
  }
}
