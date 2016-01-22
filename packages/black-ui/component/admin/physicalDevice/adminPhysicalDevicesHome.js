Template.physicalDeviceList.onCreated( function () {
    //if (Meteor.user()) {
        this.autorun(() => {
            this.subscribe('physicalDevices');
        });
    //}
});

Template.physicalDeviceList.helpers({
    physicalDevices() {
        return Black.Collections.Devices.find({'header.type': Black.Constants.deviceTypes.PHYSICAL});
    }
});

Template.physicalDeviceStatus.helpers({
    configPath(devId) {
        return FlowRouter.path('configPhysDevices', {device: devId});
    }
});