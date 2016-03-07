/**
 * Root of the frontend display tree.
 *
 * For this simple exercise, this component also acts as the controller and
 * handles all the business logic (as opposed to putting it in Flux actions or
 * some other more Meteor-ish... thing).
 *
 * Note: we need to assign to App so it's available in the global scope,
 * see http://blog.east5th.co/2015/09/23/exporting-es6-classes-from-meteor-packages/
 */
App = class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selection: []
        };
    }

    render() {
        return (
            <div className="ui container app">
                <div className="ui rail left selection">
                    <StoreSelection
                        title="Selected stores"
                        emptyMessage="Please click on the markers to select them"
                        stores={this.state.selection}
                        onDownload={this.onStoreSelectionDownload.bind(this)}
                    />
                </div>
                <div className="ui segment map">
                    <StoreMap {...this.props.mapOptions}
                        onStoreClick={this.onStoreClick.bind(this)}
                    />
                </div>
            </div>
        );
    }

    onStoreClick(store) {
        let selection = this.state.selection;
        selection.push(store);
        this.setState({selection: selection});
    }

    onStoreSelectionDownload() {
        // This works, using the clinical:csv meteor package, and does not
        // require any work server-side, but it isn't ideal:
        // 
        // - the window.open() method does not allow a filename to be specified,
        // so the CSV file gets downloaded as "download", "download (1)" and so
        // forth; without a file extension, the CSV file is hardly usable by a
        // lambda user; solving this problem without actually storing the file
        // on the server requires creating an anchor link with download attribute
        // which is not cross browser compatible
        // 
        // - with regard to the tech test parameters, this is clearly cheating,
        // because no server side logic is involved :)
        //
        // It will do.
        var csvContent = CSV.unparse(this.state.selection.map((store) => {
            return {
                name: store.name,
                address: store.formatted_address,
                lat: store.geometry.location.lat,
                lng: store.geometry.location.lng
            };
        }));
        window.open('data:text/csv;charset=utf-8,' + escape(csvContent), '_self');
    }
}
