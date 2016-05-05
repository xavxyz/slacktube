import { WebClient } from '@slack/client';

Meteor.methods({
	pingYoutube() {
		// do all stuff
		let videosUploaded = Youtube.fetchUploads(10),
				lastVideoUploaded = Youtube.refactorVideosData(videosUploaded[0]);

		let videosRegistered = Startupfood.find({}, {sort: {publishedAt: -1}}).fetch(),
				lastVideoRegistered = videosRegistered[0];

		if ( videosRegistered.length === 0 || lastVideoUploaded.publishedAt > lastVideoRegistered.publishedAt) {
			// log a new video document in the collection
			Youtube.insertNewVideo(lastVideoUploaded);

			// send to each team connected the new video
			Slack.sendToTeams(lastVideoUploaded);
		} else {
			console.log('no new video uploaded yet!');
		}
	},
	requestSlackToken: async (code) => {
		try {
			// webclient without token
			const client = new WebClient();
			// get credentials
			const credentials = await client.oauth.access(Meteor.settings.public.clientId, Meteor.settings.private.clientSecret, code);

			// auth a new client with the access token
			const authClient = new WebClient(credentials.access_token);

			// send a welcome message
			authClient.chat.postMessage(
				credentials.incoming_webhook.channel,
				//'WAYAYAYAYA! I\'m connected using NPM Modules + Promises + Async/Await Meteor Methods <3 ',
				'Howdy! Ready to watch Startupfood! :tada:',
				{
					username: Meteor.settings.public.botName,
					as_user: false,
					icon_url: Meteor.settings.public.botIcon
				}
			);

			// store the credentials
			Slackteams.insert({
				accessToken: credentials.access_token,
				createdAt: Date.now(),
				teamName: credentials.team_name,
				channel: credentials.incoming_webhook.channel
			});
		} catch(e) {
			console.log('something weird has happened', e);
		}
	},
	getVideos() {
		return {
			videos: Startupfood.find().fetch()
		}
	}
});