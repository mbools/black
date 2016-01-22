/////////////////////////////////////////////////////////////////
//
// All of the general support functions (helpers, event, etc.) for the main layout
//
/////////////////////////////////////////////////////////////////


Template.onlyIfLoggedIn.helpers({
    authInProcess: function() {
        return Meteor.loggingIn();
    },
    isLoggedIn: function() {
        return !!Meteor.user();
    }
});