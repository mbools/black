/**
 * Publish physical device template details to logged in users
 */
Meteor.publish("deviceTemplates", function (typeFilter) {
    if (this.userId) {
        const availableTypes = Object.keys(Black.Constants.deviceTypes).map(key => Black.Constants.deviceTypes[key]);
        if (typeFilter) {
            let filterIn = (typeof typeFilter === 'string') ? [typeFilter] : typeFilter;
            let filter = filterIn.filter(x => availableTypes.indexOf(x) !== -1);
            if (filter.length > 0) {
                return Black.Collections.DeviceTemplates.find({type: {$in: filter}});
            }
        }
        else {  // Return everything
            return Black.Collections.DeviceTemplates.find();
        }
    }
    this.ready();   // Basically, user not logged in, or no valid typeFilter
});

Meteor.publish("deviceTemplate", function (template) {  // Publish additional user account data
    if (this.userId) {
        return Black.Collections.DeviceTemplates.find({_id: template});
    } else {
        this.ready();
    }
});


