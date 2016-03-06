/**
 * Render a button with an icon.
 * 
 */
IconButton = class IconButton extends React.Component {
    propTypes: {
        disabled: React.PropTypes.boolean,
        onClick: React.PropTypes.func.isRequired,
        // one of the semantic:ui icon glyph names
        icon: React.PropTypes.string.isRequired,
        label: React.PropTypes.string.isRequired
    }

    render() {
        let iconClass = [this.props.icon, "icon"].join(" ");
        return (
            <button disabled={this.props.disabled}
                className="ui labeled icon button"
                onClick={this.props.onClick}>
                <i className={iconClass}></i>
                {this.props.label}
            </button>
        );
    }
}
