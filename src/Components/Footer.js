import React from 'react'
import '../Stylesheet/Componentstyle.scss'

function Footer() {
      return (
            <>
                  <div className='footer'>
                        <p style={{ fontSize: "15px", fontStyle: "italic", color: "#ffffff" , marginTop:15, opacity:0.8,height:"1.4rem"}}>Powered by</p>
                        <img className='imgStyle' src="../../Images/Picture1.png"/>
                  </div>
            </>
      )
}

export default Footer
