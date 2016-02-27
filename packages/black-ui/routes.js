////////////////////////////////////////////////////////////////////
// Routing
//

// override with mini-pages navigate method
Meteor.navigateTo = function (path) {
    FlowRouter.go(path)
}


FlowRouter.notFound = {
    action: function () {
        BlazeLayout.render("main", {header: 'top_bar', main: 'notFound'})
    }
}

//////////////////////////////////////////////////////////////////////
// Main route
//
FlowRouter.route('/', {
    action: function () {
        BlazeLayout.render('main', {header: 'top_bar', main: 'home',  workpanel: null});
    },
    name: "homepage"
});


/////////////////////////////////////////////////////////////////////
// Adminstrative functions
//
var adminSection = FlowRouter.group({
    prefix: '/admin',
    name: 'admin'
});

// administration home page
adminSection.route('/', {
    action: function () {
        BlazeLayout.render('main', {
            header: 'top_bar',
            main: 'adminHome',
            workpanel: null
        });
    }
});

// administration of users
adminSection.route('/users', {
    action: function () {
        BlazeLayout.render('main', {
            header: 'top_bar',
            main: 'adminUsers',
            workpanel: null
        });
    },
    name: 'manageUsers'
});


// administration of physical devices
adminSection.route('/physicaldevices', {
    action: function () {
        BlazeLayout.render('main', {
            header: 'top_bar',
            main: 'adminPhysicalDevicesHome',
            workpanel: 'black_ui_physicalDeviceTemplateList'
        })
    },
    name: 'managePhysDevices'
});

adminSection.route('/physicaldevices/create/:template', {
    action: function () {
            BlazeLayout.render('main', {
                header: 'top_bar',
                main: 'adminCreatePhysicalDevice',
                workpanel: 'black_ui_physicalDeviceTemplateList'
            });
    },
    name: 'createPhysDevices'
});


adminSection.route('/physicaldevices/config/:device', {
    action: function () {
        BlazeLayout.render('main', {
            header: 'top_bar',
            main: 'adminConfigPhysicalDevice',
            workpanel: 'black_ui_physicalDeviceTemplateList'
        });
    },
    name: 'configPhysDevices'
});

//adminSection.route('/physicaldevices/delete/:device', {
//    action: function () {
//        BlazeLayout.render('main', {
//            header: 'top_bar',
//            main: 'adminDeletePhysicalDevice',
//            workpanel: 'black_ui_physicalDeviceTemplateList'
//        });
//    },
//    name: 'deletePhysDevices'
//});


/////////////////////////////////////////////////////////////////////
// Design functions and tools
//
var designSection = FlowRouter.group({
    prefix: '/design',
    name: 'design'
});

designSection.route('/', {
    action: function () {
        BlazeLayout.render('main', {
            header: 'top_bar',
            main: 'designHome',
            workpanel: null
        });
    },
    name: 'designHome'
});


/////////////////////////////////////////////////////////////////////
// Help
//
var helpSection = FlowRouter.group({
    prefix: '/help',
    name: 'help'
});

helpSection.route('/', {
    action: function () {
        BlazeLayout.render('main', {
            header: 'top_bar',
            main: 'helpHome',
            workpanel: null
        });
    },
    name: 'helpHome'
});

helpSection.route('/docs', {
    action: function () {
        BlazeLayout.render('main', {
            header: 'top_bar',
            main: 'docsHome',
            workpanel: null
        });
    },
    name: 'docsHome'
});
