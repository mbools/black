let log = new Logger('enCreateOWLIntuitionNetwork');
let devRunning = new ReactiveVar(false);
let udpInUse = new ReactiveVar(false);
let formValid = new ReactiveVar(true);
let portValid = new ReactiveVar(true);
let udpGroupValid = new ReactiveVar(true);

const udpGroupPatt = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;

Template.enCreateOWLIntuitionNetwork.helpers({});

////////////////////////////////////////////
//
Template.enCreateOWLIntuitionNetworkForm.onCreated(function () {
    this.origDev = Object.create(Session.get(Black.SessionVars.EDITING_PHYS_DEV));
        this.autorun(() => {
            this.subscribe('udpListenerDevices');
        });
});

Template.enCreateOWLIntuitionNetworkForm.onRendered(function () {
});


Template.enCreateOWLIntuitionNetworkForm.events({
    'submit form': function (evt) {
        evt.preventDefault();
        evt.stopPropagation();
        let dev = Session.get(Black.SessionVars.EDITING_PHYS_DEV);
        Meteor.call('black_createOWLNetwork', dev, (error, result) => {
            if (error) {
                log.error(error.reason);
            }
            else {
                if (dev.port === result.port && dev.udpgroup === result.udpgroup) {
                    FlowRouter.go('configPhysDevices', {device: result._id});
                }
                else {
                    log.error(`Server responded with unnexpected device port or udpgroup: expected(${dev.port} & ${dev.udpgroup}) received(${result.port} & ${result.udpgroup})`);
                }
            }
        });
    },
    'keyup #CreateOWLIntuitionNetworkForm_port, change #CreateOWLIntuitionNetworkForm_port': function (evt) {
        evt.preventDefault();
        evt.stopPropagation();
        let port = evt.target.value;
        let dev = Session.get(Black.SessionVars.EDITING_PHYS_DEV);
        dev.port = $('#CreateOWLIntuitionNetworkForm_port').val();
        Session.set(Black.SessionVars.EDITING_PHYS_DEV, dev);
    },
    'keyup #CreateOWLIntuitionNetworkForm_udpgroup, change #CreateOWLIntuitionNetworkForm_udpgroup': function (evt) {
        evt.preventDefault();
        evt.stopPropagation();
        let udpgroup = evt.target.value;
        let dev = Session.get(Black.SessionVars.EDITING_PHYS_DEV);
        dev.udpgroup = udpgroup;
        Session.set(Black.SessionVars.EDITING_PHYS_DEV, dev);
    },
    'click #runButton': function (evt) {
        evt.preventDefault();
        evt.stopPropagation();
        log.debug(`runButton clicked and will ${evt.target.value}`);
        let dev = Session.get(Black.SessionVars.EDITING_PHYS_DEV);
        dev.port = $('#CreateOWLIntuitionNetworkForm_port').val();
        dev.udpgroup = $('#CreateOWLIntuitionNetworkForm_udpgroup').val();
        Session.set(Black.SessionVars.EDITING_PHYS_DEV, dev);
    },
    'click #resetButton': function (evt, template) {
        evt.preventDefault();
        evt.stopPropagation();
        $('#CreateOWLIntuitionNetworkForm_port').val(Template.instance().origDev.port).change();
        $('#CreateOWLIntuitionNetworkForm_udpgroup').val(Template.instance().origDev.udpgroup).change();
    }
});

Template.enCreateOWLIntuitionNetworkForm.helpers({
    port() {
        let dev = Session.get(Black.SessionVars.EDITING_PHYS_DEV);
        return dev.port;
    },
    portInvalid() {
        return portValid.get() ? '' : 'has-error';
    },
    udpgroup() {
        let dev = Session.get(Black.SessionVars.EDITING_PHYS_DEV);
        return dev.udpgroup;
    },
    udpgroupInvalid() {
        return udpGroupValid.get() ? '' : 'has-error';
    },
    formInvalid() {
        let dev = Session.get(Black.SessionVars.EDITING_PHYS_DEV);
        return (!portIsValid(dev.port) || !udpgroupIsValid(dev.udpgroup) || udpInUse.get()) ? 'disabled' : '';
    },
    formDisabled() {
        return (devRunning.get()) ? 'disabled' : '';
    },
    conflicted() {
        let dev = Session.get(Black.SessionVars.EDITING_PHYS_DEV);
        comboInUseByAnother(dev.port, dev.udpgroup);
        return (udpInUse.get()) ? 'has-error' : '';
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
    udpInUse.set(existingDev !== undefined);
}
