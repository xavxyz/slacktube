SyncedCron.options = {
	log: false,
	collectionName: 'cronHistory',
	utc: false,
	collectionTTL: 172800
};

var addJob = () => {
	SyncedCron.add({
		name: 'Ping YouTube',
		schedule: (parser) => parser.text('every 5 minutes'),
		job: () => Meteor.call('pingYoutube'),
	});
};

Meteor.startup(() => {
	addJob();
});