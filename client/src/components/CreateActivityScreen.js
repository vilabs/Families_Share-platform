import React from 'react';
import withLanguage from './LanguageContext';
import Texts from '../Constants/Texts.js';
import BackNavigation from './BackNavigation';
import CreateActivityStepper from './CreateActivityStepper';

class CreateActivityScreen extends React.Component {
  render() {
    const texts = Texts[this.props.language].createActivityScreen;
    return (
      <div id="createActivityContainer">
        <BackNavigation
          title={texts.backNavTitle}
          onClick={() => this.props.history.goBack()}
        />
        <CreateActivityStepper {...this.props} />
      </div>
    );
  }
}

export default withLanguage(CreateActivityScreen);
