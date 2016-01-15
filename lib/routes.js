FlowRouter.route('/', {
	name: "add-to-slack",
	action: function(params, queryParams) {
		if (queryParams.code) {
			Meteor.call("requestSlackToken", queryParams.code);
			Bert.alert({
				title: "Slack team connected",
				message: "Hooray! 📺",
				type: 'warning',
				style: 'growl-top-right',
				icon: 'fa-youtube-play'
			});
		}
		BlazeLayout.render("default", {yield: "startupfood"});
	}
});