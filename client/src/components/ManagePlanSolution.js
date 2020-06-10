import React from "react";
import PropTypes from "prop-types";
import ReactTable from "react-table";
import "react-table/react-table.css";
import { Select, MenuItem } from "@material-ui/core";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import withLanguage from "./LanguageContext";

import Texts from "../Constants/Texts";

const EmptyCell = () => <div className="emptyCell" />;

const theme = createMuiTheme({
  typography: {
    useNextVariants: true
  },
  overrides: {
    MuiInputBase: {
      root: {
        width: "100%"
      }
    }
  }
});

const Cell = ({ value, handleSelect, profiles }) => {
  return (
    <Select value={value} onChange={handleSelect}>
      {profiles.map(profile => {
        return (
          <MenuItem
            key={profile.user_id}
            value={`${profile.given_name} ${profile.family_name}`}
            disabled={profile.assigned}
          >
            <div style={{ fontSize: "1.2rem" }}>
              {`${profile.given_name} ${profile.family_name}`}
            </div>
          </MenuItem>
        );
      })}
    </Select>
  );
};

const Header = ({ header, setShowingSlot, fullfilled }) => {
  return (
    <div
      style={fullfilled ? { backgroundColor: "#00838F" } : {}}
      role="button"
      tabIndex={-42}
      onClick={setShowingSlot}
      className="columnHeader"
    >
      {header}
    </div>
  );
};

class ManagePlanSolution extends React.Component {
  constructor(props) {
    super(props);
    const { plan, parentsProfiles, childrenProfiles, handleEdits } = this.props;
    const pageSize = this.getPageSize(
      plan.solution,
      plan.min_volunteers,
      plan.ratio
    );
    const data = [];
    for (let i = 0; i < pageSize; i += 1) {
      const row = [];
      plan.solution.forEach(subscriptions => {
        const required = Math.ceil(subscriptions.children.length / plan.ratio);
        if (
          i <= Math.max(required, plan.min_volunteers) &&
          i < subscriptions.volunteers.length
        ) {
          const profile = parentsProfiles.find(
            p => p.user_id === subscriptions.volunteers[i]
          );
          row[subscriptions.slot] = `${profile.given_name} ${profile.family_name}`;
        } else {
          row[subscriptions.slot] = "";
        }
      });
      data.push(row);
    }
    handleEdits(data);
    this.state = {
      data,
      plan,
      profilesFilter: "available",
      parentsProfiles,
      childrenProfiles,
      pageSize,
      showingSlot: 0
    };
  }

  getChildName = (profiles, id) => {
    const profile = profiles.find(p => p.child_id === id);
    if (profile) {
      return `${profile.given_name} ${profile.family_name}`.toUpperCase();
    }
    return "";
  };

  getPageSize = (solution, min, ratio) => {
    let pageSize = min;
    solution.forEach(subscriptions => {
      const required = Math.ceil(subscriptions.children.length / ratio);
      if (required > pageSize) {
        pageSize = required;
      }
    });
    return pageSize;
  };

  handleSelect = (value, row, column) => {
    const { data } = this.state;
    const { handleEdits } = this.props;
    data[row][column] = value;
    handleEdits(data);
    this.setState({ data });
  };

  getProfiles = slot => {
    const {
      data,
      profilesFilter,
      parentsProfiles,
      plan: { participants, participant, solution }
    } = this.state;
    const alreadyAssigned = [];
    data.forEach(row => {
      alreadyAssigned.push(row[slot]);
    });
    let profiles;
    switch (profilesFilter) {
      case "all":
        profiles = parentsProfiles;
        break;
      case "participating":
        const participating = [...participants, participant].map(
          p => p.user_id
        );
        profiles = parentsProfiles.filter(p =>
          participating.includes(p.user_id)
        );
        break;
      case "available":
        const available = solution.find(s => s.slot === slot).volunteers;
        profiles = parentsProfiles.filter(p => available.includes(p.user_id));
        break;
      default:
        profiles = [];
    }
    return profiles.map(p => ({
      ...p,
      assigned: alreadyAssigned.includes(`${p.given_name} ${p.family_name}`)
    }));
  };

  render() {
    const { language } = this.props;
    const texts = Texts[language].managePlanSolution;
    const {
      childrenProfiles,
      showingSlot,
      profilesFilter,
      pageSize,
      data,
      plan: { solution, ratio, min_volunteers: minVolunteers }
    } = this.state;
    const columns = solution.map((subscriptions, index) => {
      const required = Math.ceil(subscriptions.children.length / ratio);
      const slotSubscriptions = data.reduce(
        (a, b) => (b[subscriptions.slot] !== "" ? a + 1 : a),
        0
      );
      return {
        Header: (
          <Header
            fullfilled={Math.max(required, minVolunteers) === slotSubscriptions}
            header={subscriptions.slot}
            setShowingSlot={() => this.setState({ showingSlot: index })}
          />
        ),
        Cell: props =>
          props.index > Math.max(required, minVolunteers) - 1 ? (
            <EmptyCell />
          ) : (
              <Cell
                {...props}
                profiles={this.getProfiles(subscriptions.slot)}
                handleSelect={event =>
                  this.handleSelect(
                    event.target.value,
                    props.index,
                    subscriptions.slot
                  )
                }
              />
            ),
        accessor: subscriptions.slot,
        minWidth: 120
      };
    });
    return (
      <MuiThemeProvider theme={theme}>
        <div className="solutionContainer">
          <div className="col-8-10" style={{ maxWidth: "80%" }}>
            <ReactTable
              showPagination={false}
              sortable={false}
              minRows={0}
              pageSize={pageSize}
              columns={columns}
              data={data}
            />
            <div className="row no-gutters" style={{ marginTop: "2rem" }}>
              <div className="categoryText">{texts.selectFrom}</div>
              <div style={{ width: "100" }}>
                <Select
                  value={profilesFilter}
                  onChange={event => {
                    this.setState({ profilesFilter: event.target.value });
                  }}
                >
                  <MenuItem value="available">
                    <div className="categoryText">{texts.available}</div>
                  </MenuItem>
                  <MenuItem value="participating">
                    <div className="categoryText">{texts.participating}</div>
                  </MenuItem>
                  <MenuItem value="all">
                    <div className="categoryText">{texts.all}</div>
                  </MenuItem>
                </Select>
              </div>
            </div>
          </div>
          <div className="col-2-10">
            <ul className="childrenNeedsList">
              <li className="childrenNeedsListHeader">{texts.needsHeader}</li>
              {solution[showingSlot].children.map(child => (
                <li key={child} className="childNeedItem">
                  {this.getChildName(childrenProfiles, child)}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default withLanguage(ManagePlanSolution);

ManagePlanSolution.propTypes = {
  language: PropTypes.string,
  parentsProfiles: PropTypes.array,
  childrenProfiles: PropTypes.array,
  plan: PropTypes.object,
  handleEdits: PropTypes.func
};

Cell.propTypes = {
  value: PropTypes.string,
  handleSelect: PropTypes.func,
  profiles: PropTypes.array
};

Header.propTypes = {
  header: PropTypes.string,
  setShowingSlot: PropTypes.func,
  fullfilled: PropTypes.bool
};
