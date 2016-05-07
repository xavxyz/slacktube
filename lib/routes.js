FlowRouter.route('/', {
	name: "add-to-slack",
	action (params, queryParams) {
		const { code } =  queryParams;
		if (code) {
			Meteor.call("Slack.methods.requestSlackToken", { code });
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

FlowRouter.route('/video/:youtubeId', {
	name: "video",
	action (params, queryParams) {

		const { youtubeId } = params;

		if (youtubeId) {
			analytics.page(`video ${ youtubeId }`);
			window.location = `https://youtube.com/watch?v=${ youtubeId }`;
		}
	}
});

FlowRouter.route('/channel', {
	name: "channel",
	action (params, queryParams) {
		analytics.page(`channel`);
		window.location = `https://www.youtube.com/user/${ Meteor.settings.public.youtubeChannel }`;
	}
});