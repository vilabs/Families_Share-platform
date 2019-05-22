import React from "react";
import axios from "axios";
import PropTypes from "prop-types";
import withLanguage from "./LanguageContext";
import Texts from "../Constants/Texts";
import GroupList from "./GroupList";
import AutoComplete from "./AutoComplete";
import Log from "./Log";

class SearchGroupScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchInput: "",
      searchedForInput: false,
      matchingGroups: [],
      groups: [],
      fetchedGroups: false,
      searchBarIsVisible: false
    };
  }

  componentDidMount() {
    axios
      .get("/api/groups?searchBy=visibility&visible=true")
      .then(res => {
        const groups = res.data;
        this.setState({ fetchedGroups: true, groups });
        this.handleSearch("");
      })
      .catch(error => {
        Log.error(error);
        this.setState({ fetchedGroups: true });
      });
  }

  handleKeyPress = e => {
    const { searchInput } = this.state;
    if (e.key === "Enter") {
      this.handleSearch(searchInput);
    }
  };

  handleSearch = val => {
    const value = val.toLowerCase().trim();
    const { groups } = this.state;
    const matchingGroups = [];
    groups.forEach(group => {
      if (group.name.toLowerCase().includes(value)) {
        matchingGroups.push(group.group_id);
      }
    });
    this.setState({
      searchedForInput: true,
      searchInput: value,
      matchingGroups
    });
  };

  onInputChange = event => {
    this.setState({ searchInput: event.target.value, searchedForInput: false });
    if (event.target.value === "") this.handleSearch("");
  };

  handleSearchVisibility = async () => {
    const { searchBarIsVisible } = this.state;
    await this.setState({ searchBarIsVisible: !searchBarIsVisible });
    document.getElementById("searchGroupInput").focus();
  };

  render() {
    const { language, history } = this.props;
    const {
      fetchedGroups,
      searchBarIsVisible,
      searchInput,
      searchedForInput,
      groups,
      matchingGroups
    } = this.state;
    const texts = Texts[language].searchGroupModal;
    return (
      fetchedGroups && (
        <React.Fragment>
          <div className="row no-gutters" id="searchGroupBarContainer">
            <div className="col-2-10">
              <button
                type="button"
                className="transparentButton center"
                onClick={() => history.replace("/myfamiliesshare")}
              >
                <i className="fas fa-arrow-left" />
              </button>
            </div>
            <div
              className="col-7-10 "
              style={{ display: "flex", alignItems: "center" }}
            >
              <input
                type="search"
                id="searchGroupInput"
                value={searchInput}
                placeholder={texts.example}
                onChange={this.onInputChange}
                onKeyPress={this.handleKeyPress}
                style={searchBarIsVisible ? {} : { display: "none" }}
              />
              <h1 style={searchBarIsVisible ? { display: "none" } : {}}>
                {texts.search}
              </h1>
            </div>
            <div className="col-1-10">
              <button
                type="button"
                className="transparentButton center"
                onClick={this.handleSearchVisibility}
              >
                <i className="fas fa-search" />
              </button>
            </div>
          </div>
          {!searchedForInput ? (
            <div id="searchGroupSuggestionsContainer">
              <AutoComplete
                searchInput={searchInput}
                entities={groups}
                handleSearch={this.handleSearch}
              />
            </div>
          ) : (
            <div>
              <div className="row no-gutters" id="searchGroupResultsContainer">
                <h1>{texts.results}</h1>
              </div>
              <GroupList groupIds={matchingGroups} />
            </div>
          )}
        </React.Fragment>
      )
    );
  }
}

SearchGroupScreen.propTypes = {
  language: PropTypes.string,
  history: PropTypes.object
};

export default withLanguage(SearchGroupScreen);
