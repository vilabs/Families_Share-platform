import React from 'react';
import Texts from '../Constants/Texts.js';
import LoadingSpinner from './LoadingSpinner';
import withLanguage from './LanguageContext';
import autosize from 'autosize';
import axios from 'axios';
import { CirclePicker } from 'react-color';



class EditActivityScreen extends React.Component {
    state = {
        fetchedActivity: false,
    };
    componentDidMount() {
        const activityId = this.props.match.params.activityId;
        const groupId = this.props.match.params.groupId;
        axios.get(`/groups/${groupId}/activities/${activityId}`)
            .then(response => {
                const { name, description, color } = response.data;
                this.setState({ fetchedActivity: true, name, color, description, validated: true })
            })
            .catch(error => {
                console.log(error)
                this.setState({ fetchedActivity: true, name: "", color: "", description: "", validated: false })
            })
    }
    handleChange = event => {
        const state = Object.assign({}, this.state);
        const name = event.target.name;
        let value = event.target.value;
        state[name] = value;
        state.validated = false;
        if (state.description && state.name) {
            state.validated = true;
        }
        this.setState(state);
    };
    handleColorChange = color => {
        const state = Object.assign({}, this.state);
        state["color"] = color.hex;
        this.setState(state);
    };
    handleSave = () => {
        const activityId = this.props.match.params.activityId;
        const groupId = this.props.match.params.groupId;
        if (this.state.validated) {
            this.setState({ fetchedActivity: false })
            const patch = {
                name: this.state.name,
                color: this.state.color,
                description: this.state.description,
            }
            axios.patch(`/groups/${groupId}/activities/${activityId}`, patch)
                .then(response => {
                    console.log(response);
                    this.props.history.goBack();
                })
                .catch(error => {
                    console.log(error);
                    this.props.history.goBack()
                })
        }
    }
    render() {
        const texts = Texts[this.props.language].editActivityScreen;
        return (
            <React.Fragment>
                {this.state.fetchedActivity ?
                    <React.Fragment>
                        <div className="row no-gutters" id="editActivityHeaderContainer">
                            <div className="col-2-10">
                                <button className="transparentButton center" onClick={() => this.props.history.goBack()}>
                                    <i className="fas fa-arrow-left" />
                                </button>
                            </div>
                            <div className="col-6-10">
                                <h1 className="verticalCenter">{texts.backNavTitle}</h1>
                            </div>
                            <div className="col-2-10">
                                <button className="transparentButton center" style={this.state.validated ? {} : { opacity: 0.5 }} onClick={this.handleSave}>
                                    <i className="fas fa-check"/>
                                </button>
                            </div>
                        </div>
                        <div id="editActivityMainContainer">
                            <div className="row no-gutters">
                                <div className="col-2-10">
                                    <i className="fas fa-clipboard-check center" />
                                </div>
                                <div className="col-8-10">
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder={texts.name}
                                        value={this.state.name}
                                        className="verticalCenter"
                                        onChange={this.handleChange}
                                    />
                                </div>
                            </div>
                            <div className="row no-gutters" >
                                <div className="col-2-10">
                                    <i className="fas fa-align-left center" />
                                </div>
                                <div className="col-8-10">
                                    <textarea
                                        rows="1"
                                        name="description"
                                        className="verticalCenter"
                                        placeholder={texts.description}
                                        value={this.state.description}
                                        onChange={event => {
                                            this.handleChange(event);
                                            autosize(document.querySelectorAll("textarea"));
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="row no-gutters">
                                <div className="col-2-10">
                                    <i
                                        className="fas fa-palette center"
                                        style={{ color: this.state.color }}
                                        alt="palette icon"
                                    />
                                </div>
                                <div className="col-8-10">
                                    <h1 className="verticalCenter" style={{ color: this.state.color }}>
                                        {texts.color}
                                    </h1>
                                </div>
                            </div>
                            <div className="row no-gutters" style={{ marginBottom: "2rem" }}>
                                <div className="col-2-10" />
                                <div className="col-8-10">
                                    <CirclePicker
                                        width={"100%"}
                                        color={this.state.color}
                                        onChange={this.handleColorChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </React.Fragment >
                    : <LoadingSpinner />}
            </React.Fragment >
        )
    }
}




export default withLanguage(EditActivityScreen);