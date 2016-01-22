var log=new Logger('black-ui-workspace');

Meteor.startup(function() {
    ReactiveTabs.createInterface({
        template: 'black_ui_workspace_tabs',
        onChange: function (slug, template) {
            log.debug('Change tab to ' + slug);
        }
    });

})

Template.black_ui_workspace.onCreated(function() {
    Session.set('myVal',"Something");
});


Template.black_ui_workspace.helpers({
    value: function() {
        return Session.get('myVal');
    },
    activetab: function () {
        return 'test-second'
    },
    workspaceTabs: function () {
        let tabs = [
            {
                name: 'Number One',
                slug: 'test-first'
            },
            {
                name: 'Number Two',
                slug: 'test-second'
            }
        ];
        return tabs;
    }
});