const log = new Logger('adminCreatePhysicalDevice');


Template.adminConfigPhysicalDevice.onCreated(function () {
    this.autorun(() => {
        let devId = FlowRouter.getParam('device');
        this.subscribe("physicalDevice", devId);
    });
});

Template.adminConfigPhysicalDevice.onRendered(function () {
    Session.set(Black.SessionVars.EDITING_PHYS_DEV, undefined);
});

Template.adminConfigPhysicalDevice.helpers({
        deviceExists: function () {
            let devId = FlowRouter.getParam('device');
            return (devId && Black.Collections.Devices.findOne({_id: devId}));
        },
        template: function () {
            let devFactoryName = null;
            let devId = FlowRouter.getParam('device');
            if (devId) {
                let device = Black.Collections.Devices.findOne({_id: devId});
                if (device) {
                    if (device.ui.configTemplate) {
                        return Black.utilities.getUserLanguage() + device.ui.configTemplate;
                    }
                    else {
                        return Black.utilities.getUserLanguage() + "Error";
                    }
                }
            } else {
                // TODO Problem
            }

        },
        device: function () {
            if (!Session.get(Black.SessionVars.EDITING_PHYS_DEV)) {
                let devId = FlowRouter.getParam('device');
                if (devId) {
                    let dev = Black.Collections.Devices.findOne({_id: devId});
                    Session.set(Black.SessionVars.EDITING_PHYS_DEV, dev);
                }
                else {
                    // TODO Problem
                }
            }
            return Session.get(Black.SessionVars.EDITING_PHYS_DEV);
        }
    }
);


/////////////////////////////////////////////////////////////////
// Local utility functions
//
