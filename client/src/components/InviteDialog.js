import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import List from "@material-ui/core/List";
import Avatar from "@material-ui/core/Avatar";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import Button from "@material-ui/core/Button";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";

import AutoComplete from "./AutoComplete";
import Texts from "../Constants/Texts.js";
import withLanguage from "./LanguageContext";

const theme = createMuiTheme({
  typography: {
    useNextVariants: true
  },
  overrides: {
    MuiListItemText: {
      primary: {
        fontSize: "1.4rem"
      }
    },
    MuiButton: {
      root: {
        fontSize: "1.4rem",
        color: "#009688"
      }
    },
    MuiDialog: {
      paperWidthSm: {
        width: "80vw",
        maxWidth: 400
      },
      paper: {
        height: "90vh"
      },
      paperScrollPaper: {
        maxHeight: 800
      }
    }
  }
});

class InviteDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inviteType: this.props.inviteType,
      searchInput: "",
      history: [],
      searchedForInput: false,
      matchingUsers: [],
      users: [],
      inviteIds: [],
      fetchedUsers: false
    };
  }

  componentDidMount() {
    const userId = JSON.parse(localStorage.getItem("user")).id;
    axios
      .get("/profiles?searchBy=visibility&visible=true")
      .then(res => {
        const users = res.data.filter(user => user.user_id !== userId);
        users.forEach(user => {
          user.name = `${user.given_name} ${user.family_name}`;
        });
        this.setState({ fetchedGroups: true, users });
        this.handleSearch("");
      })
      .catch(error => {
        console.log(error);
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
    const { users } = this.state;
    const matchingUsers = [];
    users.forEach(user => {
      if (user.name.toLowerCase().includes(value)) {
        matchingUsers.push(user);
      }
    });
    this.setState({
      searchedForInput: true,
      searchInput: value,
      matchingUsers
    });
  };

  onInputChange = event => {
    this.setState({ searchInput: event.target.value, searchedForInput: false });
    if (event.target.value === "") this.handleSearch("");
  };

  handleInvite = () => {
    const { inviteIds } = this.state;
    if (this.state.inviteIds.length > 0) {
      if (this.state.inviteType === "member") {
        this.props.handleInvite(inviteIds);
      } else {
        this.props.handleInvite(
          this.state.users.filter(user => user.user_id === inviteIds[0])[0]
        );
      }
    } else {
      this.props.handleClose();
    }
    this.setState({
      inviteIds: [],
      searchInput: "",
      searchedForInput: false,
      matchingUsers: []
    });
  };

  handleSelect = id => {
    const { inviteIds } = this.state;
    const indexOf = inviteIds.indexOf(id);
    if (this.state.inviteType === "member") {
      if (indexOf === -1) {
        inviteIds.push(id);
      } else {
        inviteIds.splice(indexOf, 1);
      }
    } else if (indexOf === -1) {
      inviteIds.push(id);
    } else {
      inviteIds.pop();
    }
    this.setState({ inviteIds });
  };

  handleClose = () => {
    this.props.handleClose();
  };

  render() {
    const texts =
      this.state.inviteType === "member"
        ? Texts[this.props.language].inviteModal
        : Texts[this.props.language].addParentModal;
    return (
      <MuiThemeProvider theme={theme}>
        <Dialog
          onClose={this.handleClose}
          aria-labelledby="invite user dialog"
          open={this.props.isOpen}
        >
          <DialogTitle>
            <div className="inviteDialogTitle">{texts.header}</div>
            <input
              className="inviteDialogInput"
              type="search"
              value={this.state.searchInput}
              placeholder={texts.search}
              onChange={this.onInputChange}
              onKeyPress={this.handleKeyPress}
              id="searchUserInput"
            />
          </DialogTitle>
          <DialogContent>
            {!this.state.searchedForInput ? (
              <AutoComplete
                searchInput={this.state.searchInput}
                entities={this.state.users}
                handleSearch={this.handleSearch}
              />
            ) : (
              <List>
                {this.state.matchingUsers.map(user => {
                  const selected = this.state.inviteIds.includes(user.user_id);
                  return (
                    <ListItem
                      button
                      onClick={() => this.handleSelect(user.user_id)}
                      key={user.user_id}
                      selected={selected}
                    >
                      <ListItemAvatar>
                        <Avatar src={user.image.path} sizes="small" />
                      </ListItemAvatar>
                      <ListItemText
                        primary={`${user.given_name} ${user.family_name}`}
                      />
                      <ListItemIcon>
                        <i
                          className="fas fa-circle inviteSelect"
                          style={selected ? {} : { display: "none" }}
                        />
                      </ListItemIcon>
                    </ListItem>
                  );
                })}
              </List>
            )}
          </DialogContent>
          <DialogActions>
            <Button fontSize={20} variant="text" onClick={this.handleClose}>
              {texts.cancel}
            </Button>
            <Button onClick={this.handleInvite}>{texts.invite}</Button>
          </DialogActions>
        </Dialog>
      </MuiThemeProvider>
    );
  }
}

InviteDialog.propTypes = {
  isOpen: PropTypes.bool,
  handleClose: PropTypes.func,
  handleInvite: PropTypes.func,
  inviteType: PropTypes.string
};

export default withLanguage(InviteDialog);
