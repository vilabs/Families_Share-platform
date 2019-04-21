import React from "react";
import PropTypes from "prop-types";
import Highlighter from "./Highlighter";

class AutoComplete extends React.Component {
  handleClick = id => {
    this.props.handleSearch(id);
  };

  getSuggestions = value => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    const suggestions =
      inputLength === 0
        ? []
        : this.props.entities.filter(entity =>
            entity.name.toLowerCase().includes(inputValue.toLowerCase().trim())
          );
    return suggestions;
  };

  renderSuggestions = () => {
    return (
      <ul>
        {this.getSuggestions(this.props.searchInput).map(
          (suggestion, index) => (
            <li key={index}>
              <div
                className="row no-gutters"
                style={{ cursor: "pointer", margin: "0.7rem 0" }}
                onClick={() => this.handleClick(suggestion.name)}
              >
                <div className="col-2-10">
                  <i className="fas fa-search" />
                </div>
                <div className="col-8-10">
                  <div className="autoCompleteText">
                    <Highlighter
                      text={suggestion.name}
                      highlight={this.props.searchInput}
                    />
                  </div>
                </div>
              </div>
            </li>
          )
        )}
      </ul>
    );
  };

  render() {
    return this.renderSuggestions();
  }
}

export default AutoComplete;

AutoComplete.propTypes = {
  entities: PropTypes.array,
  searchInput: PropTypes.string,
  handleSearch: PropTypes.func
};
