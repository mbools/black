/////////////////////////////
// Server specific core


Meteor.startup(function () {
    // Ensure that the admin user exists and has correct roles
    // Since this user MUST exist the account creation is hardcoded
    var admin = Meteor.users.findOne({username: "admin"});
    if (!admin) {
        // Create a default admin account with default password
        var id = Accounts.createUser({
            username: "admin",
            password: "administrator"
        });
        // and add them to the correct roles
        Roles.addUsersToRoles(id, ["admin"]);
    }
    else {
        // Just check the role assignment
        Roles.addUsersToRoles(admin._id, ["admin"]);
    }


    // Expand the user's profile with key Core profile entries
    //
    Accounts.onCreateUser(function (options, user) {
        if (options.profile) {  // In case the login method passes us some profile data
            user.profile = options.profile;
        }

        if (user.profile === undefined) {   // Make sure we have a profile
            user.profile = {};
        }

        // Now feed it our settings
        _.extend(user.profile, {detailLevel: Black.Constants.detailLevel.NOVICE});

        return user;
    });
});

/////////////////////////////////////////////////////////////////////
// Publish the additional core data
//
Meteor.publish("userData", function () {  // Publish additional user account data
    if (this.userId) {
        return Meteor.users.find({_id: this.userId},
            {fields: {language: 1}}); // Language selected by user
    } else {
        this.ready();
    }
});

