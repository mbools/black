Template.helpModal.helpers({
    activeHelp: function () {
        return Session.get('activeHelp');
    },
    activeHelpTitle: function () {
        return Session.get('activeHelp') + "_title";
    },
});
