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
            return (devId && PhysicalDevices.findOne({_id: devId}));
        },
        template: function () {
            let devFactoryName = null;
            let devId = FlowRouter.getParam('device');
            if (devId) {
                let device = Black.Collections.Devices.findOne({_id: devId});
                if (device) {
                    devFactoryName = device.header.factory; // The factory  used to create this device
                }
            } else {
                // TODO Problem
            }

            if (devFactoryName) {
                return Black.utilities.getUserLanguage() + 'Config' + devFactoryName;
            }
            else {
                return Black.utilities.getUserLanguage() + "Error";
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
