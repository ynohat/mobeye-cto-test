const STOREMAP_NAME = "fr.hogg.maps.mobeye-micromania-stores";

StoreMap = class StoreMap extends React.Component {
    propTypes: {
        gmapApiKey: React.PropTypes.isRequired
    }

    constructor(props) {
        super(props);
        this.state = {
            ready: false,
            stores: []
        };
    }

    componentWillMount() {
        GoogleMaps.load({
            key: this.props.gapiKey,
            v: 3
        });
    }

    componentDidMount() {
        // I'm pretty sure there's a more elegant way of doing this, but the
        // code example given by dburles (https://github.com/dburles/meteor-google-maps-react-example)
        // assumes we're using the old (deprecated) React.createClass + mixin
        // idiom to bind our component to data changes, which is not the case
        // here.
        let timeout = setTimeout(() => {
            if (GoogleMaps.loaded()) {
                // now that the lib is loaded, we can create the map instance
                GoogleMaps.create({
                    name: STOREMAP_NAME,
                    element: React.findDOMNode(this),
                    options: {
                        center: new google.maps.LatLng(-37.8136, 144.9631),
                        zoom: 8
                    }
                });
                // and when the map instance is ready, we can start doing stuff
                GoogleMaps.ready(STOREMAP_NAME, map => {
                    this.setState(Object.assign(this.state, {
                        ready: true,
                        manager: new StoreMapManager(map)
                    }));
                });
                // stop polling
                clearTimeout(timeout);
            }
        }, 100);
    }

    render() {
        return <div className="store-map" />;
    }
}

// Manages the markers on the map by observing the StoreCollection
class StoreMapManager {
    constructor(gmap) {
        this.gmap = gmap;
        this.markers = {};
        this.cursor = StoreCollection.find();
        this.init();
    }

    init() {
        // the initial bounds of the map can be determined by the initial
        // stores in the collection
        let bounds = new google.maps.LatLngBounds();
        // add all documents already in the collection
        this.cursor.forEach((store) => {
            let pos = new google.maps.LatLng(
                store.geometry.location.lat,
                store.geometry.location.lng
            );
            bounds.extend(pos);
        });
        this.gmap.instance.fitBounds(bounds);

        // and keep track of subsequent changes
        this.cursor.observe({
            added: this.onStoreAdded.bind(this),
            // changed: this.onStoreChanged.bind(this),
            removed: this.onStoreRemoved.bind(this)
        });
    }

    onStoreAdded(doc) {
        let pos = new google.maps.LatLng(
            doc.geometry.location.lat,
            doc.geometry.location.lng
        ); 
        let marker = new google.maps.Marker({
            draggable: false,
            position: pos,
            map: this.gmap.instance,
            // google magic
            place: {
                placeId: doc.place_id,
                location: pos
            },
            id: doc._id
        });
        this.markers[doc._id] = marker;
    }

    onStoreRemoved(doc) {
        let marker = this.markers[doc._id];
        if (marker) {
            marker.setMap(null);
            delete this.markers[doc._id];
        }
    }
}
