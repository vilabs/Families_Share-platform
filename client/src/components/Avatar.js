import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom'



class Avatar extends React.Component { 
    handleNav = () => {
        if (!this.props.disabled) {
            this.props.history.push({
                pathname: this.props.route,
                state: this.props.routeState,
            })
        }
    }
    render() {
        return (     
            <div id="avatarContainer">
                <img src={this.props.thumbnail} className={this.props.className} style={this.props.style} onClick={this.handleNav}
								alt="avatar" />
            </div>
        );
    }
}

Avatar.propTypes =  {
    thumbnail: PropTypes.string,
    style: PropTypes.object,
    className: PropTypes.string,
    route: PropTypes.string,
    routeState: PropTypes.object,
    disabled: PropTypes.bool,
}

export default withRouter(Avatar);