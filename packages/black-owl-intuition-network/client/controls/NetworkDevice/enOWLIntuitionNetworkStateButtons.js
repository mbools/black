Template.enOWLIntuitionNetworkStateButtons.events({
    'click .OWLrunning': function (evt) {
        evt.preventDefault();
        evt.stopPropagation();
        let devId = $(evt.target).closest('[data-device]')[0].dataset['device'];
        if (devId) {
            let realdev = Black.Collections.Devices.findOne({_id: devId});
            if (realdev) {
                if (Black.Collections.Devices.findOne({_id: devId}).running) {
                    Meteor.call('black_stopOWLNetwork', devId);
                }
                else {
                    Meteor.call('black_startOWLNetwork', devId);
                }
            }
            else {
                log.error(`Associated device (${devId}) not found.`);
            }
        }
        else {
            log.error("data-device attribute required on parent TR element ");
        }
    },
});

Template.enOWLIntuitionNetworkStateButtons.helpers({
    running() {
        let devId = Template.currentData()._id;
        let realdev = Black.Collections.Devices.findOne({_id: devId});
        if (realdev) {
            return Black.Collections.Devices.findOne({_id: devId}).running;
        }
        return false;
    }
});