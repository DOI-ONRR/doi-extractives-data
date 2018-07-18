import React from 'react';
import icon from "img/icons/icon-circled-minus.svg";
//import 'js/components/eiti-bar-chart';

const ChartTitle = (props) => {
    return (
        <h3 className="chart-title">
            <button is="aria-toggle"
                    aria-expanded="false"
                    aria-controls={ props.chartToggle }
                    class="chart-title-button">
                <span className="hide-expanded chart-title-small">
                    <span>
                        { props.children }
                        { props.chartUnitsTitle && props.chartUnitsTitle }
                    </span>
                    {props.chartValues &&
                        <eiti-bar-chart
                            data={JSON.stringify(props.chartValues)}
                            x-range="[2007, 2016]"
                            x-value={2016}
                            data-units="units"
                            is-icon={props.isIcon}
                            class="bar-chart-icon">
                        </eiti-bar-chart>
                    }

                </span>
                <span className="show-expanded chart-title-small">
                    <span>
                        { props.children }
                        { props.chartUnitsTitle && props.chartUnitsTitle }
                    </span>
                    <img className="chart-title-icon" alt="icon with a minus sign" src={icon}/>
                </span>
            </button>
            <span className="chart-title-large">{ props.children }</span>
        </h3>
    );
}

export default ChartTitle;