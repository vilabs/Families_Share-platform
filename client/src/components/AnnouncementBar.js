import React from 'react';
import Texts from '../Constants/Texts.js';
import withLanguage from './LanguageContext';
import PropTypes from 'prop-types';
import axios from 'axios';
import PhotoPreviewBubble from './PhotoPreviewBubble';
import Alert from './AlertModal';




class AnnouncementBar extends React.Component{
    
    state = { message: "", photos: [], alertIsOpen: false };
    handleEnter = (event) => {
        if(event.keyCode===13) this.handleSend()
    }
    handleSend = () => {
        if (this.state.message || this.state.photos.length > 0) {
            const user_id = JSON.parse(localStorage.getItem("user")).id;
            const photos = this.state.photos;
            var bodyFormData = new FormData();
            if (photos.length > 0) {
                for (let i = 0; i < photos.length; i++) {
                    bodyFormData.append('photo', photos[i].photo);
                }
            }
            bodyFormData.append('message', this.state.message);
            bodyFormData.append('user_id', user_id);
            axios.post("/groups/" + this.props.groupId + "/announcements", bodyFormData)
                .then(response => {
                    console.log(response);
                    this.props.handleRefresh();
                })
                .catch(error => {
                    console.log(error);
                })
            this.setState({ message: "", photos: [], photoPreviews: [] })
        }
    }
    handleMessageChange = (event) => {
        this.setState({message: event.target.value});
		} 
		getPhotoPreview = (photo) => {
			return new Promise( (resolve,reject) => {
				let reader = new FileReader();
				reader.onload = e => {
					photo.preview = e.target.result
					resolve(photo)
				};
				reader.readAsDataURL(photo.photo);	
			});	
		}
    handlePhotoUpload = async (event) => {
			if (event.target.files) {
				const photos = [...event.target.files].map( file => {return { photo: file, preview: ""}})
				if(photos.length>3){
					this.setState({alertIsOpen: true});
				} else {
					const  photosWithPreview = await Promise.all( photos.map( photo => this.getPhotoPreview(photo)))
					this.setState({photos: photosWithPreview});
				}
			}
		}
		handlePreviewDelete = (photo) => {
			this.setState({ photos: this.state.photos.filter(p => p.preview!== photo.preview )})
		}
		handleAlertClose = () => {
			this.setState({alertIsOpen: false})
		}
    render(){
        const texts = Texts[this.props.language].replyBar;
        return(
					<React.Fragment>
						<Alert 
							type="error" 
							isOpen={this.state.alertIsOpen} 
							handleClose={this.handleAlertClose} 
							message="You can upload a maximum of 3 files" 
						/>
						<PhotoPreviewBubble photos={this.state.photos} handleDelete={this.handlePreviewDelete}/>
						<div id="announcementBarContainer" className="row no-gutters">
							<div id="announcementBubble" className="center">
								<div className="row no-gutters verticalCenter">
									<div className="col-7-10" >
										<input type="text" className="center" value={this.state.message}
											placeholder={texts.new} onChange={this.handleMessageChange} onKeyUp={this.handleEnter} />
									</div>
									<div className="col-3-10" id="announcementBubbleButtons">
										<label className="verticalCenter" htmlFor="uploadPhotoInput">
											<i className="fas fa-camera" />
										</label>
										<input id="uploadPhotoInput" type="file" accept="image/*" name="photo" multiple onChange={this.handlePhotoUpload} />
										<i className="fas fa-paper-plane verticalCenter" onClick={this.handleSend} />
									</div>
								</div>
							</div>
            </div>
					</React.Fragment>
        );
    }
}

AnnouncementBar.propTypes = {
    handleRefresh: PropTypes.func,
    groupId: PropTypes.string,
};

export default withLanguage(AnnouncementBar);