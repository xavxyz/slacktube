import { configure } from '@kadira/storybook';

function loadStories() {
  require('../imports/ui/components/.stories/Disclaimer.jsx');
}

configure(loadStories, module);