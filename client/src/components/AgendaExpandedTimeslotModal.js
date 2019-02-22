import Modal from 'react-modal';
import React from 'react';
import PropTypes from 'prop-types';
import AgendaExpandedTimeslot from './AgendaExpandedTimeslot';

Modal.setAppElement('#root');

class AgendaExpandedTimeslotModal extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            timeslot: this.props.timeslot,
            expanded: this.props.expanded
        }
    }
    closeModal = () => {
        this.props.handleClose();
    }
    afterOpenModal = () => {

    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.expanded !== prevState.expanded) {
            return { 
                expanded: nextProps.expanded,
                timeslot: nextProps.timeslot,
            };
        }
        else return null;
    }
    render() {
        const modalStyle = {
            overlay: {
                zIndex: 1500,
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.8)'
            },
            content: {
                position: 'fixed',
                top: "50%",
                left: "50%",
                transform: "translate(-50%,-50%)",
                backgroundColor: "#ffffff",
								maxWidth: "40rem",
								maxHeight: "65rem",
								width: "90%",
								height: "90%",
            }
        };
        return (
            <Modal
                style={modalStyle}
                isOpen={this.props.expanded}
                onAfterOpen={this.afterOpenModal}
                onRequestClose={this.closeModal}
                contentLabel="Expanded Timeslot Modal"
            > {this.props.expanded?
                <AgendaExpandedTimeslot timeslot={this.state.timeslot}
                    handleClose={this.closeModal} handleSignup={this.handleSignup} signUpOptions={this.state.signUpOptions}
                />
                :<div/>}
            </Modal>
        );
    }
}

export default AgendaExpandedTimeslotModal;

AgendaExpandedTimeslotModal.propTypes = {
    handleClose: PropTypes.func,
    timeslot: PropTypes.object,
    expanded: PropTypes.bool,
};