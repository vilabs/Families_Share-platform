import React from "react";
import PropTypes from "prop-types";
import { disableBodyScroll, clearAllBodyScrollLocks } from "body-scroll-lock";
import * as path from "lodash.get";
import ExpandedImageModal from "./ExpandedImageModal";

class AnnouncementMain extends React.Component {
  state = { imageModalIsOpen: false, expandedImage: "" };

  handleModalOpen = image => {
    const target = document.querySelector(".ReactModalPortal");
    disableBodyScroll(target);
    this.setState({ imageModalIsOpen: true, expandedImage: image });
  };

  handleModalClose = () => {
    clearAllBodyScrollLocks();
    this.setState({ imageModalIsOpen: false, expandedImage: "" });
  };

  render() {
    const { imageModalIsOpen, expandedImage } = this.state;
    const { message, images } = this.props;
    return (
      <div id="announcementMainContainer" className="horizontalCenter">
        {imageModalIsOpen && (
          <ExpandedImageModal
            isOpen={imageModalIsOpen}
            handleClose={this.handleModalClose}
            image={expandedImage}
          />
        )}
        <div className="row no-gutters">
          <h1 className="dont-break-out">{message}</h1>
        </div>
        <ul>
          {images.map((image, index) => (
            <li key={index}>
              <img
                src={path(image, ["path"])}
                alt="announcement content"
                onClick={() => this.handleModalOpen(path(image, ["path"]))}
              />
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

AnnouncementMain.propTypes = {
  message: PropTypes.string,
  images: PropTypes.array
};

export default AnnouncementMain;
