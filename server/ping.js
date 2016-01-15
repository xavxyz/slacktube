/*
Meteor.setInterval(function() {
	HTTP.get(Meteor.absoluteUrl(), function(err,res) {
		console.log('pinged site');
	});
	Meteor.call('pingYoutube', function(err,res) {
		console.log('pinged youtube');
		if (res !== undefined) {
			Meteor.call('sendToSlack', res);
		}
	});
}, 60000); // every 5 minutes (300000)
*/
