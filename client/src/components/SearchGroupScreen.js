import React from "react";
import axios from "axios";
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
      .get("/groups?searchBy=visibility&visible=true")
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
    if (e.key === "Enter") {
      this.handleSearch(this.state.searchInput);
    }
  };

  handleSearch = value => {
    value = value.toLowerCase().trim();
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
    await this.setState({ searchBarIsVisible: !this.state.searchBarIsVisible });
    document.getElementById("searchGroupInput").focus();
  };

  render() {
    const texts = Texts[this.props.language].searchGroupModal;
    return this.state.fetchedGroups ? (
      <React.Fragment>
        <div className="row no-gutters" id="searchGroupBarContainer">
          <div className="col-2-10">
            <button
              type="button"
              className="transparentButton center"
              onClick={() => this.props.history.replace("/myfamiliesshare")}
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
              value={this.state.searchInput}
              placeholder={texts.example}
              onChange={this.onInputChange}
              onKeyPress={this.handleKeyPress}
              style={this.state.searchBarIsVisible ? {} : { display: "none" }}
            />
            <h1
              style={this.state.searchBarIsVisible ? { display: "none" } : {}}
            >
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
        {!this.state.searchedForInput ? (
          <div id="searchGroupSuggestionsContainer">
            <AutoComplete
              searchInput={this.state.searchInput}
              entities={this.state.groups}
              handleSearch={this.handleSearch}
            />
          </div>
        ) : (
          <div>
            <div className="row no-gutters" id="searchGroupResultsContainer">
              <h1>{texts.results}</h1>
            </div>
            <GroupList groupIds={this.state.matchingGroups} />
          </div>
        )}
      </React.Fragment>
    ) : (
      <div />
    );
  }
}

export default withLanguage(SearchGroupScreen);
