import React from 'react';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';

import styles from "./StackedBarChartLayout.module.css";

import {ChartTitle} from "../../../charts/ChartTitle";
import {StackedBarChart} from "../../../charts/StackedBarChart";
import {ChartLegendStandard} from "../../../charts/ChartLegendStandard";
import {Accordion} from "../../Accordion";

import utils from "../../../../js/utils";

const StackedBarChartLayout = (props) => ( 
  <div className={styles.root}>
    <ChartTitle>{props.chartTitle}</ChartTitle>
    <div className={styles.chart}>
      <StackedBarChart units={props.units} data={props.chartData} groups={props.chartGroups} defaultSelected={props.defaultSelected} ></StackedBarChart>
    </div>
    <MediaQuery maxWidth={768}>
      <Accordion id={utils.formatToSlug(props.chartTitle)} text={["Show details", "Hide details"]}>
        <ChartLegendStandard 
          header={props.chartLegendHeader} 
          data={props.chartLegendData} >
        </ChartLegendStandard>
      </Accordion>
    </MediaQuery>
    <MediaQuery minWidth={769}>
      <ChartLegendStandard 
        header={props.chartLegendHeader} 
        data={props.chartLegendData} >
      </ChartLegendStandard>
    </MediaQuery>
  </div>
);

StackedBarChartLayout.propTypes = {
    /** The title to appear on top of the chart */
    chartTitle: PropTypes.string,
    /** The data to populate the chart */
    chartData: PropTypes.array,
    /** The array will draw a line under the x-axis labels by group */
    chartGroups: PropTypes.array,
    /** The data set to be selected on page load. */
    defaultSelected: PropTypes.string,
    /** The title to appear on top of the legend */
    chartLegendHeader: PropTypes.array,
    /** Data that will appear in the legend. Array of key value pairs */
    chartLegendData: PropTypes.array,
}

export default StackedBarChartLayout;