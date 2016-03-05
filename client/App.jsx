// Root of the frontend display tree.
//
// Note: we need to assign to App so it's available in the global scope,
// see http://blog.east5th.co/2015/09/23/exporting-es6-classes-from-meteor-packages/
App = class App extends React.Component {
    render() {
        return (
            <div className="ui container">
                <StoreMap />
            </div>
        );
    }
}
