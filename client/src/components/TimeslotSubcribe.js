import React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import { withStyles } from '@material-ui/core/styles';


const styles = theme => ({
	avatar: {
		width:'3rem',
		height: '3rem'
	}
});

const TimeslotSubscribe = ({subscribed, name, image, handleSubscribe, handleUnsubscribe, id, classes, type}) =>{
	const handleClick = () => {
		if(subscribed){
			handleUnsubscribe(id,type);
		} else {
			handleSubscribe(id,type);
		}
	}
		return (
			<div onClick={handleClick} className="subscribeBubble" style={subscribed ? { backgroundColor: "#00838F", color: '#ffffff' } : {}}>
					<Avatar src={image} alt="users thumbnail" className={classes.avatar}/>
					<div className="subscribeText">{name}</div>
					<i 
						className={subscribed?"fas fa-times subscribeIcon":"fas fa-plus subscribeIcon"}
						style={subscribed ? {color: '#ffffff' } : {color: '#808080'}}
					/>
	</div>
		);
};


export default withStyles(styles)(TimeslotSubscribe);

TimeslotSubscribe.propTypes = {
	image: PropTypes.string,
	name: PropTypes.string,
	subscribed: PropTypes.bool,
	id: PropTypes.string,
	handleSubscribe: PropTypes.func,
	handleUnsubscribe: PropTypes.func,
	type: PropTypes.string,
}