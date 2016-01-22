Template.black_ui_physicalDeviceTemplateList.onCreated(function () {
    this.autorun(() => {
        this.subscribe('deviceTemplates', Black.Constants.deviceTypes.PHYSICAL);
    });
});


Template.black_ui_physicalDeviceTemplateList.onRendered(function () {
    this.$('#devtree').jstree({
        core: {
            check_callback: true,
            data(node, cb) {
                let nodes=[];
                Black.Collections.DeviceTemplates
                    .find({type: Black.Constants.deviceTypes.PHYSICAL})
                    .forEach((dev) => {
                        nodes.push({
                            text: dev.name,
                            li_attr: {'data-tplid': dev._id}
                        })
                    });
                cb(nodes);
            },
        },
        types: {
            default: {
                icon: "glyphicon glyphicon-flash"
            }
        },
        contextmenu: {
            items(node) {
                let items = {
                    'add': {
                        label: 'Add',
                        _disabled: !Roles.userIsInRole(Meteor.userId(), 'admin'),
                        action: () => {
                            FlowRouter.go('createPhysDevices', {template: node.li_attr['data-tplid']});
                        }
                    }
                };

                return items;
            }
        },
        plugins: ['contextmenu', 'types']
    });
})

Template.black_ui_physicalDeviceTemplateList.helpers({
    physicalDeviceTemplates: function () {
        return Black.Collections.DeviceTemplates.find({type: Black.Constants.deviceTypes.PHYSICAL});
    }
});
