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

const TimeslotSubscribe = ({subscribed, name, image, handleConfirmDialog, id, classes, type}) =>{
	const handleClick = () => {
		if(subscribed){
			handleConfirmDialog(id,type,'unsubscribe');
		} else {
			handleConfirmDialog(id,type,'subscribe');
		}
	}
		return (
			<div onClick={handleClick} className="subscribeBubble" style={subscribed ? { backgroundColor: "#00838F", color: '#FFFFFF' } : {}}>
					<Avatar src={image} alt="users thumbnail" className={classes.avatar}/>
					<div className="subscribeText">{name}</div>
					<i className={subscribed?"fas fa-times subscribeIcon":"fas fa-plus subscribeIcon"}/>
	</div>
		);
};


export default withStyles(styles)(TimeslotSubscribe);

TimeslotSubscribe.propTypes = {
	image: PropTypes.string,
	name: PropTypes.string,
	subscribed: PropTypes.bool,
	id: PropTypes.string,
	handleConfirmDialog: PropTypes.func,
	type: PropTypes.string,
}