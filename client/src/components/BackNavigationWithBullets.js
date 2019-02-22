import React from 'react';
import PropTypes from 'prop-types';

export default class BackNavigationWithBullets extends React.Component {
  render() {
    return (
      <div className="row no-gutters" id="backNavContainer">
        <div className="col-2-10">
          <button className="transparentButton" onClick={this.props.handleBackNav}>
            <i className="fas fa-arrow-left"/>
          </button>
        </div>
        <div className="col-6-10 ">
          <h1>{this.props.title}</h1> 
        </div>
        <div className="col-2-10 "> 
          <button className="transparentButton" style={{float:"right"}} onClick={this.props.handleModal}>
            <i className="fas fa-ellipsis-v"/>
          </button>
        </div>
      </div>
    );
  }
}


BackNavigationWithBullets.propTypes = {

  title: PropTypes.string,
  handleModal: PropTypes.func
};
