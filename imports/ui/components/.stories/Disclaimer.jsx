import React from 'react';
import { storiesOf, action } from '@kadira/storybook';

import { Disclaimer } from '../Disclaimer.jsx';

storiesOf('core.Disclaimer', module)
  .add('Default', () => <Disclaimer disclaimer="CTA" />)
  .add('Loading', () => <Disclaimer disclaimer="Loading..." />)
  .add('Slack said yes', () => <Disclaimer disclaimer="Slack said:" result={ true } />)
  .add('Slack said no', () => <Disclaimer disclaimer="Slack said:" result={ false } />);