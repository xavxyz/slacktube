Startupfood = new Mongo.Collection("startupfood");

Startupfood.deny({
	insert() { return true; },
	update() { return true; },
	remove() { return true; }
});

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
