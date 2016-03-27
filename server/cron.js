SyncedCron.options = {
	log: false,
	collectionName: 'cronHistory',
	utc: false,
	collectionTTL: 172800
};

var addJob = function () {
	SyncedCron.add({
		name: 'Ping YouTube',
		schedule: function(parser) {
			return parser.text('every 5 minutes');
		},
		job: 	Meteor.call('pingYoutube')
	});
};

Meteor.startup(function () {
	addJob();
});