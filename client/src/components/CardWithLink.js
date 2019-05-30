import React from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import MCard from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import withLanguage from "./LanguageContext";
import Texts from "../Constants/Texts";

const styles = {
  card: {
    width: "94%",
    maxWidth: "45rem",
    borderRadius: "0.5rem",
    backgroundColor: "#fbfbfb",
    border: "1px solid #e0e0e0",
    left: "50%",
    transform: "translateX(-50%)",
    position: "relative"
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)"
  },
  header: {
    fontSize: "2.4rem",
    color: "#010101"
  },
  info: {
    fontSize: "1.4rem",
    color: "rgba(1, 1, 1, 0.87)"
  },
  infoWithButton: {
    fontSize: "1.4rem",
    color: "rgba(1, 1, 1, 0.87)",
    borderBottom: "1px solid #e0e0e0",
    paddingBottom: "2rem"
  },
  button: {
    fontSize: "1.4rem",
    fontWeight: 500,
    color: "#4671b6"
  }
};

const Card = ({ history, card, classes, language }) => {
  const handleClick = () => {
    history.push(card.link);
  };

  const texts = Texts[language].cardWithLink;
  return (
    <MCard className={classes.card}>
      <CardContent>
        <Typography
          className={classes.header}
          color="textSecondary"
          gutterBottom
        >
          {card.cardHeader}
        </Typography>
        <Typography
          className={card.learnMore ? classes.infoWithButton : classes.info}
        >
          {card.cardInfo}
        </Typography>
      </CardContent>
      {card.learnMore && (
        <CardActions>
          <Button size="small" className={classes.button} onClick={handleClick}>
            {texts.learnMore}
          </Button>
        </CardActions>
      )}
    </MCard>
  );
};

Card.propTypes = {
  card: PropTypes.object,
  history: PropTypes.object,
  language: PropTypes.string,
  classes: PropTypes.object
};

export default withRouter(withLanguage(withStyles(styles)(Card)));
