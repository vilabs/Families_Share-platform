import React from 'react';
import PropTypes from 'prop-types';
import withLanguage from './LanguageContext';
import AddParentModal from './AddParentModal';
import Images from '../Constants/Images.js';
import moment from 'moment'
import Texts from '../Constants/Texts.js';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import ConfirmDialog from './ConfirmDialog';



class ChildProfileInfo extends React.Component {
		state = {modalIsOpen: false, confirmDialogIsOpen: false, deleteIndex: "" };
		
		handleConfirmDialogOpen = (index) => {
			this.setState({ confirmDialogIsOpen: true, deleteIndex: index });
		};
		handleConfirmDialogClose = choice => {
			if (choice === "agree") {
				this.deleteParent(this.state.deleteIndex);
			}
			this.setState({ confirmDialogIsOpen: false, deleteIndex: "" });
		};
    addParent = (event) => {
        this.setState({modalIsOpen: true});
    }
    handleClose = () => {
        this.setState({modalIsOpen: false});
		}
		deleteParent = (index) => {
			const profileId = this.props.match.params.profileId;
			const childId = this.props.match.params.childId;
			axios.delete(`/users/${profileId}/children/${childId}/parents/${this.props.parents[index].user_id}`)
        .then( response => {
					this.props.handleDeleteParent(index);
        })
        .catch( error => {
            console.log(error);
        })
		}
    handleAdd = (parent) => {
        const profileId = this.props.match.params.profileId;
				const childId = this.props.match.params.childId;
        axios.post(`/users/${profileId}/children/${childId}/parents`, { parentId: parent.user_id })
        .then( response => {
            this.props.handleAddParent(parent)
        })
        .catch( error => {
            console.log(error);
        })
        this.setState({modalIsOpen: false})
    }
    render() {
				console.log(this.props.parents)
        const isParent =  JSON.parse(localStorage.getItem("user")).id === this.props.match.params.profileId;
        const texts = Texts[this.props.language].childProfileInfo;
        const { specialNeeds, otherInfo, allergies, gender, birthdate, parents} = this.props;
        return(
            <React.Fragment>
								<ConfirmDialog isOpen={this.state.confirmDialogIsOpen}
								  title={texts.confirmDialogTitle} 
								  handleClose={this.handleConfirmDialogClose}
								/>
                <AddParentModal isOpen={this.state.modalIsOpen} handleClose={this.handleClose} handleInvite={this.handleAdd}/>
                <div className="row no-gutters childProfileInfoSection">
                    <div className="col-2-10">
                        <i className="fas fa-birthday-cake center"/>
                    </div>
                    <div className="col-8-10">
                        <div className="verticalCenter">
                            <h1>{moment(birthdate).format("MMMM Do YYYY")}</h1>
                            <h2>{`${moment().diff(birthdate,'years')} ${texts.age}`}</h2>
                        </div>
                    </div>
                </div>
                <div className="row no-gutters childProfileInfoSection">
                    <div className="col-2-10">
                        <img src={Images.gender} className="center" alt="birthday icon" />
                    </div>
                    <div className="col-8-10">
                        <h1 className="verticalCenter">{texts[gender]}</h1>
                    </div>
                </div>
                <div className="row no-gutters childProfileInfoSection">
                    <div className="col-2-10">
                        <img src={Images.couple} className="center" alt="birthday icon" />
                    </div>
                    <div className="col-3-10">
                        {parents[0]?
                            <div className="verticalCenter">
                                <h1>{parents[0].given_name+" "+parents[0].family_name}</h1>
                            </div>
                            :
                            isParent?
                                <button className="center addParent" onClick={this.addParent}>
                                    {texts.addParent}
                                </button>
                            :<div/>
                        }
                    </div>
										<div className="col-1-10">
												{parents[0] && isParent && parents.length>1?
												<button className="verticalCenter deleteParent" onClick={()=>this.handleConfirmDialogOpen(0)}>
													<i className="fas fa-times"/>
												</button>
												:null}
										</div>
                    <div className="col-3-10">
                        {parents[1]?
                            <div className="verticalCenter">
                                <h1>{parents[1].given_name+" "+parents[1].family_name}</h1>
                            </div>
                            :
                            isParent?
                                <button className="center addParent" onClick={this.addParent}>
                                    {texts.addParent}
                                </button>
                            :<div/>
                        }
                    </div>
										<div className="col-1-10">
												{parents[1] && isParent && parents.length>1?
													<button className="verticalCenter deleteParent" onClick={()=>this.handleConfirmDialogOpen(1)}>
													<i className="fas fa-times"/>
												</button>
												:null}
										</div>
                </div>
                {this.props.showAdditional?
                <div className="childAdditionalInfoSection">   
                    <h3>{texts.additional}</h3>
                    {allergies?
                        <div className="row no-gutters"> 
                            <div className="col-3-10">
                                <h4 className="verticalCenter">{texts.allergies+":"}</h4>
                            </div>
                            
                            <div className="col-7-10">
                                <p className="verticalCenter">{allergies}</p>
                            </div>
                        </div>
                    :<div/>}  
                    {specialNeeds?        
                        <div className="row no-gutters"> 
                            <div className="col-3-10">
                                <h4 className="verticalCenter">{texts.specialNeeds+":"}</h4>
                            </div>
                            <div className="col-7-10">
                                <p className="verticalCenter">{specialNeeds}</p>
                            </div>
                        </div>
                    :<div/>}
                    {otherInfo?
                        <div className="row no-gutters">  
                            <div className="col-3-10">
                                <h4 className="verticalCenter">{texts.otherInfo+":"}</h4>
                            </div>
                            <div className="col-7-10">
                                <p className="verticalCenter">{otherInfo}</p>
                            </div>
                        </div>
                    :<div/>}
                </div>
                :<div/>}
            </React.Fragment>
        );
    }
}

ChildProfileInfo.propTypes={
    parents: PropTypes.array,
    bithdate: PropTypes.string,
    gender: PropTypes.string,
    specialNeeds: PropTypes.string,
    otherInfo: PropTypes.string,
    allergies: PropTypes.string,
    showAdditional: PropTypes.bool,
};

export default withRouter(withLanguage(ChildProfileInfo));