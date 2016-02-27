Template.ConfigPhysDevButton.helpers({
    configPath(devId) {
        return _configPath(devId);
    },
    onConfigPage(devId) {
        return (_configPath(devId) === FlowRouter.current().path);
    }
});


let _configPath = function(devId) {
    let configDevice = devId;
    let dev = Black.Collections.Devices.findOne({_id: devId});
    if (dev.configDevice && dev.configDevice !== devId) {   // This device is configured through another device
        configDevice = dev.configDevice;
        dev = Black.Collections.Devices.findOne({_id: configDevice});
    }
    if (dev && dev.header && dev.header.factory) {
        return FlowRouter.path('configPhysDevices', {device: configDevice});
    }
    return '';
}