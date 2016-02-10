Youtube = {};

// ping playlistId corresponding to Startupfood and get back @maxResults parsed result
Youtube.fetchUploads = () => {
	try {
		let syncGet = Meteor.wrapAsync(HTTP.get);
		let result = syncGet("https://www.googleapis.com/youtube/v3/activities", {
			params: {
				part: "snippet",
				maxResults: 10,
				channelId: "UCYxgidQYV3WPD0eeVGOgibg",
				items: "items,kind",
				key: Meteor.settings.private.googleApiKey
			}
		});

		let activities = result.data.items,
				videos = [];

		_.each(activities, (activity) => {
			if (activity !== undefined && activity.snippet !== undefined && activity.snippet.type === "upload") {
				videos.push(activity.snippet);
			}
		});

		return videos;

	} catch(error) {
		throw error;
	}
};

// insert the document video in the collection
Youtube.insertNewVideo = (video) => {
	Startupfood.insert({
		title: video.title,
		publishedAt: video.publishedAt,
		youtubeId: video.youtubeId
	});
	console.log(`new video ${video.title} inserted !`);
};

Youtube.refactorVideosData = (videoFromYoutube) => {
	return {
		title: videoFromYoutube.title,
		publishedAt: Date.parse(videoFromYoutube.publishedAt),
		description: videoFromYoutube.description,
		thumbnail: videoFromYoutube.thumbnails.default.url,
		youtubeId: _getVideoIdFromThumbnails(videoFromYoutube.thumbnails.default.url)
	};
};

const _getVideoIdFromThumbnails = (url) => {
	let splittedUrl =  url.split("/"); // url thumbnail is always like "https://i.ytimg.com/vi/{VIDEO_ID}/default.jpg"

	return splittedUrl[4];
};