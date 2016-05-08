import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

const Slack = new Mongo.Collection("slack");

Slack.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

const slackSchema = new SimpleSchema({
  accessToken: {
    type: String,
  },
  createdAt: {
    type: Date,
  },
  teamName: {
    type: String,
  },
  channel: {
    type: String,
  },
});

Slack.attachSchema(slackSchema);

export { Slack, slackSchema };