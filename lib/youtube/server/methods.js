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
			Slack.find({}).forEach((team) => {

				const { accessToken, channel } = team;

				Meteor.call('Slack.methods.distributeVideo', {
					video: lastVideoUploaded,
					accessToken,
					channel
				});

			});

		} else {
			console.log('no new video uploaded yet!');
		}
	},
	getVideos() {
		return {
			videos: Startupfood.find().fetch()
		}
	}
});