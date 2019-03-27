import React from 'react';
import PropTypes from 'prop-types';
import ChildListItem from './ChildListItem';


class ProfileChildren extends React.Component {
    constructor(props){
        super(props);
        const userId = JSON.parse(localStorage.getItem('user')).id;
        const myProfile = userId === this.props.profileId;
        this.state= { myProfile: myProfile, children: this.props.children, profileId: this.props.profileId};
    }
    addChild = () => {
        const pathname = this.props.history.location.pathname;
        this.props.history.push(pathname+"/create")
    };
    render() {
        return (
            <React.Fragment>
							{this.state.children.length>0?
                <ul>
                    {this.state.children.map((child, index) =>       
                        <li key={index} >
                            <ChildListItem childId={child.child_id} userId={this.state.profileId}/>
                        </li>
                    )}
                </ul>
								:<div className="addChildPrompt">{"You haven't added any children yet. Click the child icon to add a new child"}</div>}
                {this.state.myProfile &&
                <button id="addChildThumbnail" onClick={this.addChild} >
                    <i className="fas fa-child" />
                </button>}
            </React.Fragment>
				);
    }
}




ProfileChildren.propTypes = {
    children: PropTypes.array,
    profileId: PropTypes.string,
};

export default ProfileChildren;