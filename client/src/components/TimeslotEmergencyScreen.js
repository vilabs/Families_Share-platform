import React from "react";
import PropTypes from "prop-types";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { withSnackbar } from "notistack";
import withLanguage from "./LanguageContext";
import Texts from "../Constants/Texts";
import BackNavigation from "./BackNavigation";
import EmegencyNunbers from "../Constants/EmergencyNumbers";
import ConfirmDialog from "./ConfirmDialog";

class TimeslotEmergencyScreen extends React.Component {
  constructor(props) {
    super(props);
    const { history } = this.props;
    const { state } = history.location;
    if (state !== undefined) {
      this.state = {
        ...state.timeslot,
        confirmIsOpen: false,
        confirmService: ""
      };
    } else {
      this.state = {
        summary: "",
        confirmIsOpen: false,
        confirmService: ""
      };
    }
  }

  state = { confirmIsOpen: false };

  handleConfirmClose = choice => {
    const { confirmService } = this.state;
    if (choice === "agree") {
      window.ReactNativeWebView.postMessage(
        JSON.stringify({
          action: "phoneCall",
          value: this.getServiceNumber(confirmService)
        })
      );
    }
    this.setState({ confirmIsOpen: false, confirmService: "" });
  };

  handleEmergency = service => {
    const { enqueueSnackbar, language } = this.props;
    const texts = Texts[language].timeslotEmergencyScreen;
    if (window.isNative) {
      this.setState({ confirmIsOpen: true, confirmService: service });
    } else {
      enqueueSnackbar(texts.copy, {
        variant: "info"
      });
    }
  };

  getServiceNumber = service => {
    const citylab = process.env.REACT_APP_CITYLAB;
    let numbers;
    switch (citylab) {
      case "Bologna":
      case "Venice":
      case "Pescara":
      case "FBK":
        numbers = EmegencyNunbers.Italy;
        break;
      case "Budapest":
        numbers = EmegencyNunbers.Hungary;
        break;
      case "Thessaloniki":
        numbers = EmegencyNunbers.Greece;
        break;
      case "Cokido":
        numbers = EmegencyNunbers.Belgium;
        break;
      default:
        numbers = EmegencyNunbers.Greece;
    }
    return numbers.find(n => n.service === service).number;
  };

  render() {
    const { history, language } = this.props;
    const texts = Texts[language].timeslotEmergencyScreen;
    const { confirmIsOpen, confirmService, summary } = this.state;
    const services = Object.keys(texts.services);

    return (
      <div>
        <ConfirmDialog
          isOpen={confirmIsOpen}
          title={`${texts.call} ${texts.services[confirmService]}?`}
          handleClose={this.handleConfirmClose}
        />
        <BackNavigation title={summary} onClick={() => history.goBack()} />
        <div className="emergencyContainer">
          <div className="emergencyHeader">{texts.header}</div>
          {services.map(service => (
            <div key={service} className="emergencyServiceContainer">
              <div className="emergencyServiceTitle">
                {texts.services[service]}
              </div>
              <CopyToClipboard text={this.getServiceNumber(service)}>
                <i
                  role="button"
                  tabIndex={-42}
                  className="emergencyNumber fas fa-phone"
                  onClick={() => {
                    this.handleEmergency(service);
                  }}
                />
              </CopyToClipboard>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

TimeslotEmergencyScreen.propTypes = {
  history: PropTypes.object,
  language: PropTypes.string,
  enqueueSnackbar: PropTypes.func
};

export default withSnackbar(withLanguage(TimeslotEmergencyScreen));
