Template.top_bar.helpers({
    activeIfRouteHas(feature, value) {
        FlowRouter.watchPathChange();
        let route = FlowRouter.current().route;
        let group = route.group;
        let val = "";

        switch (feature) {
            case 'groupPrefix':
                val = (group && group.prefix == value) ? "active" : "";
                break;
            case 'groupName':
                val = (group && group.name == value) ? "active" : "";
                break;
            case 'name':
                val = (route.name === value) ? "active" : "";
                break;
        }
        return val;
    },
    activeIfRoutePrefix(prefix) {
        FlowRouter.watchPathChange();
        let group = FlowRouter.current().route.group;
        return (group && group.prefix === prefix) ? "active" : "";
    }
});


Template.top_bar.events({
    'click #black_dl_novice': function (evt) {
        let user = Meteor.userId();
        if (user) {
            Meteor.users.update({_id: user}, {$set: {'profile.detailLevel': Black.Constants.detailLevel.NOVICE}})
        }
    },
    'click #black_dl_intermediate': function (evt) {
        let user = Meteor.userId();
        if (user) {
            Meteor.users.update({_id: user}, {$set: {'profile.detailLevel': Black.Constants.detailLevel.INTERMEDIATE}})
        }
    },
    'click #black_dl_expert': function (evt) {
        let user = Meteor.userId();
        if (user) {
            Meteor.users.update({_id: user}, {$set: {'profile.detailLevel': Black.Constants.detailLevel.EXPERT}})
        }
    }
});