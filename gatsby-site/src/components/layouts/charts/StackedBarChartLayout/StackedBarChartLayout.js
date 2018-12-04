import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';

import styles from "./StackedBarChartLayout.module.css";

import {ChartTitle} from "../../../charts/ChartTitle";
import {StackedBarChart} from "../../../charts/StackedBarChart";
import {ChartLegendStandard} from "../../../charts/ChartLegendStandard";
import {Accordion} from "../../Accordion";

import utils from "../../../../js/utils";

class StackedBarChartLayout extends React.Component{

  state = { 
    dataSet: this.props.dataSet
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ dataSet: nextProps.dataSet });
  }

  shouldComponentUpdate(nextProps) {
    return (this.state.dataSet !== undefined && (JSON.stringify(this.state.dataSet.LastUpdated) !== JSON.stringify(nextProps.dataSet.LastUpdated)) );
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
    let dataKey = this.state.chartDataKeyHovered || this.state.chartDataKeySelected;
    return (
      <ChartLegendStandard 
        dataTest={this.state.data}
        headerName={this.props.chartLegendHeaderName} 
        headerNameForValues={this.props.chartDisplayConfig.legendLabels && this.props.chartDisplayConfig.legendLabels[dataKey]}
        data={(this.state.chartLegendDataHovered && this.state.chartLegendDataHovered[0]) || this.state.chartLegendData[0]}
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

      </div>
    );
  }
}



StackedBarChartLayout.propTypes = {
    /** This object holds all the related information for the dataSet. 
    It also provides a LastUpdated property to verify this component should update. */
    dataSet: PropTypes.object,

}

export default StackedBarChartLayout;


  /*

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

*/