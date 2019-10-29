import React from "react";
import { Skeleton } from "antd";
import axios from "axios";
import PropTypes from "prop-types";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import BackNavigation from "./BackNavigation";
import Texts from "../Constants/Texts";
import withLanguage from "./LanguageContext";

const theme = createMuiTheme({
  typography: {
    useNextVariants: true
  },
  overrides: {
    MuiTable: {
      root: {
        border: "1px solid rgba(0,0,0,0.1)",
        fontFamily: "Roboto"
      }
    },
    MuiTableCell: {
      root: {
        texAlign: "center",
        fontSize: "1.6rem!important",
        border: "1px solid rgba(0,0,0,0.1)"
      }
    }
  }
});

class GroupManagementScreen extends React.Component {
  state = {
    fetchedData: false
  };

  async componentDidMount() {
    const { match } = this.props;
    const { groupId } = match.params;
    const metricsResponse = await axios.get(`/api/groups/${groupId}/metrics`);
    const metrics = metricsResponse.data;
    this.setState({
      fetchedData: true,
      metrics
    });
  }

  handleBackNav = () => {
    const { history } = this.props;
    history.goBack();
  };

  renderMetrics = () => {
    const { language } = this.props;
    const { metrics } = JSON.parse(JSON.stringify(this.state));
    delete metrics.contributions;
    const properties = Object.keys(metrics);
    const values = Object.values(metrics);
    const texts = Texts[language].groupManagementScreen;

    return (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{texts.metricsColumn}</TableCell>
            <TableCell>{texts.valuesColumn}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {properties.map((property, index) => (
            <TableRow key={property}>
              <TableCell component="th" scope="row">
                {texts[property]}
              </TableCell>
              <TableCell align="right">{values[index]}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  renderChart = () => {
    const {
      metrics: { contributions }
    } = this.state;
    const chartData = contributions.map(c => ({
      volunteer: `${c.given_name[0]} ${c.family_name[0]}`,
      name: `${c.given_name} ${c.family_name}`,
      value: c.contribution
    }));
    const min = 0;
    const max = Math.max(contributions.map(c => c.contribution));
    return (
      <div className="chartsContainer">
        <ResponsiveContainer width="80%" height={300}>
          <BarChart data={chartData} maxBarSize={50}>
            <XAxis dataKey="volunteer" />
            <YAxis domain={[min, max]} />
            <Tooltip />
            <Bar
              dataKey="value"
              fill="#00838F"
              layout="horizontal"
              name="name"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  render() {
    const { language } = this.props;
    const texts = Texts[language].groupManagementScreen;
    const { fetchedData } = this.state;
    return (
      <MuiThemeProvider theme={theme}>
        <BackNavigation
          title={texts.backNavTitle}
          onClick={this.handleBackNav}
        />
        <div className="interface-container">
          {fetchedData ? (
            <React.Fragment>
              <div className="analytics-header">{texts.metricsHeader}</div>
              {this.renderMetrics()}
              <div className="analytics-header">{texts.chartHeader}</div>
              {this.renderChart()}
            </React.Fragment>
          ) : (
            <Skeleton active paragraph={{ rows: 15 }} />
          )}
        </div>
      </MuiThemeProvider>
    );
  }
}

GroupManagementScreen.propTypes = {
  language: PropTypes.string,
  history: PropTypes.object,
  match: PropTypes.object
};

export default withLanguage(GroupManagementScreen);
