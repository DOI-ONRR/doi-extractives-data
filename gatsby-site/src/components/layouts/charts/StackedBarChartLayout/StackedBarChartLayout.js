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
    chartLegendData: this.props.chartLegendData,
    chartDataKeySelected: this.props.chartDataKeySelected,
    chartLegendDataHovered: undefined,
    chartDataKeyHovered: undefined,
    forceChartUpdate: false
  }

  componentWillReceiveProps(nextProps) {
    this.setState({...nextProps});
  }

  barChartDataSelected(data) {
    let key = Object.keys(data)[0];
    
    this.setState({chartLegendData: data[key], chartDataKeySelected: key});
  }

  barChartDataHovered(data, isHover) {
    if(isHover) {
      let key = Object.keys(data)[0];
      this.setState({chartLegendDataHovered: data[key], chartDataKeyHovered: key});
    }
    else {
      this.setState({chartLegendDataHovered: undefined, chartDataKeyHovered: undefined});
    }
  }

  getStyleMap(){
    return (this.state.chartDataKeyHovered && 
        (this.props.chartDisplayConfig.styleMap && this.props.chartDisplayConfig.styleMap.hover)) ? 
        this.props.chartDisplayConfig.styleMap.hover : this.props.chartDisplayConfig.styleMap;
  }

  getChartLegend() {

    return (
      <ChartLegendStandard 
        headerName={this.props.chartLegendHeaderName} 
        data={(this.state.chartLegendDataHovered && this.state.chartLegendDataHovered[0]) || this.state.chartLegendData[0]}
        dataKey={this.state.chartDataKeyHovered || this.state.chartDataKeySelected}
        dataFormatFunc={this.props.chartLegendDataFormatFunc}
        styleMap={this.getStyleMap()}
        sortOrder={this.props.chartDisplayConfig.sortOrder}
        units={this.props.chartDisplayConfig.units} >
      </ChartLegendStandard>
    );
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
              barSelectedCallback={this.barChartDataSelected.bind(this)}
              barHoveredCallback={this.barChartDataHovered.bind(this)}
              forceUpdate={this.state.forceChartUpdate}
              maxBarSize={this.props.maxBarSize} >
            </StackedBarChart>
          </div>
        }
        {this.state.chartLegendData &&
          <MediaQuery maxWidth={768}>
            <Accordion id={utils.formatToSlug(props.chartDisplayConfig.title)} text={["Show details", "Hide details"]}>
              {this.getChartLegend()}
            </Accordion>
          </MediaQuery>
        }
        {this.state.chartLegendData &&
          <MediaQuery minWidth={769}>
            {this.getChartLegend()}
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