Slackteams = new Mongo.Collection("slackteams");

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
