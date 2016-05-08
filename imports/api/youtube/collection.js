import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

const Youtube = new Mongo.Collection("youtube");

Youtube.deny({
	insert() { return true; },
	update() { return true; },
	remove() { return true; },
});

const youtubeSchema = new SimpleSchema({
	title: {
		type: String,
	},
	description: {
		type: String,
	},
	publishedAt: {
		type: Date,
	},
	youtubeId: {
		type: String,
	},
	thumbnail: {
		type: String,
	},
});

Youtube.attachSchema(youtubeSchema);

export { Youtube, youtubeSchema };
