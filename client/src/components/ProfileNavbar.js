import React  from 'react';
import PropTypes from 'prop-types';
import Texts from '../Constants/Texts.js';
import withLanguage from './LanguageContext';
import { withRouter } from 'react-router-dom';

class ProfileNavbar extends React.Component {
    handleActiveTab = (event) => {
        const pathName= this.props.history.location.pathname;
        const parentPath= pathName.slice(0,pathName.lastIndexOf("/"));
        this.props.history.replace(parentPath+"/"+event.target.id);
        this.props.renderActiveTab(event.target.id);
    }
    render() {
        const texts = Texts[this.props.language].profileNavbar;
        const pathname = this.props.location.pathname;
        const activeTab = pathname.slice(pathname.lastIndexOf("/")+1,pathname.length);
        return (
        <div id="profileNavbarContainer">
            <div className="row no-gutters">
                <div className="col-1-2" >
                        <h1 id="info"  className={activeTab==="info"?"profileTabActive":""} 
                        onClick={this.handleActiveTab}>
                            {texts.info}  
                        </h1>
                </div>
                <div className="col-1-2">
                        <h1 id="children" className={activeTab==="children"?"profileTabActive":""} 
                        onClick={this.handleActiveTab}> 
                            {texts.children}     
                        </h1>
                </div>
            </div>
        </div>
        );
    }
}

export default withRouter(withLanguage(ProfileNavbar));

ProfileNavbar.propTypes = {
    activeTab: PropTypes.string,
    renderActiveTab: PropTypes.func,
};
