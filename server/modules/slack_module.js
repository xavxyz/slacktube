Slack = {};

Slack.sendToTeams = function(video) {

	let teams = Slackteams.find({}).fetch(),
			syncSlackPostMessage = Meteor.wrapAsync(SlackAPI.chat.postMessage);

	_.each(teams, function(team) {
		console.log('posting to channel '+ team.channel);
		try {
			let result = syncSlackPostMessage(
				team.accessToken,
				team.channel,
				":heart: Direct YouTube link to our newest video: https://www.youtube.com/watch?v="+ video.youtubeId+" :rocket:",
				{
					username: Meteor.settings.public.botName,
					as_user: false,
					// attachment to complete the video message
					attachments: [
						{
							"fallback": "New TheFamily video online - "+ video.title,
							"title": "TheFamily, here and there on Slack and Youtube sharing the startup mindset! :star2:",
							"title_link": "https://www.youtube.com/user/Startupfood",
							// push any special content there
							"text": "TheFamily nurtures entrepreneurs with education, unfair advantages and capital.\nTheFamily believes that Europe can create tons of crazy startups, through education.\n150k views per month on Youtube is a good sign - ambitious local entrepreneurs are ready to fly!",
							"image_url": "https://fbcdn-sphotos-c-a.akamaihd.net/hphotos-ak-xft1/v/t1.0-9/12540780_824204587688796_947625407470548770_n.png?oh=3912c5df2e549ffe8ef88152fa6fb362&oe=5730A458&__gda__=1463048062_1c5353aae9bf7b0ba39aedc49099a540",
							// you can specify as much as you want attachments
							"fields": [
								{
									"title": "Want to watch more videos from us? :tv:",
									"value": "<https://www.youtube.com/user/Startupfood|Check out our channel> :tv:",
									"short": true
								},
								{
									"title": "Give feedback! :hatched_chick:",
									"value": "<https://twitter.com/intent/tweet?text=Hey%20%40xavizalote%21%20My%20feedback%20on%20your%20%40_TheFamily%20integration%3A%20&source=webclient|Tweet it>",
									"short": true
								}
							],
							"color": "#10102A"
						}
					],
					unfurl_text: false,
					unfurl_media: true, // allow the the embed video to be shown (cf. direct link to youtube video)
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