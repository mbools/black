// This could be done completely separately and just written into the MongoDB.
// However, leave it here for now as it may provide more reactive I/F opportunities running in the server.
// TODO: PORT and UDPGROUP to be in configuration data. These are set by OWL, so will the universal to all installations.
var PORT = 22600;
var UDPGROUP = '224.192.32.19';

var dgram = Npm.require('dgram');

OWLIntuitionNetwork = function (port, group) {
    // TODO Should really only create one for each port/group combination to prevent problems with data collection
    this._port = port || PORT;
    this._udpgroup = group || UDPGROUP;
    this._client = dgram.createSocket('udp4');
};

OWLIntuitionNetwork.prototype.start = function () {
    var client = this._client;

    client.on('listening', Meteor.bindEnvironment(function () {
        var address = client.address();
        console.log('UDP Client listening on ' + address.address + ":" + address.port);
// TODO: May need MulticastTTL increase from default 1 when passing through routers etc.
//    client.setMulticastTTL(128);
        client.addMembership(UDPGROUP);
    }, function (err) {
        // Deal with any bindEnvironment error
        console.log(err);
        throw err;
    }));

    client.on('message', Meteor.bindEnvironment(function (message, remote) {
        xml2js.parseString(message, function (err, result) {
            if (err) {
                console.log(err);
                return;
            }
            var seenAt = new Date();
            switch (Object.keys(result)[0]) {
                case 'electricity':
                    var deviceId = result.electricity.$.id;
                    var deviceInfo = OWLDevices.findOne({_id: deviceId});
                    if (!deviceInfo) {
                        deviceInfo = {_id: deviceId, type: 'electricity', watching: false};
                        OWLDevices.insert(deviceInfo);
                    }
                    if (deviceInfo.watching) {
                        var channels = result.electricity.chan;
                        var numChannels = channels.length;
                        var channelData = [];
                        for (var i = 0; i < numChannels; i++) {
                            //TODO Do we need to store the phase information?
                            var currWh = channels[i].curr[0]._ / ((channels[i].curr[0].$.units === 'w') ? 1 : 1000);
                            var dayWh = channels[i].day[0]._ / ((channels[i].day[0].$.units === 'wh') ? 1 : 1000);
                            channelData[channels[i].$.id] = {current: currWh, dayToDate: dayWh};
                        }
                        OWLData.insert({
                            'deviceId': deviceId,
                            time: seenAt,
                            signal: {
                                strength: result.electricity.signal[0].$.rssi,
                                quality: result.electricity.signal[0].$.lqi
                            },
                            data: channelData
                        }, function (err, result) {
                            if (err) console.log('Error inserting OWL data: ' + err);
                            if (result) console.log('inserted record with id: ' + result);
                        });
                    }
                    break;
                default:
                    console.log("Don't currently handle " + Object.keys(result));
            }
        });
        console.log('Received From: ' + remote.address + ':' + remote.port + ' - ');

    }, function (err) {
        // Deal with bindEnvironment error
        console.log(err);
        throw err;
    }));

// TODO: Add all the code to handle configration and device selection :)
// TODO: Wrap in exception handler.
    client.bind(PORT);
};

OWLIntuitionNetwork.prototype.stop = function () {
    this._client.close();
};

Meteor.startup(function () {
    // If this module is installed then we should automatically start a listener for OWL devices on the default
    // port and group. Admin user can change this through the admin screens, but 99.99% of people will only be
    // interested in seeing their actual device(s) listed once we've detected them.
    var defaultOWL = new OWLIntuitionNetwork();
    defaultOWL.start();
    //TODO Here's a puzzle. This is not a device as such, so how should I handle it?
    //This listener will potentially produce new devices it sees, but I want the admin user to be able
    //to change the port/group and even start/stop and create/remove the listener
    //Could treat these as 'sensors' or add new type 'scanner' to deal with the general
    //issue of detection of external devices/services

    ////////////////////////////////////////////////////////////////
// Register this physical device type with core
//
    if (!DeviceTemplates.findOne({
            manufacturer: 'OWL',
            model: 'some model'
        })) {
        DeviceTemplates.insert({
            manufacturer: 'OWL',
            model: 'some model',
            type: 'scanner',    // Internal software scanner device
            name: 'OWL Intuition Network',
            factory: 'OWLIntuitionNetwork'
        }, function (err, result) {
        });
    }
});

