import React from 'react';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';

import styles from "./StackedBarChartLayout.module.css";

import {ChartTitle} from "../../../charts/ChartTitle";
import {StackedBarChart} from "../../../charts/StackedBarChart";
import {ChartLegendStandard} from "../../../charts/ChartLegendStandard";
import {Accordion} from "../../Accordion";

import utils from "../../../../js/utils";

class StackedBarChartLayout extends React.Component{

  state ={ 
    chartData: this.props.chartData,
    chartLegendData: undefined,
    chartDataKeySelected: this.props.defaultSelected,
    chartDataGroupName: undefined
  }

  componentWillReceiveProps(nextProps) {
    let {chartDataKeySelected, chartLegendData, chartData} = nextProps;
    this.setState({chartData: chartData, chartLegendData: chartLegendData, chartDataKeySelected: chartDataKeySelected});
  }

  barChartDataSelected(data, groupName) {
    let key = Object.keys(data)[0];
    this.setState({chartLegendData: data[key], chartDataKeySelected: key, chartDataGroupName: groupName});
  }

  render() {
    let props = this.props;
    return ( 
      <div className={styles.root}>
        <ChartTitle>{props.chartDisplayConfig.title}</ChartTitle>
        {this.state.chartData &&
          <div className={styles.chart}>
            <StackedBarChart 
              displayConfig={props.chartDisplayConfig}
              data={this.state.chartData} 
              groups={props.chartGroups} 
              defaultSelected={this.state.chartDataKeySelected}
              barSelectedCallback={this.barChartDataSelected.bind(this)} >
            </StackedBarChart>
          </div>
        }
        {this.state.chartLegendData &&
          <MediaQuery maxWidth={768}>
            <Accordion id={utils.formatToSlug(props.chartDisplayConfig.title)} text={["Show details", "Hide details"]}>
              <ChartLegendStandard 
                displayConfig={props.chartDisplayConfig}
                header={props.chartLegendHeader} 
                units={props.chartLegendUnits}
                data={this.state.chartLegendData[0]}
                dataKey={this.state.chartDataGroupName || this.state.chartDataKeySelected}
                dataFormatFunc={props.chartLegendDataFormatFunc} >
              </ChartLegendStandard>
            </Accordion>
          </MediaQuery>
        }
        {this.state.chartLegendData &&
          <MediaQuery minWidth={769}>
            <ChartLegendStandard 
              displayConfig={props.chartDisplayConfig}
              header={props.chartLegendHeader}  
              units={props.chartLegendUnits}
              data={this.state.chartLegendData[0]}
              dataKey={this.state.chartDataGroupName || this.state.chartDataKeySelected}
              dataFormatFunc={props.chartLegendDataFormatFunc} >
            </ChartLegendStandard>
          </MediaQuery>
        }
      </div>
    );
  }
}

StackedBarChartLayout.propTypes = {
    /** The object that contains properties for display */
    chartDisplayConfig: PropTypes.object,
    /** The data to populate the chart */
    chartData: PropTypes.array,
    /** The object will draw a line under the x-axis labels by group */
    chartGroups: PropTypes.object,
    /** The data set to be selected on page load. */
    defaultSelected: PropTypes.string,
    /** The title to appear on top of the legend */
    chartLegendHeader: PropTypes.array,
    /** Data that will appear in the legend. Array of key value pairs */
    chartLegendData: PropTypes.array,
}

export default StackedBarChartLayout;