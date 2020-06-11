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
      border: '1px solid rgb(35, 35, 51)',
      padding: `${rhythm(0.1)} ${rhythm(0.4)}`,
      margin: '0px',
      flex: 1,
    };

    const form = (
      <form
        onSubmit={this.handleSubmit}
        style={{
          margin: 0,
          padding: 0,
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        <input
          placeholder="Email address"
          name="email"
          type="email"
          value={this.state.email}
          onChange={this.onEmailChange}
          style={{ ...inputStyles, minHeight: '45px', flex: '0 1 40%' }}
          required
        />
        <input
          type="submit"
          value="Subscribe"
          style={{
            ...inputStyles,
            cursor: 'pointer',
            backgroundImage:
              'linear-gradient(to right, rgb(35, 35, 51), rgb(62, 62, 108))',
            border: 'none',
            color: 'white',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            fontWeight: '300',
            padding: '10px 17px',
            flex: '0 1 150px',
          }}
        />
      </form>
    );

    return (
      <div
        className="gradient-wrapper"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundImage:
            'linear-gradient(to right, rgb(35, 35, 51), rgb(163, 163, 203))',
          padding: '1px',
          margin: '50px 0',
        }}
      >
        <div
          style={{
            display: 'block',
            width: '100%',
            padding: `${rhythm(1.2)} ${rhythm(0.6)}`,
            backgroundColor: 'white',
            textAlign: 'center',
          }}
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
