import React from 'react';

import { Disclaimer } from './Disclaimer.jsx';
import { AddToSlackButton } from './AddToSlackButton.jsx';

export class Jumbotron extends React.Component {
  constructor(props) {
    super(props);
    this.state = { disclaimer: 'CTA', result: false };
  }

  componentDidMount() {
    const { code } = this.props;

    if (code) {
      return (async () => {
        try {
          this.setState({ disclaimer: 'Loading...' });
          const result = await Meteor.call('Slack.methods.requestSlackToken', { code });
          this.setState({ disclaimer: 'Slack said:', result });
        } catch(e) {
          this.setState({ disclaimer: 'ERR' });
        }
      })();
    }
  }

  render() {
    return (
      <div className="jumbotron text-center">
        <Disclaimer { ...this.state } />
        <h2>🎉</h2>
        <AddToSlackButton />
      </div>
    );
  }
}