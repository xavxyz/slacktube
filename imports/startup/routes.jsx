import React from 'react';
import { mount } from 'react-mounter';

import { FlowRouter } from 'meteor/kadira:flow-router-ssr'

import Layout from '/imports/ui/layouts/Layout.jsx';
import { Jumbotron } from '/imports/ui/components/Jumbotron.jsx';

FlowRouter.route('/', {
	name: "add-to-slack",
	action (params, queryParams) {
		mount(Layout, { content: <Jumbotron { ...queryParams } /> });
	}
});