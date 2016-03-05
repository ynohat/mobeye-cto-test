StoreCollection = new Mongo.Collection("mobeye.micromania.stores");

// FIXME: I think it's a better idea to keep this here, rather than in
// the actual map component; ideally, it wouldn't go in the code,
// but I don't know enough about meteor best practises so this'll
// do for now.
const GMAPS_API_KEY = "AIzaSyCvYqlNbffhz4lUaCBBd2cx3y2shPafR6Y";

if (Meteor.isClient) {
  Meteor.startup(function () {
    React.render(
      <App mapOptions={{gapiKey: GMAPS_API_KEY}} />,
      document.getElementById("mobeye-root")
    );
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    StoreCollection.remove({});
    if (StoreCollection.find().count() === 0) {
      // If the collection is empty, we preload data that we "scraped"
      // from the google places API.
      // Note: we can do this synchronously because the result set is
      // small and we want clean indentation over robustness
      // for this exercise.
      let json = Assets.getText("google-places-result.json");
      let stores = JSON.parse(json);
      stores.map(store => {
        store._id = store.id;
        // Likewise (and only on the server), this can be done asynchronously
        StoreCollection.insert(store);
      });
    }
  });
}
