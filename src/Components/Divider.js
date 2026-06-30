import React from 'react';

function CustomDivider({ color = 'black', thickness = '5px', width='25%' }) {
      const dividerStyle = {
            borderBottom: `${thickness} solid ${color}`,
            width: width
      };

      return <div style={dividerStyle}></div>;
}

export default CustomDivider;
