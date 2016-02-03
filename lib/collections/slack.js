Slackteams = new Mongo.Collection("slackteams");

Slackteams.deny({
	insert() { return true; },
	update() { return true; },
	remove() { return true; }
});

let slackSchema = new SimpleSchema({
	accessToken: {
		type: String
	},
	createdAt: {
		type: Date
	},
	teamName: {
		type: String
	},
	channel: {
		type: String
	},
	messages: {
		type: [Object]
	},
	"messages.$.videoId": {
		type: String
	},
	"messages.$.ts": {
		type: String
	}
});

Slackteams.attachSchema(slackSchema);
