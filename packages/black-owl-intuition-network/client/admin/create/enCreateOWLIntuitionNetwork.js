let log = new Logger('enCreateOWLIntuitionNetwork');
let devRunning = new ReactiveVar(false);
const udpGroupPatt = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;

Template.enCreateOWLIntuitionNetwork.helpers({});

////////////////////////////////////////////
//
Template.enCreateOWLIntuitionNetworkForm.onCreated(function () {
    this.origDev = Object.create(Session.get(Black.SessionVars.EDITING_PHYS_DEV));

    if (Session.get(Black.SessionVars.EDITING_PHYS_DEV).hasOwnProperty('_id')) {
        this.autorun(() => {
            this.subscribe('phsyicalDevice', Session.get(Black.SessionVars.EDITING_PHYS_DEV)._id);
        });
    }
});

Template.enCreateOWLIntuitionNetworkForm.onRendered(function () {

});


Template.enCreateOWLIntuitionNetworkForm.events({
    'submit form': function (evt) {
        evt.preventDefault();
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
        let port = evt.target.value;
        let dev = Session.get(Black.SessionVars.EDITING_PHYS_DEV);
        dev.port = $('#CreateOWLIntuitionNetworkForm_port').val();
        Session.set(Black.SessionVars.EDITING_PHYS_DEV, dev);
        log.debug(`${evt.type} port now ${port} : ${evt.target.value}`);
    },
    'keyup #CreateOWLIntuitionNetworkForm_udpgroup, change #CreateOWLIntuitionNetworkForm_udpgroup': function (evt) {
        evt.preventDefault();
        let udpgroup = evt.target.value;
        let dev = Session.get(Black.SessionVars.EDITING_PHYS_DEV);
        dev.udpgroup = udpgroup;
        Session.set(Black.SessionVars.EDITING_PHYS_DEV, dev);
        log.debug(`udpgroup now ${udpgroup}`);
    },
    'click #runButton': function (evt) {
        evt.preventDefault();
        log.debug(`runButton clicked and will ${evt.target.value}`);
        let dev = Session.get(Black.SessionVars.EDITING_PHYS_DEV);
        dev.port = $('#CreateOWLIntuitionNetworkForm_port').val();
        dev.udpgroup = $('#CreateOWLIntuitionNetworkForm_udpgroup').val();
        Session.set(Black.SessionVars.EDITING_PHYS_DEV, dev);
    },
    'click #resetButton': function (evt, template) {
        evt.preventDefault();
        $('#CreateOWLIntuitionNetworkForm_port').val(Template.instance().origDev.port).change();
        $('#CreateOWLIntuitionNetworkForm_udpgroup').val(Template.instance().origDev.udpgroup).change();
    }
});

Template.enCreateOWLIntuitionNetworkForm.helpers({
    port() {
        let dev = Session.get(Black.SessionVars.EDITING_PHYS_DEV);
        return dev.port;
    },
    udpgroup() {
        let dev = Session.get(Black.SessionVars.EDITING_PHYS_DEV);
        return dev.udpgroup;
    },
    formInvalid() {
        let dev = Session.get(Black.SessionVars.EDITING_PHYS_DEV);
        return (!portValid(dev.port) || !udpgroupValid(dev.udpgroup)) ? 'disabled' : '';
    },
    formDisabled() {
        return (devRunning.get()) ? 'disabled' : '';
    },
});


///////////////////////////////////
//

function portValid(port) {
    return (!isNaN(port) && (port > 0 && port < 65535));
}

function udpgroupValid(udpgroup) {
    return udpGroupPatt.test(udpgroup);
}

