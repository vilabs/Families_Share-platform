import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

const Avatar = ({
  disabled,
  history,
  route,
  routeState,
  thumbnail,
  className,
  style
}) => {
  const handleNav = () => {
    if (!disabled) {
      history.push({
        pathname: route,
        state: routeState
      });
    }
  };

  return (
    <div id="avatarContainer">
      <img
        src={thumbnail}
        className={className}
        style={style}
        onClick={handleNav}
        alt="avatar"
      />
    </div>
  );
};

Avatar.propTypes = {
  thumbnail: PropTypes.string,
  style: PropTypes.object,
  className: PropTypes.string,
  route: PropTypes.string,
  routeState: PropTypes.object,
  disabled: PropTypes.bool,
  history: PropTypes.object
};

export default withRouter(Avatar);
