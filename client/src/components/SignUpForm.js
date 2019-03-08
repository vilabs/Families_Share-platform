import React from "react";
import Texts from "../Constants/Texts.js";
import Switch from "@material-ui/core/Switch";
import { withStyles } from "@material-ui/core/styles";
import withLanguage from "./LanguageContext";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import registrationActions from "../Actions/RegistrationActions";
import Images from '../Constants/Images';
import AlertModal from './AlertModal';
import PrivacyPolicyModal from './PrivacyPolicyModal';
//import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';

const styles = theme => ({
	colorSwitchBase: {
    color: "#c43e00",
    '&$colorChecked': {
      color: "#c43e00",
      '& + $colorBar': {
				backgroundColor: "#ffa040",
				opacity: 1,
      },
    },
	},
	colorBar: {},
  colorChecked: {},
})

class SignUpForm extends React.Component {
  constructor() {
    super();
    this.state = {
      formIsValidated: false,
      policyModalIsOpen: false,
      profileVisibility: true,
      acceptTerms: false,
      givenName: "",
      familyName: "",
      phoneNumber: "",
      email: "",
      password: "",
      passwordConfirm: "",
      alertModalIsOpen: false,
    };
	}
	componentDidMount(){
		document.getElementById("termsAndPolicy").setCustomValidity(Texts[this.props.language].signUpForm.acceptTermsError)
	}

  handleAlertClose = () => {
    this.setState({ alertModalIsOpen: false })
  }
  validate = () => {
    const formLength = this.formEl.length;
    if (
      this.formEl.checkValidity() === false ||
      this.state.acceptTerms === false
    ) {
      for (let i = 0; i < formLength; i++) {
        const elem = this.formEl[i];
        const errorLabel = document.getElementById(elem.name + "Err");
        if (errorLabel && elem.nodeName.toLowerCase() !== "button") {
          if (!elem.validity.valid) {
            errorLabel.textContent = elem.validationMessage;
          } else {
            errorLabel.textContent = "";
          }
        }
      }
      return false;
    } else {
      for (let i = 0; i < formLength; i++) {
        const elem = this.formEl[i];
        const errorLabel = document.getElementById(elem.name + "Err");
        if (errorLabel && elem.nodeName.toLowerCase() !== "button") {
          errorLabel.textContent = "";
        }
      }

      return true;
    }
  }
  submit = () => {
		const deviceToken = JSON.parse(localStorage.getItem("deviceToken"))
    const given_name = this.state.givenName;
    const family_name = this.state.familyName;
    const number = this.state.phoneNumber;
    const email = this.state.email;
    const visible = this.state.profileVisibility;
    const password = this.state.password;
    this.props.dispatch(
      registrationActions.signup(
        given_name,
        family_name,
        number,
        email,
        password,
				visible,
				deviceToken,
				this.props.history,
      )
    );
  }
  handleSubmit = (event)  => {
    event.preventDefault();
    if (this.validate()) {
      this.submit();
    }
    this.setState({ formIsValidated: true, alertModalIsOpen: true });
  }
  handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    if (name === "passwordConfirm") {
      if (this.state.password !== event.target.value) {
        event.target.setCustomValidity(
          Texts[this.props.language].signUpForm.passwordError
        );
      } else {
        event.target.setCustomValidity("");
      }
		}
    name === "acceptTerms"
      ? this.setState({ [name]: !this.state[name] })
      : this.setState({ [name]: value });
	}
	handleSwitch = () => {
		this.setState({ profileVisibility: !this.state.profileVisibility})
	}
  handlePolicyOpen = () => {
		//const target = document.querySelector('.ReactModalPortal')
		//disableBodyScroll(target)
    this.setState({policyModalIsOpen: true});
  }
  handlePolicyClose = () => {
		//const target = document.querySelector('.ReactModalPortal')
		//enableBodyScroll(target)
    this.setState({policyModalIsOpen: false});
  }
  handleAccept = () => {
		document.getElementById("termsAndPolicy").setCustomValidity("")
    this.setState({ acceptTerms: true, policyModalIsOpen: false});

	}
	filledInput = () => {
		const state = this.state
		return state.givenName && state.familyName && state.phoneNumber && state.email && state.password && state.passwordConfirm
	}
  render() {
		const { classes } = this.props;
    const { error } = this.props;
    const texts = Texts[this.props.language].signUpForm;
    const formClass = [];
    if (this.state.formIsValidated) {
      formClass.push("was-validated");
    }
    return (
      <form
        ref={form => (this.formEl = form)}
        onSubmit={this.handleSubmit}
        className={formClass}
        noValidate
      >
        <input
          type="text"
          placeholder={texts.givenName}
          name="givenName"
          className="signUpInputField form-control horizontalCenter"
          onChange={this.handleChange}
          required={true}
          value={this.state.givenName}
        />
        <span className="invalid-feedback" id="givenNameErr" />
        <input
          type="text"
          placeholder={texts.familyName}
          name="familyName"
          className="signUpInputField form-control horizontalCenter"
          onChange={this.handleChange}
          required={true}
          value={this.state.familyName}
        />
        <span className="invalid-feedback" id="familyNameErr" />
        <input
          type="text"
          placeholder={texts.phoneNumber}
          name="phoneNumber"
          className="signUpInputField form-control horizontalCenter"
          onChange={this.handleChange}
          value={this.state.phoneNumber}
        />
        <div className="line horizontalCenter" />
        <input
          type="email"
          placeholder={texts.email}
          name="email"
          className="signUpInputField form-control horizontalCenter horizontalCenter"
          onChange={this.handleChange}
          required={true}
          value={this.state.email}
        />
        <span className="invalid-feedback" id="emailErr" />
        <input
          placeholder={texts.password}
          type="password"
          name="password"
          className="signUpInputField form-control horizontalCenter"
          onChange={this.handleChange}
          required={true}
          minLength={8}
          value={this.state.password}
        />
        <span className="invalid-feedback" id="passwordErr" />
        <input
          placeholder={texts.confirmPassword}
          type="password"
          name="passwordConfirm"
          className="signUpInputField form-control horizontalCenter"
          onChange={this.handleChange}
          minLength={8}
          required={true}
          value={this.state.passwordConfirm}
        />
        <span className="invalid-feedback" id="passwordConfirmErr" />
        <div className="line horizontalCenter" />
        <div className="row no-gutters" style={{ alignItems: "center"}}>
          <h1 className="profileToggleText">{texts.profileVisibility}</h1>
            <Switch
							checked={this.state.profileVisibility}
							onClick={this.handleSwitch}
							classes={{
                switchBase: classes.colorSwitchBase,
                checked: classes.colorChecked,
                bar: classes.colorBar,
              }}
            />
        </div>
        <div className="acceptTermsContainer row no-gutters">
          <div className="col-2-10">
							<img className="policyIcon center" alt="policy icon" onClick ={this.handlePolicyOpen}
							src={this.state.acceptTerms?Images.policyAccepted:Images.policy} /> 
          </div>
          <div className="col-8-10" onClick={this.handlePolicyOpen}>
            <p className="acceptTermsText verticalCenter">
              {texts.termsPolicy}
            </p>
          </div>
        </div>
        <div className="row no-gutters">
          <input
            type="checkbox" style={{ display: "none" }} name="acceptTerms" className="form-control" required={true}
            checked={this.state.acceptTerms} id="termsAndPolicy" onChange={()=>{}}
          />
          <span className="invalid-feedback" id="acceptTermsErr" ></span>
        </div>
        <div className="row no-gutters">
          <input
						type="submit"
						style={this.filledInput()?{backgroundColor: "#00838F",color: "#ffffff"}:{}}
            className="signUpConfirmButton horizontalCenter"
            value={texts.confirm}
          />
        </div>
        <PrivacyPolicyModal isOpen={this.state.policyModalIsOpen} handleClose={this.handlePolicyClose} handleAccept={this.handleAccept}/>
        <AlertModal isOpen={error && this.state.alertModalIsOpen} message={`${texts.signupError} ${this.state.email}`}
        handleClose={this.handleAlertClose} type={"error"} />
      </form>
    );
  }
}

function mapStateToProps(state) {
  const { error } = state.registration;
  return {
    error
  };
}

const connectedSignUpForm = connect(mapStateToProps)(
  withRouter(withLanguage(withStyles(styles)(SignUpForm)))
);
export { connectedSignUpForm as SignUpForm };
