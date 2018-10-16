import React from 'react';
import PropTypes from 'prop-types';

import styles from "./StackedBarChartLayout.module.css";

import {ChartTitle} from "../../../charts/ChartTitle";
import {StackedBarChart} from "../../../charts/StackedBarChart";
import {ChartLegendStandard} from "../../../charts/ChartLegendStandard";

const StackedBarChartLayout = (props) => ( 
    <div className={styles.root}>
        <ChartTitle>{props.chartTitle}</ChartTitle>
        <StackedBarChart></StackedBarChart>
        <ChartLegendStandard 
            header={props.chartLegendHeader} 
            data={props.chartLegendData} >
        </ChartLegendStandard>
    </div>
);

StackedBarChartLayout.propTypes = {
    /** The title to appear on top of the chart */
    chartTitle: PropTypes.string,
    /** The title to appear on top of the legend */
    chartLegendHeader: PropTypes.array,
    /** Data that will appear in the legend. Array of key value pairs */
    chartLegendData: PropTypes.array,
}

export default StackedBarChartLayout;