Package.describe({
    name: 'mbools:black-owl-intuition-network',
    version: '0.0.1',
    // Brief, one-line summary of the package.
    summary: '',
    // URL to the Git repository containing the source code for this package.
    git: '',
    // By default, Meteor will default to using README.md for documentation.
    // To avoid submitting documentation, set this field to null.
    documentation: 'README.md'
});

Package.onUse(function (api) {
    api.versionsFrom('1.2.1');
    api.use('ecmascript');
    api.use('templating', 'client');
    api.use('reactive-var', 'client');

    api.use("tap:i18n", ['client', 'server']);
    api.addFiles('package-tap.i18n', ['client', 'server']);

    api.use('mbools:black-core');
    api.use('mbools:black-ui');


    api.addFiles([
            'collections.js',
        ],
        ['client', 'server']);

    api.addFiles([
        'server/OwlIntuition.js',
        'server/publications.js',
    ], ['server']);


    api.addFiles(
        [
            'client/admin/create/enCreateOWLIntuitionNetwork.html',
            'client/admin/create/enCreateOWLIntuitionNetwork.js',
            'client/admin/delete/enDeleteOWLIntuitionNetworkModal.html',
            'client/admin/delete/enDeleteOWLIntuitionNetworkModal.js',
            'client/admin/config/enConfigOWLIntuitionNetwork.html',
            'client/admin/config/enConfigOWLIntuitionNetwork.js',
            'client/docs/help/en/enConfigOWLIntuitionNetworkPort.html',
            'client/docs/help/en/enConfigOWLIntuitionNetworkUDPGroup.html',
            'client/controls/NetworkDevice/enOWLIntuitionNetworkStateButtons.html',
            'client/controls/NetworkDevice/enOWLIntuitionNetworkStateButtons.js',
            'client/controls/SensorDevice/enOWLIntuitionNetworkDetectedDevStateButtons.html',
            'client/controls/SensorDevice/enOWLIntuitionNetworkDetectedDevStateButtons.js',
        ],
        ['client']);


    // Must be after template load...
    api.addFiles([
            'i18n/fieldlabels.en.i18n.json',
            'i18n/buttonlabels.en.i18n.json',
            'i18n/tooltips.en.i18n.json',
            'i18n/messages.en.i18n.json',
        ],
        ['client', 'server']);

});

Package.onTest(function (api) {
    api.use('ecmascript');
    api.use('templating', 'client');
    api.use('tinytest');
    api.use('mbools:black-owl-intuition-network');

    api.addFiles('OwlIntuitionNetwork-tests.js');
});
