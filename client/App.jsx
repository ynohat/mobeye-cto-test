// Root of the frontend display tree.
//
// Note: we need to assign to App so it's available in the global scope,
// see http://blog.east5th.co/2015/09/23/exporting-es6-classes-from-meteor-packages/
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
                        onStoreSelect={this.onStoreSelect.bind(this)}
                    />
                </div>
            </div>
        );
    }

    onStoreSelect(store) {
        let selection = this.state.selection;
        selection.push(store);
        this.setState({selection: selection});
    }

    onStoreSelectionDownload() {
        alert("todo");
    }
}
