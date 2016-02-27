var log = new Logger("adminPhysicalDevicesHome");

Template.physicalDeviceList.onCreated(function () {
    //if (Meteor.user()) {
    this.autorun(() => {
        this.subscribe('physicalDevices');
    });
    //}
});

Template.physicalDeviceList.onRendered(function () {
    this.tree_column_num = $('th.js-table-tree').index() + 1;
    log.debug(this.tree_column_num);
    // Need this Meteor.defer to ensure all of the nested templates are completely inserted
    // into the DOM, otherwise we get garbage
    //Meteor.defer(() => {
    //    log.debug("deviceStatus: " + $(`td:nth-child(${this.tree_column_num})`).text());
    //});
    $('.treetable').treetable({active: true});
    $('.sortable').sortable().on('sortchange', function (evt, ui) {
        log.debug(ui.placeholder);
        log.debug(ui.placeholder.prev().children().first().text());
    });
});

Template.physicalDeviceList.helpers({
    physicalDevices() {
        return Black.Collections.Devices.find({'header.type': Black.Constants.deviceTypes.PHYSICAL});
    }
});

Template.physicalDeviceStatus.onRendered(function () {
    let parentInstance = this.parentTemplate();
});

Template.physicalDeviceStatus.helpers({
    stateButtons() {
        let dev = Black.Collections.Devices.findOne({_id: Template.currentData().device._id});
        return Black.utilities.getUserLanguage() + dev.ui.stateButtonsTemplate;
    }
});