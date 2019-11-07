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
    },
    MuiSelect: {
      input: {
        padding: 0
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
            value={`${profile.given_name} ${profile.family_name}`}
            disabled={profile.assigned}
          >
            <div className="categoryText">
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
    const { plan, parentsProfiles, childrenProfiles } = this.props;
    const pageSize = this.getPageSize(
      plan.solution,
      plan.min_volunteers,
      plan.ratio
    );
    const data = [];
    for (let i = 0; i <= pageSize; i += 1) {
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
          row[subscriptions.slot] = `${profile.given_name} ${
            profile.family_name
          }`;
        } else {
          row[subscriptions.slot] = "";
        }
      });
      data.push(row);
    }
    this.state = {
      data,
      plan,
      profiles: parentsProfiles,
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
    data[row][column] = value;
    this.setState({ data });
  };

  getRemainingOptions = slot => {
    const { profiles, data } = this.state;
    const alreadyAssigned = [];
    data.forEach(row => {
      alreadyAssigned.push(row[slot]);
    });
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
              profiles={this.getRemainingOptions(subscriptions.slot)}
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
        style: { width: "140px" }
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
  plan: PropTypes.object
};

Cell.propTypes = {
  value: PropTypes.string,
  handleSelect: PropTypes.func,
  profiles: PropTypes.array
};

Header.propTypes = {
  header: PropTypes.string,
  setShowingSlot: PropTypes.number,
  fullfilled: PropTypes.bool
};
