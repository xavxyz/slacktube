import React from 'react';

export const AddToSlackButton = () => {
  
  // slack app client id
  const clientId = Meteor.settings.public.clientId;
  
  return (
    <p>
      <a href={ `https://slack.com/oauth/authorize?scope=incoming-webhook,chat:write:bot&client_id=${ clientId }&redirect_uri=${ Meteor.absoluteUrl() }` }>
        <img alt='Add to Slack'
             className="add-to-slack-button"
             src='https://platform.slack-edge.com/img/add_to_slack.png' 
             srcSet='https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x'
        />
      </a>
    </p>
  );
};