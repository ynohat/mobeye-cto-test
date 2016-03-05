Stores = new Mongo.Collection("mobeye.micromania.stores");

if (Meteor.isClient) {

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
