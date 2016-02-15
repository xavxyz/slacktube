Slack = {};

Slack.sendToTeams = function(video) {

	let teams = Slackteams.find({}).fetch();

	_.each(teams, function(team) {
		console.log('posting to channel '+ team.channel);
		try {
			let result = SlackAPI.chat.postMessage(
				team.accessToken,
				team.channel,
				":heart: Direct YouTube link to our newest video: <http://startupfood.meteor.com/video/"+ video.youtubeId +"|https://www.youtube.com/watch?v="+ video.youtubeId +"> :rocket:",
				{
					username: Meteor.settings.public.botName,
					as_user: false,
					// attachment to complete the video message
					attachments: [
						{
							"fallback": "New TheFamily video online - "+ video.title,
							"title": ":tv: New TheFamily video online - "+ video.title +" :star2:" ,
							"title_link": "http://startupfood.meteor.com/video/"+ video.youtubeId,
							// push any special content there
							"text": video.description + "\n\nTheFamily nurtures entrepreneurs with education, unfair advantages and capital.\nTheFamily believes that Europe can create tons of crazy startups, through education.\n150k views per month on Youtube is a good sign - ambitious local entrepreneurs are ready to fly!",
							"thumb_url": video.thumbnail,
							// you can specify as much as you want attachments
							"fields": [
								{
									"title": "Want to watch more videos from us? :tv:",
									"value": "<http://startupfood.meteor.com/channel?source=watch_more|Check out our channel> :tv:",
									"short": true
								},
								{
									"title": "Any request? :hatched_chick:",
									"value": "<https://twitter.com/intent/tweet?text=.%20%40xavizalote%20%40_TheFamily%20My%20feedback%20about%20your%20integration%3A%20&source=webclient|Feedback welcomed!>",
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