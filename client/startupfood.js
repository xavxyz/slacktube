Template.startupfood.helpers({
	clientId: function() {
		return Meteor.settings.public.clientId;
	},
	redirectUri: function() {
		return Meteor.absoluteUrl();
	}
});