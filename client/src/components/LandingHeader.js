import React from "react";
import Images from "../Constants/Images";

const LandingHeader = () => {
  return (
    <div className="row no-gutters" id="landingHeaderContainer">
      <img
        src={Images.citylabImage}
        alt="city logo"
        className="cityImage"
      />
      <div className="center" id="landingHeaderBrandContainer">
        <img
          src={Images.familyShareLogo}
          className="landingHeaderLogo"
          alt="family share logo"
        />
        <h1 className="cityName">{process.env.REACT_APP_CITYLAB_NAME}</h1>
      </div>
    </div>
  );
};

export default LandingHeader;
