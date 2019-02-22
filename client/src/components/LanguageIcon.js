import React from 'react';
import Images from '../Constants/Images.js';
import PropTypes from 'prop-types';

const LanguageIcon = ({language, style}) => {
    const images = Images.languages;
    return(
        <div id="languageIconContainer">
            <img src={images[language]} alt="flag icon"  style={style}/>
        </div>
    )
}

LanguageIcon.propTypes= {
    language: PropTypes.string,
    style: PropTypes.object,
}

export default LanguageIcon;