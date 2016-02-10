Meteor.methods({
	pingYoutube: function() {
		// do all stuff
		if (Meteor.isServer) {
			let videosUploaded = Youtube.fetchUploads(10),
					lastVideoUploaded = Youtube.refactorVideosData(videosUploaded[0]);

			let videosRegistered = Startupfood.find({}, {sort: {publishedAt: -1}}).fetch(),
					lastVideoRegistered = videosRegistered[0];

			if ( videosRegistered.length === 0 || lastVideoUploaded.publishedAt > lastVideoRegistered.publishedAt) {
				// log a new video document in the collection
				Youtube.insertNewVideo(lastVideoUploaded);

				// send to each team connected the new video
				Slack.sendToTeams({
					title: lastVideoUploaded.title,
					youtubeId: lastVideoUploaded.youtubeId,
					description: lastVideoUploaded.description
				});
			} else {
				console.log('no new video uploaded yet!');
			}
		}
	},
	requestSlackToken: function(code) {
		try {
			let syncSlackOAuth = Meteor.wrapAsync(SlackAPI.oauth.access),
				syncSlackPostMessage = Meteor.wrapAsync(SlackAPI.chat.postMessage);

			let credentials = syncSlackOAuth(Meteor.settings.public.clientId, Meteor.settings.private.clientSecret, code, '');

			try {
				let message = syncSlackPostMessage(
					credentials.access_token,
					credentials.incoming_webhook.channel,
					'Howdy! Ready to watch <https://www.youtube.com/user/Startupfood|Startupfood>! :tada:',
					{
						username: Meteor.settings.public.botName,
						as_user: false,
						"icon_url": Meteor.settings.public.botIcon
					}
				);

				Slackteams.insert({
					accessToken: credentials.access_token,
					createdAt: Date.now(),
					teamName: credentials.team_name,
					channel: credentials.incoming_webhook.channel,
					messages: [
						{ videoId: 'first_message', ts: message.ts }
					]
				});

				console.log('Startupfood connected successfully');
			} catch(messageError) {
				console.log(messageError);
			}
		} catch(oauthError) {
			console.log(oauthError);
		}
	},
	getVideos: function() {
		return {
			videos: Startupfood.find().fetch()
		}
	}
});