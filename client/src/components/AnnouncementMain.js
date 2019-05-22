import React from "react";
import PropTypes from "prop-types";
import { disableBodyScroll, clearAllBodyScrollLocks } from "body-scroll-lock";
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
          <h1>{message}</h1>
        </div>
        <ul>
          {images.map((image, index) => (
            <li key={index}>
              <img
                src={image.path}
                alt="announcement content"
                onClick={() => this.handleModalOpen(image.path)}
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
