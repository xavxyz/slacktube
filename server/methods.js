Meteor.methods({
	pingYoutube: function() {
		let youtubeData = Youtube.fetchStartupfood(1),
				lastVideoUploaded = youtubeData.items[0].snippet,
				totalVideosResults = youtubeData.pageInfo.totalResults;

		let videosRegistered = Startupfood.find({}, {sort: {publishedAt: 1}}).fetch(),
				lastVideoRegistered = videosRegistered[0];

		// the collection is empty or a new video has been uploaded, insert the last video uploaded on startupfood
		if (videosRegistered.length === 0 || Date.parse(lastVideoUploaded.publishedAt) > lastVideoRegistered.publishedAt) {
			Youtube.insertNewVideo(lastVideoUploaded);

			return {
				title: lastVideoUploaded.title,
				youtubeId: lastVideoUploaded.resourceId.videoId,
				totalVideosResults: totalVideosResults,
				description: lastVideoUploaded.description
			}

		} else {
			console.log('no new video uploaded yet!');
		}
	},
	requestSlackToken: function(code) {
		try {
			let syncSlackOAuth = Meteor.wrapAsync(SlackAPI.oauth.access),
					syncSlackPostMessage = Meteor.wrapAsync(SlackAPI.chat.postMessage);

			let credentials = syncSlackOAuth(Meteor.settings.public.clientId, Meteor.settings.private.clientSecret, code, Meteor.absoluteUrl());

			try {
				let message = syncSlackPostMessage(
					credentials.access_token,
					credentials.incoming_webhook.channel,
					'Howdy! Ready to watch <Startupfood! :ok_hand:',
					{
						username: "TheFamily",
						as_user: false,
						"icon_url": "https://yt3.ggpht.com/-OHMegElwYDQ/AAAAAAAAAAI/AAAAAAAAAAA/Z0W66g-RchI/s100-c-k-no/photo.jpg"
					}
				);

				Slackteams.insert({
					accessToken: credentials.access_token,
					createdAt: Date.now(),
					teamName: credentials.team_name,
					channel: credentials.incoming_webhook.channel,
					messages: [
						{ postId: 'first_message', ts: message.ts }
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

	sendToSlack: function(video) {

		let teams = Slackteams.find({}).fetch(),
				botName = "TheFamily",
				botIcon = "https://yt3.ggpht.com/-OHMegElwYDQ/AAAAAAAAAAI/AAAAAAAAAAA/Z0W66g-RchI/s100-c-k-no/photo.jpg",
				syncSlackPostMessage = Meteor.wrapAsync(SlackAPI.chat.postMessage);

		_.each(teams, function(team) {
			console.log('posting to channel '+ team.channel);
			try {
				let result = syncSlackPostMessage(
					team.accessToken,
					team.channel,
					":coffee::wave: Direct link of our newest video: https://www.youtube.com/watch?v="+ video.youtubeId+" :heart::tv:",
					{
						username: botName,
						as_user: false,
						attachments: [
							{
								"fallback": "New Startupfood video online - "+ video.title,
								//"pretext": "New video ! :tada: :smile: :rocket:",
								"title": "Become a better entrepreneur watching TheFamily's videos on YouTube ! :muscle: :tv:",
								"title_link": "https://www.youtube.com/user/Startupfood",
								"text": "This new video "+ video.title +" is about:\n"+ video.description,
								//"image_url": "https://d4z6dx8qrln4r.cloudfront.net/image-5694c2a050cfa-default.png",
								//"image_url": "http://yt3.ggpht.com/-btSS41b7M9U/VWSGrSgf66I/AAAAAAAAAGE/XnWbRFWQ7I0/w1060-fcrop64=1,00005a57ffffa5a8-nd/11140786_714107885365134_2794039977990508360_o.jpg",
								"image_url": "http://static1.squarespace.com/static/54c94daae4b0f2976a2f5ee8/t/55a681d9e4b06c464d359cc0/1436975585059/?format=1000w",
								"fields": [
									{
										"title": "Online videos",
										"value": video.totalVideosResults +" :tv:",
										"short": true
									},
									{
										"title": "Want more? :rocket:",
										"value": "<http://www.koudetatondemand.co/|Watch KOUDETAT for free! :tada:>",
										"short": true
									}
									/*
									{
										"title": ":point_down: SUBSCRIBE :point_down:",
										"value": "<https://thefamily.typeform.com/to/VyzBPR|FREE ENTREPRENEUR SCHOOL>",
										"short": true
									}
									*/
								],
								"color": "#10102A",
							},
						],
						unfurl_text: false,
						unfurl_media: true,
						icon_url: botIcon
					}
				);


			 team.messages.push({
			 postId: post._id,
			 ts: result.ts
			 });

			 Slackteams.update({accessToken: team.accessToken}, {$set: {messages: team.messages}}, function(err, res) {
			 console.log('logged post '+ post._id +' sent to '+ result.channel +' at '+ result.ts);
			 });

			} catch(error) {
				if (!error.ok && error.error === 'token_revoked') {
					Slackteams.remove({_id: team._id});
					console.log('token revoked by user -> team removed from the collection!');
				}
			}
		});
	}
});