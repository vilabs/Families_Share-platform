import React from 'react';
import PropTypes from 'prop-types';
import GroupListItem from './GroupListItem';
import withLanguage from './LanguageContext';
import LazyLoad from 'react-lazyload';

class GroupList extends React.Component {
  render() {
    const length = this.props.groupIds.length 
    const blocks = [...Array(Math.ceil(length/4)).keys()]
    return (
      <div className="suggestionsContainer">
        <ul>
          {blocks.map(block => {
            let indexes;
            if(length<=4){
              indexes = [...Array(length).keys()]
            } else {
              indexes= [...Array((block+1)*4<=length?4:length-block*4).keys()].map( x => block*4 + x )
						}
            return(
            <LazyLoad height={350} once offset={100}>
              {indexes.map((index) => 
                  <li key={index}>
                    <GroupListItem groupId={this.props.groupIds[index]} />
                  </li>
              )}
            </LazyLoad>
            )
          })
          }
        </ul>
      </div>
    );
  }
}

GroupList.propTypes = {
  groupIds: PropTypes.array
};

export default withLanguage(GroupList);
