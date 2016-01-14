Startupfood = new Mongo.Collection("startupfood");

let startupfoodSchema = new SimpleSchema({
	title: {
		type: String
	},
	publishedAt: {
		type: Number
	},
	youtubeId: {
		type: String
	}
});

Startupfood.attachSchema(startupfoodSchema);
