import React from "react";
function Loader({height,width,border, borderColors}) {
  return (
    <div style={{height:`${height}px`,width:`${width}px`}} className="lds-ring mx-auto">
      <div style={{height:`${height}px`,  width:`${width}px`,  borderWidth:`${border}px`,  borderColor: `${borderColors} !important`,  borderStyle:'solid'}}></div>
      <div style={{height:`${height}px`,  width:`${width}px`,  borderWidth:`${border}px`,  borderColor: `${borderColors} !important`,  borderStyle:'solid'}}></div>
      <div style={{height:`${height}px`,  width:`${width}px`,  borderWidth:`${border}px`,  borderColor: `${borderColors} !important`,  borderStyle:'solid'}}></div>
      <div style={{height:`${height}px`,  width:`${width}px`,  borderWidth:`${border}px`,  borderColor: `${borderColors} !important`,  borderStyle:'solid'}}></div>
    </div>
  );
}

export default Loader;