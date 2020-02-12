import React from "react";
import { withRouter } from "react-router-dom";
import Collapse from "antd/lib/collapse";
import PropTypes from "prop-types";
import BackNavigation from "./BackNavigation";
import Texts from "../Constants/Texts";
import withLanguage from "./LanguageContext";
import Faqs from "../Constants/Faqs";

const FaqsScreen = ({ language, history }) => {
  const texts = Texts[language].faqsScreen;
  const faqs = Faqs[process.env.REACT_APP_CITYLAB][language];
  return (
    <div>
      <BackNavigation
        title={texts.backNavTitle}
        onClick={() => history.goBack()}
      />
      <div id="faqsContainer">
        <Collapse accordion bordered={false}>
          {faqs.map((faq, index) => (
            <Collapse.Panel
              header={faq.question}
              style={{ border: "none" }}
              className="collapsibleTitle"
              key={index}
            >
              {faq.answer}
            </Collapse.Panel>
          ))}
        </Collapse>
      </div>
    </div>
  );
};

FaqsScreen.propTypes = {
  language: PropTypes.string,
  history: PropTypes.object
};

export default withRouter(withLanguage(FaqsScreen));
