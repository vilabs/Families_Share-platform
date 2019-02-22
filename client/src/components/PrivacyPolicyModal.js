import Modal from "react-modal";
import React from "react";
import withLanguage from "./LanguageContext";
import Texts from "../Constants/Texts.js";
import PropTypes from "prop-types";


Modal.setAppElement("#root");

class PrivacyPolicyModal extends React.Component {
	state = { page: 1 };
	closeModal = () => {
		this.props.handleClose();
	};
	afterOpenModal = () => { };
	handleAccept = () => {
		this.props.handleAccept()
	};
	handleNextPage = ()=> {
		if(this.state.page===1){
			this.setState({ page : 2})
		}
	}
	handlePreviousPage = () => {
		if(this.state.page===2){
			this.setState({ page : 1})
		}
	}
	render() {
		const texts = Texts[this.props.language].privacyPolicyModal;
		const modalStyle = {
			overlay: {
				zIndex: 1500,
				position: "fixed",
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				backgroundColor: "rgba(0, 0, 0, 0.8)"
			},
			content: {
				position: "fixed",
				top: "50%",
				left: "50%",
				transform: "translate(-50%,-50%)",
				backgroundColor: "#ffffff",
				width: "100%",
				height: "100%",
				overflow: 'hidden',
			}
		};
		return (
			<Modal
				style={modalStyle}
				isOpen={this.props.isOpen}
				onAfterOpen={this.afterOpenModal}
				onRequestClose={this.closeModal}
				contentLabel="PrivacyPolicy Modal"
			>
				<div id="termsAndPolicyHeader">
					<button className="transparentButton" onClick={this.closeModal} >
						<i className="fas fa-times" />
					</button>
				</div>
				<div id="termsAndPolicyMain">
					{this.state.page === 1 ?
						<div>
							<h1>
								{texts.termsHeader}
							</h1>
							<p>
								{texts.terms}
							</p>
						</div>
						: null
					}
					{this.state.page === 2 ?
						<div>
							<h1>
								{texts.privacyHeader}
							</h1>
							<p>
								{texts.privacy}
							</p>
							<button className="center" onClick={this.handleAccept}>
								{texts.accept}
							</button>
						</div>
						: null
					}
				</div>
				<div id="termsAndPolicyFooter">
					<button className="transparentButton" onClick={this.handlePreviousPage}>
						<i className="fas fa-chevron-left" style={this.state.page === 1 ? { opacity: 0.3 } : {}} />
					</button>
					<button className="transparentButton" onClick={this.handleNextPage}>
						<i className="fas fa-chevron-right" style={this.state.page === 2 ? { opacity: 0.3 } : {}} />
					</button>
				</div>
			</Modal>
		);
	}
}

PrivacyPolicyModal.propTypes = {
	isOpen: PropTypes.bool,
	handleClose: PropTypes.func,
	handleAccept: PropTypes.func,
};

export default withLanguage(PrivacyPolicyModal);
