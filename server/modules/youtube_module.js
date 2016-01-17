Youtube = {};

// ping playlistId corresponding to Startupfood and get back @maxResults parsed result
Youtube.fetchStartupfood = function(maxResults) {
	try {
		let syncGet = Meteor.wrapAsync(HTTP.get);
		let jsonVideos = syncGet("https://www.googleapis.com/youtube/v3/playlistItems", {
			params: {
				part: "snippet,contentDetails,status",
				maxResults: maxResults,
				playlistId: "UUYxgidQYV3WPD0eeVGOgibg",
				key: Meteor.settings.private.googleApiKey
			}
		});

		let videos = JSON.parse(jsonVideos.content);

		return videos;
	} catch(error) {
		throw error;
	}
};

// insert the document video in the collection
Youtube.insertNewVideo = function(videoFromYoutube) {
	Startupfood.insert({
		title: videoFromYoutube.title,
		publishedAt: Date.parse(videoFromYoutube.publishedAt),
		youtubeId: videoFromYoutube.resourceId.videoId
	});
	console.log('new video "'+ videoFromYoutube.title +'" inserted !');
}