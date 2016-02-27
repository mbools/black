let log = new Logger("DeletePhysDevButton");

Template.DeletePhysDevButton.onCreated(function () {
    if (Roles.userIsInRole(Meteor.userId, 'admin')) {
        this.autorun(() => {
            this.subscribe("physicalDevices");
        });
        this.deleteConfirmed = false;
    }
})

Template.DeletePhysDevButton.helpers({
    isNotRunning() {
        let realDev = Black.Collections.Devices.findOne({_id: this.dev});
        if (realDev) {
            return realDev.running ? 'disabled' : '';
        }
        return '';
    },
    name() {
        let realDev = Black.Collections.Devices.findOne({_id: this.dev});
        if (realDev) {
            return realDev.header.name;
        }
        return 'Unknown';
    },
    modalDelete() {
        let realDev = Black.Collections.Devices.findOne({_id: this.dev});
        if (realDev && realDev.ui) {
            return !realDev.ui.hasOwnProperty('deleteTemplate') || realDev.ui.deleteTemplate.endsWith('Modal');
        }
        return true;
    },
    simpleDelete() {
        let realDev = Black.Collections.Devices.findOne({_id: this.dev});
        if (realDev && realDev.ui) {
            return !realDev.ui.hasOwnProperty('deleteTemplate');
        }
        return true;
    },
    deleteTemplate() {
        let realDev = Black.Collections.Devices.findOne({_id: this.dev});
        if (realDev && realDev.ui) {
            return Black.utilities.getUserLanguage() + realDev.ui.deleteTemplate;
        }
    }
});

Template.DeletePhysDevButton.events({
    'hidden.bs.modal .modal': function (evt) {
        // We have to wait for the modal to close completely otherwise
        // there's a race condition error where Meteor updates the DOM (due to
        // change in devicelist, for example) before the modal transition completes.
        // This leaves the modal part closed (e.g. background greyed out).
        if (this.deleteConfirmed) {
            try {
                let realDev = Black.Collections.Devices.findOne({_id: this.dev});
                if (realDev) {
                    Meteor.call('black_deletePhysicalDevice', realDev._id);
                }
                else {
                    log.error(`No such device (${this.dev}) found.`);
                }
            }
            finally {
                this.deleteConfirmed = false;   // Just in case something goes wrong and we need to rerun the mdoal
            }
        }
    },
    'click button.confirmed': function (evt) {
        evt.preventDefault();
        evt.stopPropagation();
        this.deleteConfirmed = true;
    }
});


let _deletePath = function (devId) {
    let deleteDevice = devId;
    let dev = Black.Collections.Devices.findOne({_id: devId});
    if (dev && dev.header && dev.header.factory) {
        return FlowRouter.path('deletePhysDevices', {device: deleteDevice});
    }
    return '';
}