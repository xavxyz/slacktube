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
	"messages.$.postId": {
		type: String
	},
	"messages.$.ts": {
		type: Number
	}
});

Slackteams.attachSchema(slackSchema);
