let log = new Logger('enConfigOWLIntuitionNetwork');
const udpGroupPatt = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
let formValid = new ReactiveVar(true);
let udpInUse = new ReactiveVar(false);

Template.enConfigOWLIntuitionNetwork.helpers({});

////////////////////////////////////////////
//
Template.enConfigOWLIntuitionNetworkForm.onCreated(function () {
    this.autorun(() => {
        this.subscribe('udpListenerDevices');
    });
    if (Template.currentData()._id) {
        this.autorun(() => {
            this.subscribe('physicalDevice', Template.currentData()._id);
        });
    }
    else {
        // Attempt to configure an unspecified device
        // TODO how to handle error pages/messages to the user
    }
});

Template.enConfigOWLIntuitionNetworkForm.onRendered(function () {

});


Template.enConfigOWLIntuitionNetworkForm.events({
    'submit form': function (evt) {
        evt.preventDefault();
        let dev = Black.Collections.Devices.findOne({_id: Template.currentData()._id});
        dev.port = $('#ConfigOWLIntuitionNetworkForm_port').val();
        dev.udpgroup = $('#ConfigOWLIntuitionNetworkForm_udpgroup').val();
        Meteor.call('black_configOWLNetwork', dev, (error, result) => {
            if (error) {
                log.error(error.reason);
            }
            else {
                if (result) {
                    // All good
                }
                else {
                    log.error(`Server responded with unnexpected device port or udpgroup: expected(${dev.port} & ${dev.udpgroup}) received(${result.port} & ${result.udpgroup})`);
                }
            }
        });
    },
    'keyup #ConfigOWLIntuitionNetworkForm_port, change #ConfigOWLIntuitionNetworkForm_port': function (evt) {
        evt.preventDefault();
        checkFormValid();
    },
    'keyup #ConfigOWLIntuitionNetworkForm_udpgroup, change #ConfigOWLIntuitionNetworkForm_udpgroup': function (evt) {
        evt.preventDefault();
        checkFormValid();
    },
    'click #runButton': function (evt) {
        evt.preventDefault();
        let dev = Black.Collections.Devices.findOne({_id: Template.currentData()._id});
        dev.port = $('#ConfigOWLIntuitionNetworkForm_port').val();
        dev.udpgroup = $('#ConfigOWLIntuitionNetworkForm_udpgroup').val();
        if (Black.Collections.Devices.findOne({_id: Template.currentData()._id}).running) {
            Meteor.call('black_stopOWLNetwork', dev._id);
        }
        else {
            Meteor.call('black_startOWLNetwork', dev._id);
        }
    },
    'click #resetButton': function (evt) {
        evt.preventDefault();
        let orig = Black.Collections.Devices.findOne({_id: Template.currentData()._id});
        $('#ConfigOWLIntuitionNetworkForm_port').val(orig.port).change();
        $('#ConfigOWLIntuitionNetworkForm_udpgroup').val(orig.udpgroup).change();
    }
});

Template.enConfigOWLIntuitionNetworkForm.helpers({
    port() {
        return Black.Collections.Devices.findOne({_id: Template.currentData()._id}).port;
    },
    udpgroup() {
        return Black.Collections.Devices.findOne({_id: Template.currentData()._id}).udpgroup;
    },
    isRunning() {
        return Black.Collections.Devices.findOne({_id: Template.currentData()._id}).running;
    },
    formInvalid() {
        return formValid.get() ? '' : 'disabled';
    },
    formDisabled() {
        return (Black.Collections.Devices.findOne({_id: Template.currentData()._id}).running) ? 'disabled' : '';
    },
    conflicted() {
        return (udpInUse.get()) ? 'alert-danger' : '';
    }
});


///////////////////////////////////
//

function portValid(port) {
    return (!isNaN(port) && (port > 0 && port < 65535));
}

function udpgroupValid(udpgroup) {
    return udpGroupPatt.test(udpgroup);
}

function comboInUseByAnother (port, udpgroup) {
    let existingDev = Black.Collections.Devices.findOne({'port': port, 'udpgroup': udpgroup});
    udpInUse.set(existingDev && existingDev._id !== Template.currentData()._id);
}

function checkFormValid() {
    comboInUseByAnother($('#ConfigOWLIntuitionNetworkForm_port').val(), $('#ConfigOWLIntuitionNetworkForm_udpgroup').val());
    formValid.set(portValid($('#ConfigOWLIntuitionNetworkForm_port').val()) &&
                  udpgroupValid($('#ConfigOWLIntuitionNetworkForm_udpgroup').val()) &&
                  !udpInUse.get());
}