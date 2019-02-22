import React from 'react';
import Texts from '../Constants/Texts.js';
import Images from '../Constants/Images.js';
import withLanguage from './LanguageContext';

class LandingHeader extends React.Component {
  render() {
    const texts = Texts[this.props.language].landingHeader
    return (
      <div className="row no-gutters" id="landingHeaderContainer">
          <img src={Images.cityBackground} alt="city logo" className="cityImage" />
          <div className="center" id="landingHeaderBrandContainer">
            <img src={Images.familyShareLogo}
              className="landingHeaderLogo" alt="family share logo"
            />
            <h1 className="cityName">{texts.communityName}</h1>
          </div>
      </div>

    );
  }
}

export default withLanguage(LandingHeader);
