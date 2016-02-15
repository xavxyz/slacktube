FlowRouter.route('/', {
	name: "add-to-slack",
	action (params, queryParams) {
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

FlowRouter.route('/video/:videoId', {
	name: "video",
	action (params, queryParams) {
		if (params.videoId) {
			analytics.page(`video ${params.videoId}`);
			window.location = `https://youtube.com/watch?v=${params.videoId}`;
		}
	}
});

FlowRouter.route('/channel', {
	name: "channel",
	action (params, queryParams) {
		analytics.page(`channel`);
		window.location = 'https://www.youtube.com/user/Startupfood';
	}
});