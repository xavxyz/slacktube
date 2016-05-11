# meteor-startupfood-slack
Connect TheFamily's Youtube channel to Slack teams via the Add To Slack button or simple link in an email ;)
* [TheFamily Youtube channel](https://www.youtube.com/user/Startupfood)
* [Add to Slack Button docs](https://api.slack.com/docs/slack-button)

# Installation for TheFamily Dev team
1. Clone the repo
2. Create a [Slack App](https://api.slack.com/applications/new): the redirection URI must be set where your app is deployed (ie. http://startupfood.meteor.com)
3. Get a [Youtube Api Key](https://developers.google.com/youtube/v3/getting-started)
4. If you want to track clicks, get your Mixpanel token.
5. Create your `settings.json` from `sample_settings.json` with your own credentials :
```
{
  "public": {
    "clientId": "YOUR_SLACK_APP_CLIENT_ID",
    "botName": "YOUR_BOT_NAME",
    "botIcon": "YOUR_BOT_ICON",
    "analyticsSettings": {
      "Mixpanel": {
        "token":  "YOUR_MIXPANEL_TOKEN",
        "people": false
      }
    },
    "youtubeChannel": "CHANNEL_ID_YOU_WANT_TO_WATCH"
  },
  "private": {
    "clientSecret": "YOUR_SLACK_APP_CLIENT_SECRET",
    "googleApiKey": "YOUR_GOOGLE_API_KEY"
  }
}
6. Install npm packages `npm install`
7. Start the app with `meteor --settings settings.json`
```

That's all, deploy your app & you are ready to push contents to any teams connected to your app.

# Basic enhancements
You can customize the attachments in `/server/lib/slack_module.js`.
You may read the [Slack attachments doc](https://api.slack.com/docs/attachments) to better understand how to deal with it.

# React Storybook
This app uses [React Storybook](https://github.com/kadirahq/react-storybook). To use it, type `npm run storybook`.
Make sure to upgrade to npm@3.x.x to use it.

# Where to lead this app next
* Check whether the app is connected to a channel or an user. If it's an user, use Slack's API method to post in user (for ex: slackbot)
* Add search slash command/slackbot to search directly in your Youtube channel or in TheFamily TV directory (tv.thefamily.co).
* Push other content than videos if the user really use this app.

# Contributions
Do not hesitate to open issues, PR or even to hire me ;) 
