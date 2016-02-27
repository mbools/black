//'use strict';

let dgram = Npm.require('dgram');

// TODO: PORT and UDPGROUP to be in configuration data. These are set by OWL, so will the universal to all installations.
const PORT = '22600';
const UDPGROUP = '224.192.32.19';

const HEADER = {
    manufacturer: 'OWL Intuition',
    model: 'TSE200-101',
    type: 'physical',
    name: 'Intuition-E Gateway',
    description: 'OWL Intuition-E Web based energy monitor',
    factory: 'OWLIntuitionNetwork'
};

const UI = {
    createTemplate: 'CreateOWLIntuitionNetwork',
    configTemplate: 'ConfigOWLIntuitionNetwork',
    deleteTemplate: 'DeleteOWLIntuitionNetworkModal',
    stateButtonsTemplate: 'OWLIntuitionNetworkStateButtons'
};


const SUBDEVUI = {
    createTemplate: 'CreateOWLIntuitionNetwork',
    configTemplate: 'ConfigOWLIntuitionNetwork',
    stateButtonsTemplate: 'OWLIntuitionNetworkDetectedDevStateButtons'
};


const SUBDEVHEADER = {
    manufacturer: 'OWL Intuition',
    model: 'TSE200-101',
    type: 'physical',
    description: 'OWL Intuition Single Channel Transmitter Unit',
    name: 'Intuition Electricity Sensor'
};


let RunningDevices = [];

const log = new Logger('OwlIntuition');

const owlIntuitionNetwork = stampit({
    init() {
        this.client = dgram.createSocket('udp4');
        this.client.toJSON = function () {
            return "[client]"
        }; // Avoids circular reference in client when stringifying OWLIntuitionNetwork object
    },
    props: {
        header: HEADER,
        ui: UI
    },
    refs: {
        port: PORT,
        udpgroup: UDPGROUP,
        startOnServerStart: true,   // Indicates to the Core whether this device should be autostarted when the server starts
        backfill: false,
    },
    methods: {
        start() {
            let self = this;
            let client = self.client;

            client.on('listening', Meteor.bindEnvironment(function () {
                let address = client.address();
                log.info(`UDP Client listening on ${address.address} : ${address.port}`);
                // TODO: May need MulticastTTL increase from default 1 when passing through routers etc.
                //    client.setMulticastTTL(128);
                client.addMembership(self.udpgroup);
            }, function (err) {
                // Deal with any bindEnvironment error
                log.error(err);
                throw err;
            }));

            client.on('message', Meteor.bindEnvironment(function (message, remote) {
                xml2js.parseString(message, function (err, result) {
                    if (err) {
                        log.error(err);
                        return;
                    }
                    let seenAt = new Date();
                    switch (Object.keys(result)[0]) {
                        case 'electricity':
                            let deviceId = result.electricity.$.id;
                            let deviceInfo = Black.Collections.Devices.findOne({_id: deviceId});
                            if (!deviceInfo) {
                                deviceInfo = {
                                    _id: deviceId,
                                    header: SUBDEVHEADER,
                                    ui: SUBDEVUI,
                                    type: 'electricity',
                                    watching: false,
                                    recording: false,
                                    running: true,              // Has to be running as it's state is controlled be parent
                                    parent: self._id,
                                    configDevice: self._id     // These devices are configured through the parent Network device
                                };
                                Black.Collections.Devices.insert(deviceInfo, function (err, result) {
                                    if (err) log.error(`Failed to add OWLIntuitionNetwork device id:${deviceId} to Devices. With Error: ${err}`);
                                });
                            }
                            if (deviceInfo.watching) {
                                let channels = result.electricity.chan;
                                let numChannels = channels.length;
                                let channelData = [];
                                for (let i = 0; i < numChannels; i++) {
                                    //TODO Do we need to store the phase information?
                                    let currWh = channels[i].curr[0]._ / ((channels[i].curr[0].$.units === 'w') ? 1 : 1000);
                                    let dayWh = channels[i].day[0]._ / ((channels[i].day[0].$.units === 'wh') ? 1 : 1000);
                                    channelData[channels[i].$.id] = {current: currWh, dayToDate: dayWh};
                                }
                                // TODO Generate internal event announcing watched data
                                log.debug(`Saw OWLData record with id: ${deviceId}`);
                                if (deviceInfo.recording) {
                                    OWLData.insert({
                                        'deviceId': deviceId,
                                        time: seenAt,
                                        signal: {
                                            strength: result.electricity.signal[0].$.rssi,
                                            quality: result.electricity.signal[0].$.lqi
                                        },
                                        data: channelData
                                    }, function (err, result) {
                                        if (err) log.error(`Error inserting OWL data. With Error: ${err}`);
                                        if (result) log.debug(`Inserted OWLData record with id: ${result}`);
                                    });
                                }
                            }
                            break;
                        default:
                            log.warn(`Don't currently handle ${Object.keys(result)}`);
                    }
                });
                log.info(`Received From: ${remote.address} : ${remote.port}`);

            }, function (err) {
                // Deal with bindEnvironment error
                log.error(err);
                throw err;
            }));

            try {
                client.bind(this.port);
                log.info(`Starting OWL Intuition Network device on port: ${this.port} & udpgroup: ${this.udpgroup}`);
                RunningDevices.push(this);
                Black.Collections.Devices.update({_id: this._id}, {$set: {running: true}});
                // Mark all this device's children as running
                Black.Collections.Devices.update({parent: this._id},
                    {
                        $set: {running: true}
                    });

            }
            catch (err) {
                log.error(err);
            }

            return this;
        },

        stop() {
            try {
                log.info(`Stopping OWL Intuition Network device on port: ${this.port} & udpgroup: ${this.udpgroup}`);
                this.client.close();
                let pos = RunningDevices.indexOf(this);
                if (pos >= 0) {
                    RunningDevices.splice(pos, 1);
                }
                Black.Collections.Devices.update({_id: this._id}, {$set: {running: false}});
                // Mark all this device's children stopped
                Black.Collections.Devices.update({parent: this._id},
                    {
                        $set: {running: false}
                    });
            }
            catch (err) {
                log.error(err);
            }
            return this;
        },

        run() { // For physicalDevice interface
            return this.start();
        }

    }
});

//Assemble our factory...
Black.devicePlugins.OWLIntuitionNetwork = Black.Core.PhysicalDevice.compose(owlIntuitionNetwork);

Meteor.methods({
    black_startOWLNetwork(devId) {
        let dev = Black.Collections.Devices.findOne({_id: devId});
        if (dev) {
            let startingDev = Black.devicePlugins.OWLIntuitionNetwork(dev);
            if (startingDev && !Black.Collections.Devices.findOne({_id: devId}).running) {
                startingDev.start();
            }
        }
        else {
            log.error(`No such device ${devId}`);
        }
    },
    black_stopOWLNetwork(devId) {
        let dev = Black.Collections.Devices.findOne({_id: devId});
        if (dev) {
            if (Black.Collections.Devices.findOne({_id: devId}).running) {
                let realDevice = RunningDevices.find((elem) => {
                    return elem._id === devId
                });
                if (realDevice) {
                    realDevice.stop();
                }
                else {
                    log.error(`No such running device ${devId}`);
                }
            }
        }
        else {
            log.error(`No such device ${devId}`);
        }
    },
    black_createOWLNetwork(dev) {
        // It's possible we get called more than once, if the device already exists, just return it
        let newDev = Black.Collections.Devices.findOne({port: dev.port, udpgroup: dev.udpgroup});
        if (newDev === undefined) {
            log.debug(`creating device ${dev.port} : ${dev.udpgroup}`);
            Black.Collections.Devices.insert(Black.devicePlugins['OWLIntuitionNetwork'](dev).asDoc());
            newDev = Black.Collections.Devices.findOne({port: dev.port, udpgroup: dev.udpgroup});
        }
        return newDev;
    },
    black_configOWLNetwork(dev) {
        let newDev = Black.Collections.Devices.findOne({_id: dev._id});
        if (typeof newDev === 'undefined' || !_.isEqual(newDev.header, HEADER)) {
            // TODO Request to update non-existent OWL device
        }
        else {
            log.debug(`updating OWL device ${dev._id} : ${dev.port} : ${dev.udpgroup}`);
            let result = Black.Collections.Devices.update({_id: dev._id},
                {
                    $set: {
                        port: dev.port,
                        udpgroup: dev.udpgroup,
                        startOnServerStart: dev.startOnServerStart,
                        backfill: dev.backfill
                    }
                });
            if (result.nModified > 1) {
                log.error(`OWL update effected more than one matching entry: ${dev._id}`);
            }
            return true;
        }
        return false;
    },
    toggleWatch(dev) {
        let thisDev = Black.Collections.Devices.findOne({_id: dev});
        let newRecording = thisDev.recording;
        let newWatching = !thisDev.watching;
        if (!newWatching) { // we're about to turn off watching, so recording will also be turned off
            newRecording = false;
        }
        let result = Black.Collections.Devices.update({_id: dev},
            {
                $set: {
                    watching: newWatching,
                    recording: newRecording
                }
            });
        if (result.nModified > 1) {
            log.error(`OWL update effected more than one matching entry: ${dev}`);
        }
        return newWatching;
    },
    toggleRecord(dev) {
        let thisDev = Black.Collections.Devices.findOne({_id: dev});
        let newRecording = !thisDev.recording;
        let newWatching = thisDev.watching;
        if (newRecording) { // we're about to turn on recording, so watching will also be turned on
            newWatching = true;
        }
        let result = Black.Collections.Devices.update({_id: dev},
            {
                $set: {
                    watching: newWatching,
                    recording: newRecording
                }
            });
        if (result.nModified > 1) {
            log.error(`OWL update effected more than one matching entry: ${dev}`);
        }
        return newRecording;
    }
});


Meteor.startup(function () {
    ////////////////////////////////////////////////////////////////
    // Register this physical device type with core
    // DeviceTemplates are used only to provide a list of available devicetypes
    // The system will use .factory to actually create real devices
    //
    if (!Black.Collections.DeviceTemplates.findOne({
            'header.manufacturer': HEADER.manufacturer,
            'header.model': HEADER.model
        })) {
        Black.Collections.DeviceTemplates.insert({header: HEADER, ui: UI}, function (err, result) {
                if (err) {
                    log.error(`Failed to register ${HEADER.factory} as DeviceTemplate. With Error: ${err}`);
                }
            }
        );
    }
});