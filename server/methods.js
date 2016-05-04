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
	requestSlackToken(code) {
		try {
			const credentials = SlackAPI.oauth.access(Meteor.settings.public.clientId, Meteor.settings.private.clientSecret, code, Meteor.absoluteUrl());

			const message = SlackAPI.chat.postMessage(
				credentials.access_token,
				credentials.incoming_webhook.channel,
				'Howdy! Ready to watch Startupfood! :tada:',
				{
					username: Meteor.settings.public.botName,
					as_user: false,
					icon_url: Meteor.settings.public.botIcon
				}
			);

			Slackteams.insert({
				accessToken: credentials.access_token,
				createdAt: Date.now(),
				teamName: credentials.team_name,
				channel: credentials.incoming_webhook.channel
			});

			console.log('Startupfood connected successfully');
		} catch(error) {
			console.log('error', error);
		}
	},
	getVideos() {
		return {
			videos: Startupfood.find().fetch()
		}
	}
});