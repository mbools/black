// At the moment this is just a collecting place for common device related code

Meteor.methods({
   black_deviceRunning(dev) {
       // This should really be accesible as a database query
       return false;    // TODO Correct check for running device!
   }
});