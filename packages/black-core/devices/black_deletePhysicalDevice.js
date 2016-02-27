let log = new Logger("black_deletePhysicalDevice");

Meteor.methods({
    // By default, deleting a physical device will delete any children devices too
    black_deletePhysicalDevice(devId) {
        if (Roles.userIsInRole(this.userId, 'admin')) {
            try {
                Black.Collections.Devices.remove({_id: devId});
                _deleteChildren(devId);
            }
            catch (e) {
                log.error(`Unable to delete physical device (${devId}): ${e}`);
            }
        }
        else {
            // TODO Tell them they're very naughty
        }
    }
});

let _deleteChildren = function (devId) {
    Black.Collections.Devices.find({parent: devId})
        .forEach((child) => {
            _deleteChildren(child._id);
        });
    Black.Collections.Devices.remove({_id: devId});
}