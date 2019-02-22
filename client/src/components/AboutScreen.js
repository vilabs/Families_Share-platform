import React from 'react';
import AboutHeader from './AboutHeader';
import BackNavigation from './BackNavigation';
import Texts from '../Constants/Texts.js';
import Images from '../Constants/Images.js';
import withLanguage from './LanguageContext';

class AboutScreen extends React.Component {
	state = { aboutCollapsed: false, challengeCollapsed: false, solutionCollapsed: false}
	handleFindMore = () => {
		const message = {
			action: 'findOutMore'
		}
		window.isNative?window.postMessage(JSON.stringify(message),'*'):window.location.replace('https://www.families-share.eu')
	}
  render() {
    const texts = Texts[this.props.language].aboutScreen;
    return (
      <div>
        <BackNavigation title={texts.backNavTitle} onClick={() => this.props.history.goBack()} />
        <AboutHeader />
				<div className="findMoreRow">
            <button onClick={this.handleFindMore} className="findOutMore">{texts.findOutMore}</button> 
        </div>
        <div className="aboutMainContainer">
          <div className="row no-gutters">
						<div className="col-9-10">
            	<h1 className="aboutColor">{texts.aboutHeader}</h1>
						</div>
						<div className="col-1-10">
							<button className="transparentButton" onClick={() => this.setState({ aboutCollapsed: !this.state.aboutCollapsed })}>
								<i className={this.state.aboutCollapsed ? "fas fa-chevron-up" : "fas fa-chevron-down"} />
							</button>
						</div>
					</div>
					<div className="row no-gutters " style={this.state.aboutCollapsed ? {} : { display: "none" }}>
						<p>{texts.firstParagraph}</p>
					</div>
					<div className="row no-gutters">
						<div className="col-9-10">
							<h1>{texts.challengeHeader}</h1>
						</div>
						<div className="col-1-10">
							<button className="transparentButton" onClick={() => this.setState({ challengeCollapsed: !this.state.challengeCollapsed })}>
								<i className={this.state.challengeCollapsed ? "fas fa-chevron-up" : "fas fa-chevron-down"} />
							</button>
						</div>
          </div>
          <div className="row no-gutters " style={this.state.challengeCollapsed ? {} : { display: "none" }}>
            <p>{texts.secondParagraph}</p>
          </div>
        {/* <div id="landingHeaderContainer" className="row no-gutters">
          <img src={Images.challengeImage} alt="De Stuyverij" className="challengeImage"></img>
        </div> */}
					<div className="row no-gutters">
						<div className="col-9-10">
							<h1>{texts.familyShareSolution}</h1>
						</div>
						<div className="col-1-10">
							<button className="transparentButton" onClick={() => this.setState({ solutionCollapsed: !this.state.solutionCollapsed })}>
								<i className={this.state.solutionCollapsed ? "fas fa-chevron-up" : "fas fa-chevron-down"} />
							</button>
						</div>
					</div>
					<div className="row no-gutters" style={this.state.solutionCollapsed ? {} : { display: "none" }}>
						<p>{texts.fourthParagraph}</p>
					</div>
					{window.isNative?
					<div className="row no-gutters">
							<h2>{`App Version: ${localStorage.getItem("version")}`} </h2>
					</div>
					:null}
        </div>
        <div className="row no-gutters europeanUnionRow">
          <div className="col-2-10">
            <img src={Images.europeanUnionLogo} alt="Funded by the european union" className="europeanUnionLogo"></img>
          </div>
          <div className="col-8-10">
            <p  className="europeanFundingText">{texts.europeanUnionText}</p>
          </div>
        </div>
      </div>
    );
  }
}


export default withLanguage(AboutScreen);
