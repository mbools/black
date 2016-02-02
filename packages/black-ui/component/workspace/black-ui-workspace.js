var log=new Logger('black-ui-workspace');


Template.black_ui_workspace.onCreated(function() {
    Session.set('myVal',"Something");
});


Template.black_ui_workspace.helpers({
    value: function() {
        return Session.get('myVal');
    },
});