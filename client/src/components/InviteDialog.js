import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import Dialog from "@material-ui/core/Dialog";
import * as path from "lodash.get";
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
import Log from "./Log";
import AutoComplete from "./AutoComplete";
import Texts from "../Constants/Texts";
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
    const { inviteType } = this.props;
    this.state = {
      inviteType,
      searchInput: "",
      searchedForInput: false,
      matchingUsers: [],
      users: [],
      inviteIds: []
    };
  }

  componentDidMount() {
    const userId = JSON.parse(localStorage.getItem("user")).id;
    axios
      .get("/api/profiles?searchBy=visibility&visible=true")
      .then(res => {
        const users = res.data.filter(user => user.user_id !== userId);
        users.forEach(user => {
          user.name = `${user.given_name} ${user.family_name}`;
        });
        this.setState({ users });
        this.handleSearch("");
      })
      .catch(error => {
        Log.error(error);
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
    const { inviteIds, inviteType, users, handleClose } = this.state;
    const { handleInvite } = this.props;
    if (inviteIds.length > 0) {
      if (inviteType === "member") {
        handleInvite(inviteIds);
      } else {
        handleInvite(users.filter(user => user.user_id === inviteIds[0])[0]);
      }
    } else {
      handleClose();
    }
    this.setState({
      inviteIds: [],
      searchInput: "",
      searchedForInput: false,
      matchingUsers: []
    });
  };

  handleSelect = id => {
    const { inviteIds, inviteType } = this.state;
    const indexOf = inviteIds.indexOf(id);
    if (inviteType === "member") {
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
    const { handleClose } = this.props;
    handleClose();
  };

  render() {
    const {
      inviteType,
      searchInput,
      searchedForInput,
      users,
      matchingUsers,
      inviteIds
    } = this.state;
    const { language, isOpen } = this.props;
    const texts = Texts[language].inviteModal;
    let addText;
    let header;
    switch (inviteType) {
      case "member":
        header = texts.memberHeader;
        addText = texts.invite;
        break;
      case "parent":
        header = texts.parentHeader;
        addText = texts.add;
        break;
      case "framily":
        header = texts.framilyHeader;
        addText = texts.add;
        break;
      default:
    }
    return (
      <MuiThemeProvider theme={theme}>
        <Dialog
          onClose={this.handleClose}
          aria-labelledby="invite user dialog"
          open={isOpen}
        >
          <DialogTitle>
            <div className="inviteDialogTitle">{header}</div>
            <input
              className="inviteDialogInput"
              type="search"
              value={searchInput}
              placeholder={texts.search}
              onChange={this.onInputChange}
              onKeyPress={this.handleKeyPress}
              id="searchUserInput"
            />
          </DialogTitle>
          <DialogContent>
            {!searchedForInput ? (
              <AutoComplete
                searchInput={searchInput}
                entities={users}
                handleSearch={this.handleSearch}
              />
            ) : (
              <List>
                {matchingUsers.map(user => {
                  const selected = inviteIds.includes(user.user_id);
                  return (
                    <ListItem
                      button
                      onClick={() => this.handleSelect(user.user_id)}
                      key={user.user_id}
                      selected={selected}
                    >
                      <ListItemAvatar>
                        <Avatar
                          src={path(user, ["image", "path"])}
                          sizes="small"
                        />
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
            <Button onClick={this.handleInvite}>{addText}</Button>
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
  inviteType: PropTypes.string,
  language: PropTypes.string
};

export default withLanguage(InviteDialog);
