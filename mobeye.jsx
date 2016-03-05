Stores = new Mongo.Collection("mobeye.micromania.stores");

if (Meteor.isClient) {
  Meteor.startup(function () {
    React.render(<App />, document.querySelector("#mobeye-root"));
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
