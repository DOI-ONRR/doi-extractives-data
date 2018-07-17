import React from 'react';
import DataAndDocIcon from '-!svg-react-loader!img/svg/icon-data-docs.svg';

const DataAndDocs = (props) => ( 
    <span>
        <DataAndDocIcon />
        {props.children === undefined ?
            'Data and documentation' :
            props.children}
    </span>
);

export default DataAndDocs;