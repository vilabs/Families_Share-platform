import React from "react";
import Images from "../Constants/Images";

const AboutHeader = () => {
  return (
    <div className="row no-gutters" id="landingHeaderContainer">
      <img src={Images.kids} alt="Kids" className="aboutScreenHeaderImage" />
      <div id="aboutHeaderLogoContainer">
        <img src={Images.familyShareLogo} alt="family share logo" />
      </div>
    </div>
  );
};

export default AboutHeader;
