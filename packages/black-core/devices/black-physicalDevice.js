let log = new Logger('black-physicalDevice');


Meteor.methods({
    ////////
    // This just creates a barebones physical device object populated with appropriate default values
    // The device is NOT registered until the user commits it separately
    createPhysicalDevice(protoName) {
        if (Black.devicePlugins[protoName]) {
            if (stampit.isStamp(Black.devicePlugins[protoName])) {
                let dev = Black.devicePlugins[protoName]();
                let devStr = JSON.stringify(dev);
                return devStr;
            }
            else {
                throw new Meteor.Error("no-stamp", "There is no stamp for " + protoName);
            }
        }
        else {
            // TODO sort out message
            throw new Meteor.Error("no-such-physical-device-type", "No factory for physicalDevice " + protoName);
        }
    }
});

Black.Core.PhysicalDevice = stampit({
    methods: {
        // Default run method
        run() {
            log.info(this.header.factory + ".run() defaulted to no action by physicalDevice");
        },

        // Reduce to consistent document representation for storage (basically, remove non-JSON stuff
        asDoc() {
            return JSON.parse(JSON.stringify(this));
        }
    },
    refs: {
        running: false,                 // Assume not running by default
        startOnServerStart: false,      // Do not autostart by default
    }
});

Meteor.startup(() => {
    stopAllDevices();   // Since the server has only just started we can assume that no devices should be running
    startDevices();
});


Meteor.publish("physicalDevices", function () {  // Publish physical device details
    if (this.userId) {
        return Black.Collections.Devices.find({'header.type': Black.Constants.deviceTypes.PHYSICAL});
    } else {
        this.ready();
    }
});

Meteor.publish("physicalDevice", function (devId) {  // Publish physical device details
    if (this.userId) {
        // type required to avoid request for virtual device
        return Black.Collections.Devices.find({_id: devId, 'header.type': Black.Constants.deviceTypes.PHYSICAL});
    } else {
        this.ready();
    }
});


Meteor.publish("udpListenerDevices", function () {  // Publish udpListener device details
    if (this.userId) {
        // type required to avoid request for virtual device
        return Black.Collections.Devices.find({
            'header.type': Black.Constants.deviceTypes.PHYSICAL,
            port: {$exists: true},
            udpgroup: {$exists: true}
        });
    } else {
        this.ready();
    }
});


//////////////////////
// startDevices()
// On server startup any physical devices marked to startOnServerStart are created and initialised
var startDevices = function () {
    // Find devices that need starting
    log.info('Starting all physical devices set to startOnServerStart...');
    let startupDevs = Black.Collections.Devices.find({'header.type': Black.Constants.deviceTypes.PHYSICAL, startOnServerStart: true}
    ).forEach((dev) => {
        if (stampit.isStamp(Black.devicePlugins[dev.header.factory])) {
            try {
                let runDev = Black.devicePlugins[dev.header.factory](dev);
                if (typeof runDev.run === 'function') {
                    runDev.run();
                }
                else {
                    log.info("No run() method on physical device " + dev.header.factory);
                }
            } catch (e) {
                log.error(e.message);
            }
        }
        else {
            log.error("No stamp available for physical device " + dev.header.factory);
        }
    });
    log.info('...All physical devices set to startOnServerStartup started.');
}

var stopAllDevices = function () {
    // Find devices that need stopping
    log.info('Stopping all physical devices...');
    let startupDevs = Black.Collections.Devices.find({'header.type': Black.Constants.deviceTypes.PHYSICAL, running: true}
    ).forEach((dev) => {
        if (stampit.isStamp(Black.devicePlugins[dev.header.factory])) {
            try {
                let runningDev = Black.devicePlugins[dev.header.factory](dev);
                if (typeof runningDev.stop === 'function') {
                    runningDev.stop();
                }
                else {
                    log.info("No stop() method on physical device " + dev.header.factory);
                }
            } catch (e) {
                log.error(e.message);
            }
        }
        else {
            log.error("No stamp available for physical device " + dev.header.factory);
        }
    });
    log.info('...All physical devices stopped.');
}