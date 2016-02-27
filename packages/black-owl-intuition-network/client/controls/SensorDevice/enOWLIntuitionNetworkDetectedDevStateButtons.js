
Template.enOWLIntuitionNetworkDetectedDevStateButtons.events({
    'click .OWLwatch': function (evt) {
        evt.preventDefault();
        evt.stopPropagation();
        let device=$(evt.target).closest('[data-device]')[0].dataset['device'];
        if (device) {
            let realdev = Black.Collections.Devices.findOne({_id: device});
            if (realdev) {
                Meteor.call("toggleWatch", realdev._id);
            }
            else {
                log.error(`Associated device (${device}) not found.`);
            }
        }
        else {
            log.error("data-device attribute required on parent element ");
        }
    },
    'click .OWLrecord': function (evt) {
        evt.preventDefault();
        evt.stopPropagation();
        let device=$(evt.target).closest('[data-device]')[0].dataset['device'];
        if (device) {
            let realdev = Black.Collections.Devices.findOne({_id: device});
            if (realdev) {
                Meteor.call("toggleRecord", realdev._id);
            }
            else {
                log.error(`Associated device (${device}) not found.`);
            }
        }
        else {
            log.error("data-device attribute required on parent TR element ");
        }
    }

});
