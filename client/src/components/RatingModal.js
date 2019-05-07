import Modal from "react-modal";
import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import Rating from "react-rating";
import Texts from "../Constants/Texts";
import withLanguage from "./LanguageContext";
import Log from "./Log";

Modal.setAppElement("#root");

class RatingModal extends React.Component {
  state = { rating: 0 };

  componentDidMount() {
    const userId = JSON.parse(localStorage.getItem("user")).id;
    axios
      .get(`/api/users/${userId}/rating`)
      .then(response => {
        this.setState({ rating: response.data.rating });
      })
      .catch(error => {
        Log.error(error);
      });
  }

  handleRate = () => {
    const userId = JSON.parse(localStorage.getItem("user")).id;
    axios
      .patch(`/api/users/${userId}/rating`, { rating: this.state.rating })
      .then(reponse => {
        this.props.handleClose();
      })
      .catch(error => {
        Log.error(error);
      });
  };

  render() {
    const texts = Texts[this.props.language].ratingModal;
    const modalStyle = {
      overlay: {
        zIndex: 1000,
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.8)"
      },
      content: {
        borderRadius: "0.5rem",
        padding: "1rem 2rem",
        left: "50%",
        top: "50%",
        position: "relative",
        transform: "translate(-50%,-50%)",
        backgroundColor: "#ffffff",
        width: "80%",
        maxWidth: "46rem",
        height: "32rem"
      }
    };
    return (
      <Modal
        style={modalStyle}
        isOpen={this.props.isOpen}
        onRequestClose={this.props.handleClose}
        contentLabel="Rating Modal"
      >
        {" "}
        <div className="ratingLogo" />
        <div className="ratingHeader">{texts.title}</div>
        <div className="ratingMain">
          <Rating
            initialRating={this.state.rating}
            onClick={rating => {
              this.setState({ rating });
            }}
            emptySymbol={<i className="fas fa-star ratingStar" />}
            fullSymbol={<i className="fas fa-star ratingStarSelected" />}
          />
        </div>
        <div className="ratingFooter">
          <div className="ratingGuide ">{texts.rateInstruction}</div>
          <button className="ratingButton" onClick={this.handleRate}>
            {texts.rate}
          </button>
        </div>
      </Modal>
    );
  }
}

RatingModal.propTypes = {
  isOpen: PropTypes.bool,
  handleClose: PropTypes.func
};

export default withLanguage(RatingModal);
