import React  from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import Texts  from '../Constants/Texts.js';
import withLanguage from './LanguageContext.js';

class CardWithLink extends React.Component {
  handleClick = () => {
    this.props.history.push(this.props.card.link);
  }
  render() {
    const card = this.props.card;
    const texts = Texts[this.props.language].cardWithLink;
    return(
      <div id="aboutCardContainer" className="horizontalCenter">
        <div className="row no-gutters">
          <h1>{card.cardHeader}</h1>
          <p>{card.cardInfo}</p>
        </div>
        {card.learnMore?
        <div className="row no-gutters">
          <button className="transparentButton learnMoreButton" onClick={this.handleClick} >
            {texts.learnMore}
          </button>
        </div>
        :<div/>
        }
      </div>
    );
  }
}

CardWithLink.propTypes = {
    card: PropTypes.object,
};

export default withRouter(withLanguage(CardWithLink));
