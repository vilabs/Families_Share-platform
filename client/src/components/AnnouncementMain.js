import React from 'react';
import PropTypes from 'prop-types';
import ExpandedImageModal from './ExpandedImageModal';
import { disableBodyScroll, clearAllBodyScrollLocks} from 'body-scroll-lock';



class AnnouncementMain extends React.Component {
		state = { imageModalIsOpen: false, expandedImage: "" };
    handleModalOpen = (image) => {
				const target =document.querySelector('.ReactModalPortal')
				disableBodyScroll(target)
        this.setState({ imageModalIsOpen: true, expandedImage: image})
    }
    handleModalClose = () => {
				clearAllBodyScrollLocks();
        this.setState({ imageModalIsOpen: false, expandedImage: ""})
    }
    render() {
        return (
            <div id="announcementMainContainer" className="horizontalCenter">
            {this.state.imageModalIsOpen?<ExpandedImageModal isOpen={this.state.imageModalIsOpen} handleClose={this.handleModalClose} image={this.state.expandedImage}/>:null}
                <div className="row no-gutters">
                    <h1>{this.props.message}</h1>
                </div>
                <ul>
                    {
                        this.props.images.map((image, index) =>
                            <li key={index}>
                                <img src={image.path} alt="announcement content"  onClick={()=> this.handleModalOpen(image.path)}/>
                            </li>
                        )}
                </ul>
            </div>
        );
    }
};

AnnouncementMain.propTypes = {
    message: PropTypes.string,
    images: PropTypes.array,
}

export default AnnouncementMain;