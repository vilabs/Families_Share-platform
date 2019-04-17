import React from 'react';
import Texts from '../Constants/Texts.js';
import withLanguage from './LanguageContext';
import PropTypes from 'prop-types';
import axios from 'axios';
import PhotoPreviewBubble from './PhotoPreviewBubble';
import { withSnackbar } from 'notistack';

const dataURLtoFile = (dataurl, filename) => {
	var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
		bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
	while (n--) {
		u8arr[n] = bstr.charCodeAt(n);
	}
	return new File([u8arr], filename, { type: mime });
}

class AnnouncementBar extends React.Component{
    
		state = { message: "", photos: []  };
		componentDidMount() {
			document.addEventListener('message', this.handleMessage, false)
		}
		componentWillUnmount() {
			document.removeEventListener('message', this.handleMessage, false)
		}
		handleMessage = (event) => {
			const data = JSON.parse(event.data)
			if (data.action === 'fileUpload') {
				const image = `data:image/png;base64, ${data.value}`;
				this.setState({ photos: [{ photo: dataURLtoFile(image, 'photo.png'), preview: image}]  });
			}
		}
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
    handleImageUpload = async (event) => {
			const snackMessage = Texts[this.props.language].replyBar.maxFilesError;
			if (event.target.files) {
				const photos = [...event.target.files].map( file => {return { photo: file, preview: ""}})
				if(photos.length>3){
					this.props.enqueueSnackbar(snackMessage, { 
						variant: 'error',
				});
				} else {
					const  photosWithPreview = await Promise.all( photos.map( photo => this.getPhotoPreview(photo)))
					this.setState({photos: photosWithPreview});
				}
			}
		}
		handleNativeImageChange = () => {
			window.postMessage(JSON.stringify({ action: 'fileUpload' }), '*')
		};
		handlePreviewDelete = (photo) => {
			this.setState({ photos: this.state.photos.filter(p => p.preview!== photo.preview )})
		}
    render(){
        const texts = Texts[this.props.language].replyBar;
        return(
					<React.Fragment>
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
											<i className="fas fa-camera" onClick={window.isNative?this.handleNativeImageChange:()=>{}}/>
										</label>
										{!window.isNative &&<input id="uploadPhotoInput" type="file" accept="image/*" name="photo" multiple onChange={this.handleImageUpload} />}
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

export default withSnackbar(withLanguage(AnnouncementBar));