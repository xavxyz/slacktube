import { Youtube, youtubeSchema } from '../collection';

const check = new ValidatedMethod({
	name: 'Youtube.methods.check',
	validate: youtubeSchema.validator(),
	run(video) {
		// get the last records
		const lastVideoRegistered = Youtube.findOne({}, {sort: {publishedAt: -1}});

		// if any video is registered or the last video uploaded is more recent than the last one registered, store it
		if (!lastVideoRegistered || video.publishedAt > lastVideoRegistered.publishedAt) {
			console.log(`new video ${video.title} inserted !`);

			// store the video
			return Youtube.insert({ ...video });
		} else {
			console.log('no new video uploaded yet!');
			return undefined;
		}
	}
});