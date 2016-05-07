import { cleanVideo } from '/lib/youtube/helpers';

SyncedCron.options = {
	log: false,
	collectionName: 'cronHistory',
	utc: false,
	collectionTTL: 172800
};

SyncedCron.add({
	name: 'Ping YouTube and distribute to Slack if a new video has been uploaded',
	schedule: (parser) => parser.text('every 2 seconds'),
	job: async () => {
		try {

			const channelId = Meteor.settings.public.youtubeChannel;

			console.log('// Pinging Youtube channel', channelId);

			const result = await HTTP.call('get', "https://www.googleapis.com/youtube/v3/activities", {
				params: {
					part: "snippet",
					maxResults: 1,
					channelId,
					items: "items,kind",
					key: Meteor.settings.private.googleApiKey
				}
			});

			const activity = _.first(result.data.items);

			// if the current activity is an upload, push it to the videos array
			if (!!activity && !!activity.snippet && activity.snippet.type === "upload") {

				// clean the snippet in an exploitable object
				const video = cleanVideo(activity.snippet);

				const newVideoRegistered = await Meteor.call('Youtube.methods.check', video);

				if (!!newVideoRegistered) {
					console.log('// Starting distribution to Slack teams');
					// send to each team connected the new video
					Slack.find({}).forEach(async(team) => {
						try {
							// spread! ... \ô/ ... \ô> ... \o/^ ... \o/  ^ (someone taking out their hat and throwing it)
							await Meteor.call('Slack.methods.distributeVideo', {
								...video,
								...team
							});
						} catch (e) {
							console.log('[slack-distribution]', e);
						}
					});
				}
			}
		} catch(e) {
			console.log('[job]', e);
		}
	}
});

Meteor.startup(() => {
	SyncedCron.start();
});