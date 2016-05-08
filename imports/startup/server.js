import { Meteor } from 'meteor/meteor';

import './routes.jsx';

import '/imports/api/slack/server/methods';
import '/imports/api/slack/collection';

import '/imports/api/youtube/server/methods';
import '/imports/api/youtube/collection';
import '/imports/api/youtube/helpers';

import '/imports/api/cron';
