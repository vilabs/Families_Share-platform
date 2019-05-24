import React from "react";
import Images from "../Constants/Images";

const NoMatchScreen = () => {
  const errorImage = Images.noMatchImage;
  return (
    <div id="noMatchScreenContainer">
      <img src={errorImage} alt=" 404 error" />
    </div>
  );
};

export default NoMatchScreen;
