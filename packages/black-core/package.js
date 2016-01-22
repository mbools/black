Package.describe({
  name: 'mbools:black-core',
  version: '0.0.1',
  summary: 'Black Core objects for use in main system and for plugins',
  // URL to the Git repository containing the source code for this package.
  git: '',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');

  // Meteor core packages
  api.use('ecmascript');
  api.use('mongo');

  api.use('alanning:roles');
  api.use('peerlibrary:xml2js');

  // Black Core base packages
  // There are used throughout Black as base packages
  api.use('stampitorg:stampit');    // Support for stamps
  api.use('jag:pince');             // Logging
  api.use('mbools:black-globals');  // Black globals

  // If you use core you definitely need access to these too, so let them out...
  api.imply('mongo');
  api.imply('stampitorg:stampit');
  api.imply('jag:pince');
  api.imply('mbools:black-globals');

  //////////////
  // Black Core
  //
  api.addFiles('black-core.js');
  api.addFiles('devices/black-collections.js');
  api.addFiles([
    'black-core-server.js',
    'devices/black-deviceTemplates.js',
    'devices/black-device.js',
    'devices/black-physicalDevice.js',
    'devices/black-virtualDevice.js'
    ], ['server']);
});





Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('mongo');
  api.use('tinytest');
  api.use('stampitorg:stampit');
  api.use('mbools:black-globals');

  api.imply('stampitorg:stampit');
  api.imply('mbools:black-globals');

  api.use('mbools:black-core');
  api.addFiles('black-core-tests.js');
});
