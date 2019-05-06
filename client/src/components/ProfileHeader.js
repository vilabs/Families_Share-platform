import React from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";
import OptionsModal from "./OptionsModal";
import withLanguage from "./LanguageContext";
import Texts from "../Constants/Texts";
import ConfirmDialog from "./ConfirmDialog";
import Log from "./Log";
import { withSnackbar } from "notistack";

class ProfileHeader extends React.Component {
  state = { optionsModalIsOpen: false, confirmDialogIsOpen: false, action: "" };

  handleClose = () => {
    this.setState({ optionsModalIsOpen: false });
  };

  handleEdit = () => {
    const pathName = this.props.history.location.pathname;
    const parentPath = pathName.slice(0, pathName.lastIndexOf("/"));
    const newPath = `${parentPath}/edit`;
    this.props.history.push(newPath);
  };

  handleOptions = () => {
    this.setState({ optionsModalIsOpen: !this.state.optionsModalIsOpen });
  };

  handleExport = () => {
    const userId = this.props.match.params.profileId;
    axios
      .post(`/api/users/${userId}/export`)
      .then(response => {
        Log.info(response);
      })
      .catch(error => {
        Log.error(error);
      });
  };

  handleDelete = () => {
    const userId = this.props.match.params.profileId;
    axios
      .delete(`/api/users/${userId}`)
      .then(response => {
        Log.info(response);
        localStorage.removeItem("user");
        this.props.history.push("/");
      })
      .catch(error => {
        Log.error(error);
      });
  };
	handleSuspend = () => {
		const { match, language, enqueueSnackbar, history } = this.props;
		const { profileId: userId } = match.params;
		const texts = Texts[language].profileHeader
    axios
      .post(`/api/users/${userId}/suspend`)
      .then(response => {
				enqueueSnackbar( texts.suspendSuccess, {variant: "info"})
        setTimeout(()=>{ 
					Log.info(response);
					localStorage.removeItem("user");
					history.push("/");
				}, 2000)
      })
      .catch(error => {
				Log.error(error);
				enqueueSnackbar( texts.error, {variant: "error"})
      });
	}
  handleBackNav = () => {
    this.props.history.goBack();
  };
  handleConfirmDialogOpen = action => {
    this.setState({
      confirmDialogIsOpen: true,
      optionsModalIsOpen: false,
      action
    });
  };

  handleConfirmDialogClose = choice => {
    if (choice === "agree") {
      switch (this.state.action) {
        case "delete":
          this.handleDelete();
          break;
        case "export":
          this.handleExport();
					break;
				case "suspend":
					this.handleSuspend();
					break;
        default:
      }
    }
    this.setState({ confirmDialogIsOpen: false });
  };

  render() {
		const texts = Texts[this.props.language].profileHeader;
		const { action } = this.state;
		let confirmDialogTitle;
		switch(action){
			case "delete":
				confirmDialogTitle = texts.deleteDialogTitle
				break;
			case "export":
				confirmDialogTitle = texts.exportDialogTitle
				break;
			case "suspend":
				confirmDialogTitle = texts.suspendDialogTitle
				break;
			default:
		}
    const options = [
      {
        label: texts.delete,
        style: "optionsModalButton",
        handle: () => {
          this.handleConfirmDialogOpen("delete");
        }
			},
			{
				label: texts.suspend,
				style: "optionsModalButton",
				handle: () => {
					this.handleConfirmDialogOpen("suspend");
				}
			},
      {
        label: texts.export,
        style: "optionsModalButton",
        handle: () => {
          this.handleConfirmDialogOpen("export");
        }
			},
    ];
    return (
      <div id="profileHeaderContainer">
        <div className="row no-gutters" id="profileHeaderOptions">
          <div className="col-2-10">
            <button
              className="transparentButton center"
              onClick={() => this.props.history.goBack()}
            >
              <i className="fas fa-arrow-left" />
            </button>
          </div>
          <div className="col-6-10" />
          {this.props.match.params.profileId ===
          JSON.parse(localStorage.getItem("user")).id ? (
            <React.Fragment>
              <div className="col-1-10">
                <button
                  className="transparentButton center"
                  onClick={this.handleEdit}
                >
                  <i className="fas fa-pencil-alt" />
                </button>
              </div>
              <div className="col-1-10">
                <button
                  className="transparentButton center"
                  onClick={this.handleOptions}
                >
                  <i className="fas fa-ellipsis-v" />
                </button>
              </div>
            </React.Fragment>
          ) : (
            <div />
          )}
        </div>
        <img
          className="profilePhoto horizontalCenter"
          alt="user's profile"
          src={this.props.photo}
        />
        <h1 className="horizontalCenter">{this.props.name}</h1>
        <OptionsModal
          isOpen={this.state.optionsModalIsOpen}
          handleClose={this.handleClose}
          options={options}
        />
        <ConfirmDialog
          title={confirmDialogTitle}
          isOpen={this.state.confirmDialogIsOpen}
          handleClose={this.handleConfirmDialogClose}
        />
      </div>
    );
  }
}

export default withRouter(withLanguage(withSnackbar(ProfileHeader)));
