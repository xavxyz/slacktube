import React from 'react';

import { Footer } from '../components/Footer.jsx';

const Layout = ({ content }) => {
  return (
    <div className="row">
      { content }
      <Footer />
    </div>
  );
};

export default Layout;