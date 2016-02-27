let log = new Logger("enDeleteOWLIntuitionNetworkModal");

Template.enDeleteOWLIntuitionNetworkModal.onCreated(function () {
    if (Roles.userIsInRole(Meteor.userId, 'admin')) {
        this.autorun(() => {
            this.subscribe('physicalDevices');
        });
    }
});

Template.enDeleteOWLIntuitionNetworkModal.helpers({
    name() {
        let realDev = Black.Collections.Devices.findOne({_id: this.dev});
        if (realDev) {
            return realDev.header.name;
        }
    },
    hasChildren() {
        let children = Black.Collections.Devices.find({parent: this.dev});
        if (children.count() > 0) {
            return true;
        }
        return false;
    },
    childDevices() {
        return Black.Collections.Devices.find({parent: this.dev});
    }
});