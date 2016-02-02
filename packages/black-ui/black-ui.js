////////////////////////////////////////////////////////////////////
//
// The main support functions (helpers, default configuration, event, etc. for the main interface elements)
//
////////////////////////////////////////////////////////////////////



////////////////////////////////////////////////////////////////////
// Routing stub
//
// Separate routing package details from general app code.
Meteor.navigateTo = function (path) {
    // ...over-ridden in routing.js
};

////////////////////////////////////////////////////////////////////
// User accounts odds and ends
//

Accounts.ui.config({passwordSignupFields: 'USERNAME_ONLY'});



////////////////////////////////////////////////////////////////////
// Initialise other packages and globals
//
Meteor.startup(function() {
    Session.set("showLoadingIndicator", true);

    TAPi18n.setLanguage(Black.utilities.getUserLanguage())
        .done(function () {
            Session.set("showLoadingIndicator", false);
        })
        .fail(function (error_message) {
            // Handle the situation
            console.log(error_message);
        });
});


///////////////////////////////////////////////////////////////////
// Global template support

Template.registerHelper('userLevelIs', (level) => {
    let user = Meteor.user();
    let detailLevel = level;
    if (typeof level === 'string') {
        detailLevel = Black.Constants.detailLevel[level];
    }
    if (user) {
        return (user.profile.detailLevel === detailLevel)
    }
    return false;
});

Template.registerHelper('userLevelAbove', (level) => {
    let user = Meteor.user();
    let detailLevel = level;
    if (typeof level === 'string') {
        detailLevel = Black.Constants.detailLevel[level];
    }
    if (user) {
        return (user.profile.detailLevel > detailLevel)
    }
    return false;
});


Template.registerHelper('userLevelIsOrAbove', (level) => {
    let user = Meteor.user();
    let detailLevel = level;
    if (typeof level === 'string') {
        detailLevel = Black.Constants.detailLevel[level];
    }
    if (user) {
        return (user.profile.detailLevel >= detailLevel)
    }
    return false;
});

Template.registerHelper('userLevelBelow', (level) => {
    let user = Meteor.user();
    let detailLevel = level;
    if (typeof level === 'string') {
        detailLevel = Black.Constants.detailLevel[level];
    }
    if (user) {
        return (user.profile.detailLevel < detailLevel)
    }
    return true;
});


Template.registerHelper('userLevelIsOrBelow', (level) => {
    let user = Meteor.user();
    let detailLevel = level;
    if (typeof level === 'string') {
        detailLevel = Black.Constants.detailLevel[level];
    }
    if (user) {
        return (user.profile.detailLevel <= detailLevel)
    }
    return true;
});


///////////////////////////////////////////////////////////////////
// Core data subscriptions
//
Meteor.subscribe("userData");   // Additional user data
