Slack = {};

Slack.sendToTeams = function(video) {

	let teams = Slackteams.find({}).fetch();

	_.each(teams, function(team) {
		console.log('posting to channel '+ team.channel);
		try {
			let result = SlackAPI.chat.postMessage(
				team.accessToken,
				team.channel,
				":heart: Direct YouTube link to TheFamily's newest video: <http://startupfood.meteor.com/video/"+ video.youtubeId +"|https://www.youtube.com/watch?v="+ video.youtubeId +"> :rocket:",
				{
					username: Meteor.settings.public.botName,
					as_user: false,
					// attachment to complete the video message
					attachments: [
						{
							"fallback": "New TheFamily video online - "+ video.title,
							"title": ":nerd_face: New video online - "+ video.title +" :scream_cat:" ,
							"title_link": "http://startupfood.meteor.com/video/"+ video.youtubeId,
							// push any special content there
							"text": video.description + "\n\nTheFamily nurtures entrepreneurs with education, unfair advantages and capital.\nTheFamily believes that Europe can create tons of crazy startups, through education.\n150k views per month on Youtube is a good sign - ambitious local entrepreneurs are ready to fly!",
							"thumb_url": video.thumbnail,
							// you can specify as much as you want attachments
							"fields": [
								{
									"title": "Want to watch more videos from TheFamily? :movie_camera:",
									"value": ":tv: <http://startupfood.meteor.com/channel?source=watch_more|Check out their YouTube channel> :tv:",
									"short": true
								},
								{
									"title": ":slack: This bot is brought to you by",
									"value": "<http://startupfrance.co|Startup France Community>",
									"short": true
								}
							],
							"color": "#10102A"
						}
					],
					unfurl_text: false,
					unfurl_media: false, // allow the the embed video to be shown (cf. direct link to youtube video)
					icon_url: Meteor.settings.public.botIcon
				}
			);

			// log content send to the team
			team.messages.push({
				videoId: video.youtubeId,
				ts: result.ts
			});

			// update the collection
			Slackteams.update({accessToken: team.accessToken}, {$set: {messages: team.messages}}, function(err, res) {
				console.log('logged post '+ video.youtubeId +' sent to '+ result.channel +' at '+ result.ts);
			});

		} catch(error) {
			// error handling: somebody has revoked the Startupfood app access to their team
			if (!error.ok && error.error === 'token_revoked') {
				Slackteams.remove({_id: team._id});
				console.log('token revoked by user -> team removed from the collection!');
			}
		}
	});
};