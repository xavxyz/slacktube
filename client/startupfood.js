Template.startupfood.helpers({
	clientId() {
		return Meteor.settings.public.clientId;
	},
	redirectUri() {
		return Meteor.absoluteUrl();
	}
});