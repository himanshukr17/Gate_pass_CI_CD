import React from "react";
import '../Stylesheet/Componentstyle.scss'

const Content = (props) => {

      if (props.fixed) {
            return (
                  <div style={[{flexGrow:1}, props.style]}>
                        {props.children}

                  </div>
            )
      }
      else {
            return (
                  <div className="content" contentContainerStyle={[ props.style]}>
                        {props.children}

                  </div>
            )
      }
};


export default Content;
