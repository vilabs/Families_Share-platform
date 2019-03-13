import React from 'react';
import { withRouter } from 'react-router-dom';
import Collapse from 'antd/lib/collapse';
import BackNavigation from './BackNavigation';
import Texts from '../Constants/Texts.js';
import withLanguage from './LanguageContext';

class FaqsScreen extends React.Component {
  render() {
    const texts = Texts[this.props.language].faqsScreen;
    const { faqs } = texts;
    return (
      <div>
        <BackNavigation
          title={texts.backNavTitle}
          onClick={() => this.props.history.goBack()}
        />
        <ul id="faqsContainer">
          {
                        faqs.map((faq, index) => (
                          <li className="faq" key={index}>
                            <h1>{faq.question}</h1>
                            <Collapse accordion bordered={false}>
                              { faq.dropdowns.map((collapsible, collapsibleIndex) => (
                                <Collapse.Panel header={collapsible.title} style={{ border: 'none' }} className="collapsibleTitle" key={collapsibleIndex}>
                                  <p>{collapsible.paragraph}</p>
                                </Collapse.Panel>
                              ))}
                            </Collapse>
                          </li>
                        ))}
        </ul>
      </div>
    );
  }
}


export default withRouter(withLanguage(FaqsScreen));
