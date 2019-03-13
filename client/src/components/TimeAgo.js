import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import withLanguage from './LanguageContext';


moment.locale('en');


class TimeAgo extends React.Component {
  render() {
    return (
      <h2 className="timeAgo">{moment(this.props.date).fromNow()}</h2>
    );
  }
}

export default withLanguage(TimeAgo);

TimeAgo.propTypes = {
  date: PropTypes.string,
};
