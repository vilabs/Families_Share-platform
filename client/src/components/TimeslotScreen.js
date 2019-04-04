import React from 'react';
import Texts from '../Constants/Texts.js';
import withLanguage from './LanguageContext';
import axios from 'axios';
import moment from 'moment';
import ConfirmDialog from './ConfirmDialog';
import LoadingSpinner from './LoadingSpinner';


class TimeslotScreen extends React.Component {
	async componentDidMount(){

	}
	render(){
		return(
			<div></div>
		);
	}
}


	export default withLanguage(TimeslotScreen)