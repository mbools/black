const log = new Logger('adminCreatePhysicalDevice');


Template.adminCreatePhysicalDevice.onCreated(function () {
    this.autorun(() => {
        let template = FlowRouter.getParam('template');
        if (template) {
            this.subscribe("deviceTemplate", template);
        }
    });
});

Template.adminCreatePhysicalDevice.onRendered(function () {
    Session.set(Black.SessionVars.EDITING_PHYS_DEV, undefined);
});

Template.adminCreatePhysicalDevice.helpers({
        template: function () {
            let template = null;
            template = FlowRouter.getParam('template');

            let deviceTemplate = Black.Collections.DeviceTemplates.findOne({_id: template});
            if (deviceTemplate.ui && deviceTemplate.ui.createTemplate) {

                return Black.utilities.getUserLanguage() + deviceTemplate.ui.createTemplate;
            }
            else {
                return Black.utilities.getUserLanguage() + "Error";
            }
        },
        device: function () {
            if (!Session.get(Black.SessionVars.EDITING_PHYS_DEV)) {
                let template = FlowRouter.getParam('template');
                let devFactoryName = deviceFactoryName(template);
                if (devFactoryName) {
                    createDevice(devFactoryName).then(newDev => {
                        Session.set(Black.SessionVars.EDITING_PHYS_DEV, newDev);
                    }).catch(error => {
                        log.error(error.reason);
                    })
                }
                else {
                    throw new Error("No device factory for physicalDevice templateId: " + template);
                }

            }
            return Session.get(Black.SessionVars.EDITING_PHYS_DEV);
        }
    }
);


/////////////////////////////////////////////////////////////////
// Local utility functions
//

///////////////
// createDevice()
// Create a device using the relevant factory method. It is in the hands
// of the plugin author whether the device is completely created or a skeleton
// device is created.
let createDevice = function (factory) {
    return new Promise((resolve, reject) => {
        Meteor.call('createPhysicalDevice', factory, (error, result) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(JSON.parse(result));
            }
        });
    });
};

let deviceFactoryName = function (template) {
    if (template) {
        let deviceTemplate = Black.Collections.DeviceTemplates.findOne({_id: template});
        if (deviceTemplate && deviceTemplate.header && deviceTemplate.header.factory) {
            return deviceTemplate.header.factory;
        }
    }
    return '';
};
