import { configure } from '@kadira/storybook';
import '../client/style.css';


function loadStories() {
  require('../imports/ui/components/.stories/Disclaimer.jsx');
}

configure(loadStories, module);