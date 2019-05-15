import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { withSnackbar } from "notistack";
import Texts from "../Constants/Texts";
import withLanguage from "./LanguageContext";
import PhotoPreviewBubble from "./PhotoPreviewBubble";
import Log from "./Log";

const dataURLtoFile = (dataurl, filename) => {
  const arr = dataurl.split(",");

  const mime = arr[0].match(/:(.*?);/)[1];

  const bstr = atob(arr[1]);

  let n = bstr.length;

  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};

class AnnouncementBar extends React.Component {
  state = { message: "", photos: [] };

  componentDidMount() {
    document.addEventListener("message", this.handleMessage, false);
  }

  componentWillUnmount() {
    document.removeEventListener("message", this.handleMessage, false);
  }

  handleMessage = event => {
    const data = JSON.parse(event.data);
    if (data.action === "fileUpload") {
      const image = `data:image/png;base64, ${data.value}`;
      this.setState({
        photos: [{ photo: dataURLtoFile(image, "photo.png"), preview: image }]
      });
    }
  };

  handleEnter = event => {
    if (event.keyCode === 13) this.handleSend();
  };

  handleSend = () => {
    const { groupId, handleRefresh } = this.props;
    const { message, photos } = this.state;
    if (message || photos.length > 0) {
      const user_id = JSON.parse(localStorage.getItem("user")).id;
      const bodyFormData = new FormData();
      if (photos.length > 0) {
        for (let i = 0; i < photos.length; i += 1) {
          bodyFormData.append("photo", photos[i].photo);
        }
      }
      bodyFormData.append("message", message);
      bodyFormData.append("user_id", user_id);
      axios
        .post(`/api/groups/${groupId}/announcements`, bodyFormData)
        .then(response => {
          Log.info(response);
          handleRefresh();
        })
        .catch(error => {
          Log.error(error);
        });
      this.setState({ message: "", photos: [] });
    }
  };

  handleMessageChange = event => {
    this.setState({ message: event.target.value });
  };

  getPhotoPreview = photo => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = e => {
        const photoWithPrev = photo;
        photoWithPrev.preview = e.target.result;
        resolve(photoWithPrev);
      };
      reader.onerror = e => {
        reject(e);
      };
      reader.readAsDataURL(photo.photo);
    });
  };

  handleImageUpload = async event => {
    const { enqueueSnackbar, language } = this.props;
    const snackMessage = Texts[language].replyBar.maxFilesError;
    if (event.target.files) {
      const photos = [...event.target.files].map(file => {
        return { photo: file, preview: "" };
      });
      if (photos.length > 3) {
        enqueueSnackbar(snackMessage, {
          variant: "error"
        });
      } else {
        const photosWithPreview = await Promise.all(
          photos.map(photo => this.getPhotoPreview(photo))
        );
        this.setState({ photos: photosWithPreview });
      }
    }
  };

  handleNativeImageChange = () => {
    window.postMessage(JSON.stringify({ action: "fileUpload" }), "*");
  };

  handlePreviewDelete = photo => {
    const { photos } = this.state;
    this.setState({
      photos: photos.filter(p => p.preview !== photo.preview)
    });
  };

  render() {
    const { language } = this.props;
    const texts = Texts[language].replyBar;
    const { photos, message } = this.state;
    return (
      <React.Fragment>
        <PhotoPreviewBubble
          photos={photos}
          handleDelete={this.handlePreviewDelete}
        />
        <div id="announcementBarContainer" className="row no-gutters">
          <div id="announcementBubble" className="center">
            <div className="row no-gutters verticalCenter">
              <div className="col-7-10">
                <input
                  type="text"
                  className="center"
                  value={message}
                  placeholder={texts.new}
                  onChange={this.handleMessageChange}
                  onKeyUp={this.handleEnter}
                />
              </div>
              <div className="col-3-10" id="announcementBubbleButtons">
                <label htmlFor="uploadPhotoInput">
                  <i
                    role="button"
                    tabIndex="-1"
                    className="fas fa-camera"
                    onClick={() =>
                      window.isNative ? this.handleNativeImageChange : {}
                    }
                  />
                  {!window.isNative && (
                    <input
                      id="uploadPhotoInput"
                      type="file"
                      accept="image/*"
                      name="photo"
                      multiple
                      onChange={this.handleImageUpload}
                    />
                  )}
                </label>
                <i
                  role="button"
                  tabIndex="-1"
                  className="fas fa-paper-plane"
                  onClick={this.handleSend}
                />
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

AnnouncementBar.propTypes = {
  handleRefresh: PropTypes.func,
  groupId: PropTypes.string,
  language: PropTypes.string,
  enqueueSnackbar: PropTypes.func
};

export default withSnackbar(withLanguage(AnnouncementBar));
