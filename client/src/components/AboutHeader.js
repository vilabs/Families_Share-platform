import React from 'react';
import Images from '../Constants/Images.js';

export default class AboutHeader extends React.Component {
  render() {
    return (
      <div className="row no-gutters" id="landingHeaderContainer">
        <img src={Images.kids} alt="Kids" className="aboutScreenHeaderImage" />
        <div id="aboutHeaderLogoContainer">
          <img src={Images.familyShareLogo} alt="family share logo" />
        </div>
      </div>
    );
  }
}
