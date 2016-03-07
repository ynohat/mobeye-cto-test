// name of the map, nicely namespaced in case several gmaps should be displayed
// on the page O_o
const STOREMAP_NAME = "fr.hogg.maps.mobeye-micromania-stores";

// initial bounds, hardcoded because they entirely contain the markers
const FRANCE_BOUNDS = {
    "south": 43.29119719999999,
    "west": -0.5964043999999831,
    "north":51.015764,
    "east":7.285259699999983
};

/**
 * React wrapper around a GoogleMap (using dburles:google-maps).
 *
 * Map interactions require using google maps API idioms which are mostly
 * irrelevant in a React context, so they are delegated to the StoreMapManager
 * internal class.
 */
StoreMap = class StoreMap extends React.Component {
    propTypes: {
        gmapApiKey: React.PropTypes.isRequired,
        onStoreClick: React.PropTypes.func.isRequired
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
                        // these  values are arbitrary and later overridden
                        // by fitBounds
                        zoom: 8,
                        center: new google.maps.LatLng(-37.8136, 144.9631)
                    }
                });
                // and when the map instance is ready, we can start doing stuff
                GoogleMaps.ready(STOREMAP_NAME, map => {
                    this.setState({
                        ready: true,
                        manager: new StoreMapManager(map, {
                            onStoreClick: this.props.onStoreClick
                        })
                    });
                    map.instance.fitBounds(FRANCE_BOUNDS);
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
    constructor(gmap, options) {
        this.gmap = gmap;
        this.options = options;
        this.markers = {};
        this.cursor = StoreCollection.find();
        this.init();
    }

    init() {
        // and keep track of subsequent changes
        this.cursor.observe({
            added: this.onStoreAdded.bind(this),
            // changed: this.onStoreChanged.bind(this),
            removed: this.onStoreRemoved.bind(this)
        });
    }

    // when a store is added (doc => store document in the observed collection),
    // we add a marker and its listeners
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

        // FIXME: it is possible to select the same store several times
        if (this.options.onStoreClick) {
            marker.addListener("click", () => {
                this.options.onStoreClick(doc);
            });
        }
    }

    onStoreRemoved(doc) {
        let marker = this.markers[doc._id];
        if (marker) {
            marker.setMap(null);
            delete this.markers[doc._id];
        }
    }
}
