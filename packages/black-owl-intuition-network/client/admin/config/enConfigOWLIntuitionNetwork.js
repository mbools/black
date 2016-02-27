let log = new Logger('enConfigOWLIntuitionNetwork');
const udpGroupPatt = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
let formValid = new ReactiveVar(true);
let udpInUse = new ReactiveVar(false);
let portValid = new ReactiveVar(true);
let udpGroupValid = new ReactiveVar(true);
let showOWL = new ReactiveVar(false);

let parentStopped = new ReactiveVar(false);

Template.enConfigOWLIntuitionNetwork.helpers({
    detectedDevices() {
        return true;
    }
});

////////////////////////////////////////////
//
Template.enConfigOWLIntuitionNetworkForm.onCreated(function () {
    this.autorun(() => {
        this.subscribe('udpListenerDevices');
    });
    if (Template.currentData()._id) {
        this.autorun(() => {
            this.subscribe('physicalDevice', Template.currentData()._id);
            this.subscribe('OWLDetectedDevices', Template.currentData()._id);
            parentStopped.set(!Black.Collections.Devices.findOne({_id: Template.currentData()._id}).running);
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
        evt.stopPropagation();
        let dev = Black.Collections.Devices.findOne({_id: Template.currentData()._id});
        // The form may not be showing various form elements, in which case thay don't exist in the DOM
        // so we check them and where they're missing just leave the stord values alone
        let portfield = $('#ConfigOWLIntuitionNetworkForm_port');
        if (portfield.length) {
            dev.port = portfield.val();
        }
        let udpgfield = $('#ConfigOWLIntuitionNetworkForm_udpgroup');
        if (udpgfield.length) {
            dev.udpgroup = udpgfield.val();
        }
        let autostartfield = $('#ConfigOWLIntuitionNetworkForm_autostart');
        if (autostartfield.length) {
            dev.startOnServerStart = autostartfield.prop('checked');
        }
        if ($('#ConfigOWLIntuitionNetworkForm_backfill').prop('checked')) {
            dev.backfill = {
                active: true,
                username: $('#ConfigOWLIntuitionNetworkForm_backfill_username').val(),
                password: $('#ConfigOWLIntuitionNetworkForm_backfill_password').val()
            };
        }
        else {
            if (dev.backfill) {
                dev.backfill.active = false;
                // username and password are left as whatever the user previously entered
            }
        }
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
        evt.stopPropagation();
        checkFormValid();
    },
    'keyup #ConfigOWLIntuitionNetworkForm_udpgroup, change #ConfigOWLIntuitionNetworkForm_udpgroup': function (evt) {
        evt.preventDefault();
        evt.stopPropagation();
        checkFormValid();
    },
    'click #runButton': function (evt) {
        evt.preventDefault();
        evt.stopPropagation();
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
        evt.stopPropagation();
        let orig = Black.Collections.Devices.findOne({_id: Template.currentData()._id});
        $('#ConfigOWLIntuitionNetworkForm_port').val(orig.port).change();
        $('#ConfigOWLIntuitionNetworkForm_udpgroup').val(orig.udpgroup).change();
        $('#ConfigOWLIntuitionNetworkForm_autostart').prop('checked', orig.startOnServerStart).trigger('change');
        if (orig.hasOwnProperty('backfill')) {
            $('#ConfigOWLIntuitionNetworkForm_backfill').prop('checked', orig.backfill.active).trigger('change');
            $('#ConfigOWLIntuitionNetworkForm_backfill_username').val(orig.backfill.username).change();
            $('#ConfigOWLIntuitionNetworkForm_backfill_password').val(orig.backfill.password).change();
        }
        else {
        }
    },
    'change #ConfigOWLIntuitionNetworkForm_backfill': function (evt) {
        evt.preventDefault();
        evt.stopPropagation();
        showOWL.set($('#ConfigOWLIntuitionNetworkForm_backfill').prop('checked'));
    }
});

Template.enConfigOWLIntuitionNetworkForm.helpers({
    port() {
        return Black.Collections.Devices.findOne({_id: Template.currentData()._id}).port;
    },
    portInvalid() {
        return portValid.get() ? '' : 'has-error';
    },
    udpgroup() {
        return Black.Collections.Devices.findOne({_id: Template.currentData()._id}).udpgroup;
    },
    udpgroupInvalid() {
        return udpGroupValid.get() ? '' : 'has-error';
    },
    username() {
        let backfill = Black.Collections.Devices.findOne({_id: Template.currentData()._id}).backfill;
        if (backfill) {
            return backfill.username;
        }
        return '';
    },
    password() {
        let backfill = Black.Collections.Devices.findOne({_id: Template.currentData()._id}).backfill;
        if (backfill) {
            return backfill.password;
        }
        return '';
    },
    showOWLFields() {
        return showOWL.get();
    },
    backfillChecked() {
        let dev = Black.Collections.Devices.findOne({_id: Template.currentData()._id});
        if (dev.hasOwnProperty('backfill') && dev.backfill.active) {
            showOWL.set(true);
            return 'checked';
        }
        else {
            showOWL.set(false);
            return '';
        }
    },
    autostartChecked() {
        return (Black.Collections.Devices.findOne({_id: Template.currentData()._id}).startOnServerStart) ? 'checked' : '';
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
        return (udpInUse.get()) ? 'has-error' : '';
    }
});






Template.enConfigOWLIntuitionNetworkDetectedDevTable.helpers({
    isRunning() {
        return Black.Collections.Devices.findOne({_id: Template.currentData()._id}).running;
    },
    detectedDevices() {
        return Black.Collections.Devices.find({parent: Template.currentData()._id});
    }
});



///////////////////////////////////
//

function portIsValid(port) {
    portValid.set(!isNaN(port) && (port > 0 && port < 65535));
    return portValid.get();
}

function udpgroupIsValid(udpgroup) {
    udpGroupValid.set(udpGroupPatt.test(udpgroup));
    return udpGroupValid.get();
}

function comboInUseByAnother(port, udpgroup) {
    let existingDev = Black.Collections.Devices.findOne({'port': port, 'udpgroup': udpgroup});
    udpInUse.set(existingDev && existingDev._id !== Template.currentData()._id);
}

function checkFormValid() {
    comboInUseByAnother($('#ConfigOWLIntuitionNetworkForm_port').val(), $('#ConfigOWLIntuitionNetworkForm_udpgroup').val());
    formValid.set(portIsValid($('#ConfigOWLIntuitionNetworkForm_port').val()) &&
        udpgroupIsValid($('#ConfigOWLIntuitionNetworkForm_udpgroup').val()) && !udpInUse.get());
}