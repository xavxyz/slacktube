FlowRouter.route('/', {
	name: "add-to-slack",
	action: function(params, queryParams) {
		if (queryParams.code) {
			Meteor.call('requestSlackToken', queryParams.code);
			Bert.alert("Your Slack team is now connected to our Youtube channel! Hooray! 🎉 🎉", "success");
		}
		BlazeLayout.render("default", {yield: "startupfood"});
	}
});