import React from "react";
import PropTypes from "prop-types";


const PhotoPreviewBubble = (props) => {
	return (	
			<ul id="photoPreviewContainer" style={props.photos.length>0?{display:"flex", width: props.photos.length*65}:{display:"none",width: props.photos.length*65}}>
				{props.photos.map( (photo,index) => 
					<li key={index}>
						<i className="fas fa-times previewDelete" onClick={()=>props.handleDelete(photo)} />
						<img className="photoPreview" src={photo.preview} alt="annnoucement upload preview" />
					</li>	
				)}
			</ul>
	);
}
PhotoPreviewBubble.propTypes = {
	handleClose: PropTypes.func,
	photos: PropTypes.array,
	handleDelete: PropTypes.func,
};

export default PhotoPreviewBubble;
