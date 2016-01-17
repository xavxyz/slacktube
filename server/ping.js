Meteor.setInterval(function() {
	// keep alive the site (useful when hosted on startupfood.meteor.com)
	HTTP.get(Meteor.absoluteUrl(), function(err,res) {
		console.log('pinged site');
	});
	// ask youtube for a new video
	Meteor.call('pingYoutube', function(err,res) {
		console.log('pinged youtube');
	});
}, 300000); // every 5 minutes

