//TODO Remove from production - or better, make into a configurable item
Logger.setLevel('debug');


//////////////////////////
// General utility functions
//
Black.utilities.getUserLanguage = function () {
    var user = Meteor.user();

    return (user && user.language) ? user.language : "en";    // Default to English
};
