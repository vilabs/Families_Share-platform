import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Texts from '../Constants/Texts.js';
import withLanguage from './LanguageContext';
import { withStyles } from '@material-ui/core/styles';
import { createMuiTheme } from "@material-ui/core/styles";
import { MuiThemeProvider } from "@material-ui/core/styles";
import PropTypes from 'prop-types';


const styles = theme => ({
    button: {
        fontSize: "1.5rem",
        color: "#00838F",
		},
		dialogTitle: {
			fontSize: 20,
			fontWeight: 700
		}
});

const theme = createMuiTheme({
    typography: {
        useNextVariants: true
    }
});

class ConfirmDialog extends React.Component {
    
    handleClose = (choice) => {
        this.props.handleClose(choice)
    };
    render() {
        const { classes } = this.props
        const texts = Texts[this.props.language].confirmDialog;
        return (
            <MuiThemeProvider theme={theme}>
                <Dialog
                    open={this.props.isOpen}
                    onClose={()=>this.handleClose("disagree")}
                    aria-labelledby="alert-dialog-title"
										aria-describedby="alert-dialog-description"
										disableBackdropClick={true}
										fullWidth={true}
						>
							<DialogTitle className={classes.dialogTitle} id="alert-dialog-title">
								<div className="inviteDialogTitle">
									{this.props.title}
								</div>
							</DialogTitle>
							<DialogActions>
								<Button className={classes.button} onClick={()=>this.handleClose("disagree")} color="primary">
                            {texts.disagree}
                        </Button>
                        <Button className={classes.button} onClick={()=>this.handleClose("agree")} color="primary" autoFocus>
                            {texts.agree}
                        </Button>
                    </DialogActions>
                </Dialog>
            </MuiThemeProvider>
        );
    }
}

export default withLanguage(withStyles(styles)(ConfirmDialog));

ConfirmDialog.propTypes = {
    title: PropTypes.string,
    isOpen: PropTypes.bool,
    handleClose: PropTypes.func,
};