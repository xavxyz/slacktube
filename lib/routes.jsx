import React from 'react';
import { mount } from 'react-mounter';

import Layout from '/lib/layouts/Layout.jsx';
import { Jumbotron } from '/lib/components/Jumbotron.jsx';

FlowRouter.route('/', {
	name: "add-to-slack",
	action (params, queryParams) {
		mount(Layout, { content: <Jumbotron { ...queryParams } /> });
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