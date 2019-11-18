import React from "react";
import PropTypes from "prop-types";
import MediaQuery from "react-responsive";

import styles from "./StackedBarChartLayout.module.scss";

import { ChartTitle } from "../../../charts/ChartTitle";
import { StackedBarChart } from "../../../charts/StackedBarChart";
import { ChartLegendStandard } from "../../../charts/ChartLegendStandard";
import { Accordion } from "../../Accordion";

import utils from "../../../../js/utils";

const MAX_CHART_BAR_SIZE = 15;

class StackedBarChartLayout extends React.Component {
  state = {
    dataSet: this.props.dataSet,
    barHovered: this.props.barHovered
  };

  componentWillReceiveProps(nextProps) {
    this.setState({ dataSet: nextProps.dataSet, barHovered: undefined });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      (this.state.dataSet !== undefined &&
        this.state.dataSet.lastUpdated !== nextProps.dataSet.lastUpdated) ||
      this.state.barHovered !== nextState.barHovered ||
      this.state.dataSet.selectedDataKey !== nextProps.dataSet.selectedDataKey
    );
  }

  barHoveredCallback(data, isHover) {
    if (isHover) {
      this.setState({ barHovered: data });
    } else {
      this.setState({ barHovered: undefined });
    }
  }

  getStyleMap() {
    return this.state.chartDataKeyHovered &&
      (this.props.chartDisplayConfig.styleMap &&
        this.props.chartDisplayConfig.styleMap.hover)
      ? this.props.chartDisplayConfig.styleMap.hover
      : this.props.chartDisplayConfig.styleMap;
  }

  getChartLegend() {
    console.log('this.props: ', this.props)
    let {
      legendTitle,
      legendDataFormatFunc,
      sortOrder,
      styleMap,
      showUnits,
      displayNames
    } = this.props;
    let { data, legendLabels, selectedDataKey, units } = this.state.dataSet;
    let legendData;
    if (this.state.barHovered) {
      selectedDataKey = Object.keys(this.state.barHovered)[0];
      legendData = this.state.barHovered[selectedDataKey][0];
      styleMap = styleMap.hover;
    } else {
      let selectedData = data.find(
        dataItem => Object.keys(dataItem)[0] === selectedDataKey
      );
      legendData = selectedData && selectedData[selectedDataKey][0];
    }
    let unitsForValues = "";
    if (showUnits) {
      unitsForValues = " (" + units + ")";
    }

    return (
      <ChartLegendStandard
        headerName={legendTitle}
        headerNameForValues={
          (legendLabels && legendLabels[selectedDataKey]) + unitsForValues
        }
        data={legendData}
        dataFormatFunc={legendDataFormatFunc}
        styleMap={styleMap}
        sortOrder={sortOrder}
        units={units}
        displayNames={displayNames}
      ></ChartLegendStandard>
    );
  }

  render() {
    let {
      title,
      sortOrder,
      styleMap,
      barSelectedCallback,
      showUnits
    } = this.props;
    let {
      data,
      selectedDataKey,
      groupNames,
      longUnits,
      xAxisLabels
    } = this.state.dataSet;

    return (
      <div className={styles.root}>
        <ChartTitle>
          {title} {" (" + longUnits + ")"}
        </ChartTitle>

        {this.state.dataSet && (
          <div>
            <div className={styles.chart}>
              <StackedBarChart
                data={data}
                selectedDataKey={selectedDataKey}
                sortOrder={sortOrder}
                groups={groupNames}
                styleMap={styleMap}
                units={longUnits}
                maxBarSize={MAX_CHART_BAR_SIZE}
                barSelectedCallback={barSelectedCallback}
                barHoveredCallback={this.barHoveredCallback.bind(this)}
                xAxisLabels={xAxisLabels}
              />
            </div>
            <MediaQuery minWidth={769}>{this.getChartLegend()}</MediaQuery>
            <MediaQuery maxWidth={768}>
              <Accordion
                id={utils.formatToSlug(title)}
                text={["Show details", "Hide details"]}
              >
                {this.getChartLegend()}
              </Accordion>
            </MediaQuery>
          </div>
        )}
      </div>
    );
  }
}

StackedBarChartLayout.propTypes = {
  /** Title to display for the chart. Appears at the top. */
  title: PropTypes.string,
  /** Order to display the data keys */
  sortOrder: PropTypes.array,
  /** Styling for each data key */
  styleMap: PropTypes.object,
  /** This object holds all the related information for the dataSet.
    It also provides a LastUpdated property to verify this component should update. */
  dataSet: PropTypes.object
};

export default StackedBarChartLayout;

/*

headerNameForValues={this.props.chartDisplayConfig.legendLabels && this.props.chartDisplayConfig.legendLabels[dataKey]}

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
