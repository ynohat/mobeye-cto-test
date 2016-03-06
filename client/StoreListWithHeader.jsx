/**
 * Render a list of stores with a title and a download button.
 */
StoreListWithHeader = class StoreSelection extends React.Component {
    propTypes: {
        title: React.PropTypes.string.isRequired,
        onDownloadClick: React.PropTypes.func,
        stores: React.PropTypes.array.isRequired,
        emptyMessage: React.PropTypes.string
    }

    render() {
        return (
            <div className="ui segment store-selection">
                <div className="header">
                    {this.props.title}
                    <i class="download icon"
                        onClick={this.props.onDownloadClick}></i>
                </div>
                <StoreList stores={this.props.stores}
                    emptyMessage={this.props.emptyMessage}
                />
            </div>
        );
    }
}

/**
 * Render a list of stores
 */
StoreList = class StoreList extends React.Component {
    propTypes: {
        stores: React.PropTypes.array.isRequired,
        emptyMessage: React.PropTypes.string
    }

    render() {
        if (!this.props.stores.length) {
            return <p>{this.props.emptyMessage || "Nothing here"}</p>;
        }
        return (
            <div className="ui relaxed divided list store-list">
                {this.props.stores.map((store) => {
                    return <StoreListItem {...store} />
                })}
            </div>
        );
    }
}

/**
 * Render a store as part of a StoreList.
 */
class StoreListItem extends React.Component {
    propTypes: {
        id: React.PropTypes.string.isRequired,
        name: React.PropTypes.string.isRequired,
        place_id: React.PropTypes.string.isRequired,
        formatted_address: React.PropTypes.string.isRequired
    }

    render() {
        return (
            <div className="item">
                <div className="content">
                    <p className="header">{this.props.name}</p>
                    <p className="description">{this.props.formatted_address}</p>
                </div>
            </div>
        );
    }
}
