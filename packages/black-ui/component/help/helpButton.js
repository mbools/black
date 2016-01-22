'use strict';

const HELPNOTFOUND = "helpPageNotFound";

Template.body.events({
    'click button.help': function (event, template) {
        let doc = $(event.currentTarget).data('help-template');
        let userLang = Black.utilities.getUserLanguage();
        let templateName = `${userLang}_${doc}`;
        if (!Template[templateName]) {
            templateName = `en_${doc}`; // Fallback to English
        }
        if (!Template[templateName]) { // Still not found, so probably an error! But display default page anyway
            templateName = `${userLang}_${HELPNOTFOUND}`;
            if (!Template[templateName]) {
                templateName = `en_${HELPNOTFOUND}`; // Fallback to English
            }
        }

        Session.set('activeHelp', templateName);
        $('#helpModal').modal('show');
    }
});