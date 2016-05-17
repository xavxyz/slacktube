import { WebClient } from '@slack/client';
import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { Slack } from '../collection';

const requestSlackToken = new ValidatedMethod({
  name: 'Slack.methods.requestSlackToken',
  validate: new SimpleSchema({ code: { type: String } }).validator(),
  run: async ({ code }) => {
    try {
      // webclient without token
      const client = new WebClient();

      // get credentials
      const credentials = await client.oauth.access(Meteor.settings.public.clientId, Meteor.settings.private.clientSecret, code);

      // if there is not an integration registered for this team and this channel -> todo: tweak this to accept multiple youtube channels
      if (!Slack.findOne({ teamName: credentials.team_name, channel: credentials.incoming_webhook.channel })) {

        // auth a new client with the access token
        const authClient = new WebClient(credentials.access_token);

        // send a welcome message
        authClient.chat.postMessage(
          credentials.incoming_webhook.channel,
          //'WOYOYOYOYO! I\'m connected using NPM Modules + Promises + Async/Await Meteor *Validated* Methods <3 ',
          'Howdy! Ready to watch Youtube! :movie_camera:',
          {
            username: Meteor.settings.public.botName,
            as_user: false,
            icon_url: Meteor.settings.public.botIcon
          }
        );

        // store the credentials
        return Slack.insert({
          accessToken: credentials.access_token,
          createdAt: Date.now(),
          teamName: credentials.team_name,
          channel: credentials.incoming_webhook.channel
        });
      } else {
        console.log('team already exists!');
        return false;
      }
    } catch(e) {
      console.log('something weird has happened', e);
      return false;
    }
  }
});

const distributeVideo = new ValidatedMethod({
  name: 'Slack.methods.distributeVideo',
  validate: new SimpleSchema({
    title: { type: String },
    description: { type: String },
    publishedAt: { type: Date },
    youtubeId: { type: String },
    thumbnail: { type: String },
    _id: { type: String },
    accessToken: { type: String },
    channel: { type: String },
  }).validator(),
  run: async ({ title, description, publishedAt, youtubeId, thumbnail, _id, accessToken, channel }) => {
    
    console.log('posting to channel '+ channel);
    
    try {
      // auth to slack team
      const authClient = new WebClient(accessToken);
      
      // send the message
      const message = await authClient.chat.postMessage(
        channel,
        `:tv:\nDirect YouTube link to TheFamily's newest video: <${Meteor.absoluteUrl('video', { youtubeId })}|https://www.youtube.com/watch?v=${youtubeId}>`,
        {
          username: Meteor.settings.public.botName,
          as_user: false,
          // attachment to complete the video message
          attachments: [
            {
              fallback: `New video online - ${title}`,
              title: `${title}`,
              title_link: 'http://hacklearnmake.com', // no host by now
              // push any special content there
              text: ':scream_cat:\nNew video online, check it out!',
              image_url: thumbnail,
              // you can specify as much as you want attachments
              fields: [
                {
                  title: ':squirrel:',
                  value: 'This bot is brought to you by <http://hacklearnmake.com|{ Hack, Learn } = Make>',
                  short: false
                }
              ],
              color: '#10102A'
            }
          ],
          unfurl_text: false,
          unfurl_media: false, // allow the the embed video to be shown (cf. direct link to youtube video)
          icon_url: Meteor.settings.public.botIcon
        }
      );

    } catch(error) {
      // error handling: somebody has revoked the Slack app access to their team
      if (!error.ok && error.error === 'token_revoked') {
        Slack.remove({ accessToken });
        console.log('token revoked by user -> team removed from the collection!');
      }
    }
  }
});

export { requestSlackToken };