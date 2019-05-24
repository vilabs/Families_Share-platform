import React from "react";
import Images from "../Constants/Images";

const LoadingSpinner = () => {
  const loadingSpinner = Images.spinner;
  return (
    <img
      style={{ zIndex: 500 }}
      src={loadingSpinner}
      className="loading-spinner"
      alt="loading spinner"
    />
  );
};

export default LoadingSpinner;
