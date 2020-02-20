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
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import Button from "@material-ui/core/Button";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import Texts from "../Constants/Texts";
import Log from "./Log";
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
      paperScrollPaper: {
        maxHeight: 800
      }
    }
  }
});

class ParticipantsDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: []
    };
  }

  componentDidMount() {
    const { participants: ids } = this.props;
    axios
      .get("/api/profiles", {
        params: {
          ids,
          searchBy: "ids"
        }
      })
      .then(res => {
        const users = res.data;
        this.setState({ users });
        this.handleSearch("");
      })
      .catch(error => {
        Log.error(error);
      });
  }

  handleClose = () => {
    const { handleClose } = this.props;
    handleClose();
  };

  render() {
    const { isOpen, language } = this.props;
    const { users } = this.state;
    console.log(isOpen);
    const texts = Texts[language].participantsModal;
    return (
      <MuiThemeProvider theme={theme}>
        <Dialog
          onClose={this.handleClose}
          aria-labelledby="invite user dialog"
          open={isOpen}
        >
          <DialogTitle>
            <div className="inviteDialogTitle">{texts.header}</div>
          </DialogTitle>
          <DialogContent>
            <List>
              {users.map(user => (
                <ListItem key={user.user_id}>
                  <ListItemAvatar>
                    <Avatar src={path(user, ["image", "path"])} sizes="small" />
                  </ListItemAvatar>
                  <ListItemText
                    primary={`${user.given_name} ${user.family_name}`}
                  />
                </ListItem>
              ))}
            </List>
          </DialogContent>
          <DialogActions>
            <Button fontSize={20} variant="text" onClick={this.handleClose}>
              {texts.cancel}
            </Button>
          </DialogActions>
        </Dialog>
      </MuiThemeProvider>
    );
  }
}

ParticipantsDialog.propTypes = {
  isOpen: PropTypes.bool,
  handleClose: PropTypes.func,
  participants: PropTypes.arrayOf(PropTypes.object),
  language: PropTypes.string
};

export default withLanguage(ParticipantsDialog);
