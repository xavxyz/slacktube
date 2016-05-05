import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

Slack = new Mongo.Collection("slack");

Slack.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; }
});

let slackSchema = new SimpleSchema({
  accessToken: {
    type: String
  },
  createdAt: {
    type: Date
  },
  teamName: {
    type: String
  },
  channel: {
    type: String
  }
});

Slack.attachSchema(slackSchema);