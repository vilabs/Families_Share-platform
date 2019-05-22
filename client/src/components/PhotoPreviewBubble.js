import React from "react";
import PropTypes from "prop-types";

const PhotoPreviewBubble = ({ photos, handleDelete }) => (
  <ul
    id="photoPreviewContainer"
    style={
      photos.length > 0
        ? { display: "flex", width: photos.length * 65 }
        : { display: "none", width: photos.length * 65 }
    }
  >
    {photos.map((photo, index) => (
      <li key={index}>
        <i
          role="button"
          tabIndex={-42}
          className="fas fa-times previewDelete"
          onClick={() => handleDelete(photo)}
        />
        <img
          className="photoPreview"
          src={photo.preview}
          alt="annnoucement upload preview"
        />
      </li>
    ))}
  </ul>
);
PhotoPreviewBubble.propTypes = {
  photos: PropTypes.array,
  handleDelete: PropTypes.func
};

export default PhotoPreviewBubble;
