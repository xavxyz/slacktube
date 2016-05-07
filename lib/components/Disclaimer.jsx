import React from 'react';

export const Disclaimer = ({ disclaimer, result }) => {
  return (
    <div>
      <h1>{ disclaimer }</h1>
      { disclaimer === 'Slack said:'
          ? !!result ? <h2>YES!</h2>
          : <h2>NO!</h2>
        : null }
    </div>
  );
};