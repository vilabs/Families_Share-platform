import React from 'react';
import PropTypes from 'prop-types';
import withLanguage from './LanguageContext';
import moment from 'moment';
import Texts from '../Constants/Texts.js';
import Images from '../Constants/Images.js';
import axios from 'axios';



const getParents = (ids) => {
    return axios.get("/profiles", {
        params: {
            ids,
            searchBy: "ids"
        }
    })
    .then(response => {
        const parents = []
        response.data.forEach( parent=> 
            parents.push({
                id: parent.user_id,
                image: parent.image.path,
                name: `${parent.given_name} ${parent.family_name}`
            })
        );
        return parents;
    })
    .catch(error => {
        console.log(error)
        return [];
    })
}

const getChildren = (ids) => {
    return axios.get("/children", {
        params: {
            ids,
        }
    })
    .then(response => {
        const children = []
        response.data.forEach( child=> 
            children.push({
                id: child.child_id,
                image: child.image.path,
                name: `${child.given_name} ${child.family_name}`
            })
        );
        return children;
    })
    .catch(error => {
        console.log(error)
        return [];
    })
}

class AgendaExpandedTimeslot extends React.Component {
    state = {
        timeslot: this.props.timeslot,
        expandedParents: false,
        expandedChildren: false,
        parents: [],
        children: [],
    };
    async componentDidMount (){
        const extendedProperties = this.state.timeslot.extendedProperties.shared;
        const parentIds = JSON.parse(extendedProperties.parents);
        const childIds = JSON.parse(extendedProperties.children);
        const parents = await getParents(parentIds);
        const children = await getChildren(childIds);
        this.setState({ parents : parents, children: children }) ;
    }
    handleClose = () => {
        this.props.handleClose();
    }
    renderChildren = () => {
        return(
                this.state.children.map( (child,index) =>
                    <li key={index} style={{width:"100%"}}>
                        <div className="row no-gutters">
                            <div className="col-3-10"/>
                            <div className="col-2-10">
                                <img style={{borderRadius:"50%"}} className="center" alt="child thumbnail" src={child.image} />
                            </div>
                            <div className="col-5-10">
                                <h4>{child.name}</h4>
                            </div>
                        </div>
                    </li>
                )
        )
    }
    renderParents = () => {
        return(
            this.state.parents.map( (parent,index) =>
                <li key={index} style={{width:"100%"}}>
                    <div className="row no-gutters">
                        <div className="col-3-10"/>
                        <div className="col-2-10">
                            <img style={{borderRadius:"50%"}} className="center" alt="child thumbnail" src={parent.image} />
                        </div>
                        <div className="col-5-10">
                            <h4>{parent.name}</h4>
                        </div>
                    </div>
                </li>
            )
    )
    }
    render() {
        const timeslot = this.state.timeslot;
        const rowStyle = { height: "7rem" };
        const texts = Texts[this.props.language].expandedTimeslot;
        const date = moment(timeslot.start.dateTime).format('D MMMM');
        const startTime = moment(timeslot.start.dateTime).format('hh:mm a');
        const endTime = moment(timeslot.end.dateTime).format('hh:mm a');
        const extendedProperties = timeslot.extendedProperties.shared;
        const parents = JSON.parse(extendedProperties.parents);
        const children = JSON.parse(extendedProperties.children); 
        return (
            <div>
                <div className="row no-gutters" id="expandedTimeslotHeaderContainer">
                    <div className="col-1-10">
                        <button className="transparentButton center" onClick={this.handleClose}>
                            <i className="fas fa-times" />
                        </button>
                    </div>
                </div>
                <div id="expandedTimeslotMainContainer">
                    <div className="row no-gutters">
                        <h1>{date}</h1>
                    </div>
                    <div className="row no-gutters">
                        <h2>{`${startTime} - ${endTime}`}</h2>
                    </div>
                    <div className="row no-gutters" style={rowStyle}>
                        <div className="col-2-10">
                            <img style={{opacity: "0.54"}} src={Images.couple} className="center" alt="couple icon" />
                        </div>
                        <div className="col-7-10">
                            <h4 className="center">
                                {parents.length+(parents.length===1?texts.parent:texts.parents)}
                            </h4>
                        </div>
                        <div className="col-1-10">
                            <button className="transparentButton center" onClick={()=>this.setState({expandedParents: !this.state.expandedParents})}>
                                <i className={this.state.expandedParents?"fas fa-chevron-up":"fas fa-chevron-down"}/>
                            </button>
                        </div>
                    </div>
                    <ul className="row no-gutters" style={this.state.expandedParents?{}:{display:"none"}}>
                        {this.renderParents()}
                    </ul>
                    <div className="row no-gutters" style={rowStyle}>
                        <div className="col-2-10">
                            <img style={{opacity: "0.54"}} src={Images.babyFace} className="center" alt="couple icon" />
                        </div>
                        <div className="col-7-10">
                            <h4 className="center">
                                {children.length+(children.length===1?texts.child:texts.children)
                            }</h4>
                        </div>
                        <div className="col-1-10">
                            <button className="transparentButton center" onClick={()=>this.setState({expandedChildren: !this.state.expandedChildren})}>
                                <i className={this.state.expandedChildren?"fas fa-chevron-up":"fas fa-chevron-down"}/>
                            </button>
                        </div>
                    </div>
                    <ul className="row no-gutters" style={this.state.expandedChildren?{}:{display:"none"}}>
                        {this.renderChildren()}
                    </ul>
                    <div className="row no-gutters" style={rowStyle}>
                        <div className="col-2-10">
                            <i className="center fas fa-map-marker-alt" />
                        </div>
                        <div className="col-8-10">
                            <h4 className="center">{timeslot.location}</h4>
                        </div>
                    </div>
                    <div className="row no-gutters" style={rowStyle}>
                        <div className="col-2-10">
                            <i className="center fas fa-align-left" />
                        </div>
                        <div className="col-8-10">
                            <h4 className="center">{timeslot.description}</h4>
                        </div>
                    </div>
                    <div className="row no-gutters" style={rowStyle}>
                        <div className="col-2-10">
                            <i className="center fas fa-euro-sign" />
                        </div>
                        <div className="col-8-10">
                            <h4 className="center">{extendedProperties.cost}</h4>
                        </div>
                    </div>
                    <div className="row no-gutters" style={rowStyle}>
                        <div className="col-2-10">
                            <i className="center fas fa-clipboard-check" />
                        </div>
                        <div className="col-8-10">
                            <h4 className="center">{timeslot.summary}</h4>
                        </div>
                    </div>
                    <div className="row no-gutters" style={rowStyle}>
                        <div className="col-2-10">
                            <i className="center fas fa-thumbtack" />
                        </div>
                        <div className="col-8-10">
                            <h4 className="center">{extendedProperties.status==="fixed"?texts.fixed:texts.proposed}</h4>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withLanguage(AgendaExpandedTimeslot);

AgendaExpandedTimeslot.propTypes = {
    timeslot: PropTypes.object,
    handleClose: PropTypes.func,
};