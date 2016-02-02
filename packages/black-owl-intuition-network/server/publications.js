Meteor.publish("OWLDetectedDevices", function (parentId) {  // Publish additional user account data
    if (this.userId) {
        return Black.Collections.Devices.find({parent: parentId});
    } else {
        this.ready();
    }
});