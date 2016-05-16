import React from 'react';

import { Footer } from '../components/Footer.jsx';

const Layout = ({ content }) => {
  return (
    <div className="row">
      <img className="logo" src="slacktube.png" title="Slacktube: from Youtube to Slack" />
      { content }
      <Footer />
    </div>
  );
};

export default Layout;