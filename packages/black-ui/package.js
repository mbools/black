Package.describe({
    name: 'mbools:black-ui',
    version: '0.0.1',
    summary: 'Provides the main reusable components for the Black UI',
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
    api.use('less');

    api.use('ian:accounts-ui-bootstrap-3');
    api.use('tap:i18n');
    api.use('twbs:bootstrap');
    api.use('jss:jstree');
    api.use('kadira:flow-router');
    api.use('kadira:blaze-layout');
    api.use('pascoual:bootstrap-contextmenu');


    api.use("tap:i18n", ['client', 'server']);
    api.addFiles('package-tap.i18n', ['client', 'server']);
    //api.imply('tap:i18n');

    api.use("jss:jstree");

    // Pull in black-core functionality
    api.use('mbools:black-core');


    ////////////////////////////
    // Package files

    api.addFiles([
        'vendor/bootstrap3.variables.less',
        'style.less',
        'routes.js',
        'black-ui.js',
    ], 'client');


    //// Layouts
    api.addFiles([
        'layouts/main.html',
        'layouts/layout.js'
    ], ['client']);

    //// Main Pages
    api.addFiles([
        'mainPages/home.html',
        'mainPages/designHome.html',
        'mainPages/adminHome.html'
    ], ['client']);


    //// Miscelaneous utility templates
    api.addFiles([
        'utilityTemplates/notifications.html',
    ], ['client']);


    //// Components

    api.addFiles([
        'component/navigation/top_bar.html',
        'component/navigation/top_bar.js'
    ], ['client']);

    api.addFiles([
        'component/help/helpButton.html',
        'component/help/helpButton.js',
        'component/help/helpModal.html',
        'component/help/helpModal.js'
    ], ['client']);

    api.addFiles([
            'component/workspace/black-ui-workspace.html',
            'component/workspace/black-ui-workspace.js'
        ],
        ['client']);

    api.addFiles([
            'component/physicalDeviceTemplateList/black-ui-physicalDeviceTemplateList.html',
            'component/physicalDeviceTemplateList/black-ui-physicalDeviceTemplateList.js'
        ],
        ['client']);


    //// User administration
    api.addFiles([
        'component/admin/user/adminUsersHome.html',
    ], ['client']);

        //// Physical device administration
    api.addFiles([
        'component/admin/physicalDevice/adminConfigurePhysicalDevice.html',
        'component/admin/physicalDevice/adminConfigurePhysicalDevice.js',
        'component/admin/physicalDevice/adminCreatePhysicalDevice.html',
        'component/admin/physicalDevice/adminCreatePhysicalDevice.js',
        'component/admin/physicalDevice/adminPhysicalDevicesHome.html',
        'component/admin/physicalDevice/adminPhysicalDevicesHome.js',

        'docs/en/help/en_adminPhysicalDevicesHome.html',
        'docs/en/help/en_physDevDescription.html',
        'docs/en/help/en_physDevManufacturer.html',
        'docs/en/help/en_physDevModel.html',
        'docs/en/help/en_physDevName.html',
    ], ['client']);



    //// Miscellaneous Documentation
    api.addFiles([
        'docs/en/en_About.html',
        'docs/en/help/en_helpPageNotFound.html'
    ], ['client']);


    /// Language files
    api.addFiles([
        'i18n/errormsgs.en.i18n.json',
        'i18n/menuitems.en.i18n.json',
        'i18n/otheruielements.en.i18n.json'
    ], ['client'])
});

Package.onTest(function (api) {
    api.use('ecmascript');
    api.use('tinytest');
    api.use('black-ui');
    api.addFiles('black-ui-tests.js');
});
